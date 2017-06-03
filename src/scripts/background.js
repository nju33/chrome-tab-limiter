import escapeRegExp from 'lodash.escaperegexp';

const storage = {};
const notification = {};

function getNotificationConfig(tab) {
  return {
    type: 'basic',
    iconUrl: tab.favIconUrl || '../icon/default.png',
    title: chrome.i18n.getMessage('title'),
    message: tab.title,
    buttons: [
      {
        title: chrome.i18n.getMessage('btnMsg1'),
        iconUrl: '../icon/open.png'
      }
    ]
  };
}

/**
 * 設定を取る
 */
function getSetting() {
  return new Promise(resolve => {
    chrome.storage.local.get(null, storage => {
      if (hasObject(storage)) {
        storage.setting.itemsRe = (() => {
          // v1
          if (typeof storage.setting.priority === 'string') {
            storage.setting.items = storage.setting.priority.split(/\n+/);
          }
          if (storage.setting.items.length === 0) {
            return null;
          }
          return new RegExp(storage.setting.items.map(item => {
            return escapeRegExp(item);
          }).join('|'));
        })();
        resolve(storage.setting);
      }
    });
  });
}

/**
 * 現在のウィンドウで開かれているピン化していないタブ一覧を取得
 */
function getUnpinnedTabs() {
  return new Promise(resolve => {
    getCurrentWindow()
      .then(win => {
        chrome.tabs.query({
          pinned: false,
          windowId: win.id
        }, tabs => {
          resolve(tabs);
        });
      });
  });
}

/**
 * 現在のウィンドウを取得
 */
function getCurrentWindow() {
  return new Promise(resolve => {
    chrome.windows.getCurrent(win => {
      resolve(win);
    });
  });
}

/**
 * タブをピン化して戻す
 */
function createTab(tab) {
  return new Promise(resolve => {
    chrome.tabs.create({
      url: tab.url,
      pinned: true,
      active: false
    }, () => {
      resolve();
    });
  })
}

function closeTab(tab) {
  return new Promise(resolve => {
    chrome.tabs.remove(tab.id, () => resolve(tab));
  });
}

function closeTabs(re, tabs, len) {
  return new Promise(resolve => {
    const priorities = tabs.filter(tab => {
      if (re === null) {
        return false;
      }
      return re.test(tab.url);
    });

    const $closedTabs = [];
    while (len-- > 0) {
      if (priorities.length === 0 && tabs.length === 0) {
        break;
      }

      let target = null;
      if (priorities.length > 0 && priorities[0].status === 'complete') {
        target = priorities.shift();
      } else if (priorities.length > 0) {
        priorities.shift();
        len++;
      } else if (tabs.length > 0 && tabs[0].status === 'complete') {
        target = tabs.shift();
      } else {
        tabs.shift();
        len++;
      }

      if (target !== null) {
        $closedTabs.push(closeTab(target));
      }
    }

    Promise.all($closedTabs)
      .then(closedTabs => resolve(closedTabs));
  });
}

/**
 * もし上限を超えてたら削除
 */
function closeTabIfCxceedsUpperLimit(tab, setting) {
  return getUnpinnedTabs()
    .then(tabs => {
      return new Promise(resolve => {
        if (tabs.length === 0) {
          resolve();
        } else if (tabs.length > setting.tabNum) {
          const len = tabs.length - setting.tabNum;
          closeTabs(setting.itemsRe, tabs, len)
            .then(closedTabs => resolve(closedTabs))
        }
      });
    });
}

/**
 * 通知を作る
 */
function createNotify(tab) {
  return new Promise(resolve => {
    chrome.notifications.create(
      getNotificationConfig(tab),
      nid => {
        notification[nid] = tab;
        setTimeout(() => {
          if (notification[nid]) {
            clearNotify(nid);
          }
        }, 5000);
        resolve(tab);
      }
    )
  });
}

/**
 * 通知を閉じる
 */
function clearNotify(nid) {
  return new Promise(resolve => {
    chrome.notifications.clear(nid, () => resolve());
  });
};

/**
 * メイン処理を実行
 */
let tid = null;
const onCreated = tab => {
  getSetting()
    .then(setting => {
      return new Promise((resolve, reject) => {
        closeTabIfCxceedsUpperLimit(tab, setting)
          .then(closedTabs => {
            if (setting.notify) {
              return resolve(closedTabs);
            }
            reject();
          });
      });
    })
    .then(closedTabs => {
      if (tid !== null) {
        clearTimeout(tid);
        tid = null;
      }
      closedTabs.forEach(t => createNotify(t));
    })
    .catch(() => {});
}
chrome.tabs.onCreated.addListener(onCreated);

chrome.notifications.onClosed.addListener(nid => {
  if (notification[nid]) {
    delete notification[nid];
  }
});

chrome.notifications.onClicked.addListener(nid => {
  clearNotify(nid);
});

/**
 * 通知のボタンをおした時にそれぞれ処理を実行する
 */
chrome.notifications.onButtonClicked.addListener((nid, btnIdx) => {
  const tab = notification[nid];
  if (typeof tab === 'undefined') {
    return;
  }
  createTab(tab).then(() => clearNotify(nid));
});

/**
 * 拡張インストール時に初期データをローカルに保存
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(null, storage => {
    if (hasObject(storage)) {
      return;
    }
    Object.assign(storage, {
      setting: {
        tabNum: 15,
        notify: true,
        items: ''
      }
    });
    chrome.storage.local.set(storage, () => {});
  });
});

function hasObject(obj) {
  return Object.keys(obj).length !== 0;
}
