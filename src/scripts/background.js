import escapeRegExp from 'lodash.escaperegexp';

const storage = {};
const notificationConfig = {
  id: 'tabLimiter',
  get(tab) {
    return {
      type: 'basic',
      iconUrl: '../icon/icon_128.png',
      title: 'Tab Limiter',
      message: `'${tab.title}'
                                                    🤓 closed`,
      buttons: [
        {
          title: chrome.i18n.getMessage('btnMsg1'),
          iconUrl: '../icon/pin.png'
        }, {
          title: chrome.i18n.getMessage('btnMsg2'),
          iconUrl: '../icon/close.png'
        }
      ]
    };
  }
};
const cache = {
  notification: {tab: null}
};

/**
 * 設定を取る
 */
function getSetting() {
  return new Promise(resolve => {
    chrome.storage.local.get(null, storage => {
      if (hasObject(storage)) {
        storage.setting.itemsRe = (() => {
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
        chrome.tabs.query({pinned: false, windowId: win.id}, tabs => {
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
function createTab() {
  return new Promise(resolve => {
    chrome.tabs.create({
      url: cache.notification.tab.url,
      pinned: true,
      active: false
    }, () => {
      cache.notification.tab = null;
      resolve();
    });
  })
}

/**
 * タブを閉じる
 */
function closeTab(re, tabs) {
  return new Promise(resolve => {
    const priorities = tabs.filter(tab => {
      if (re === null) {
        return false;
      }
      return re.test(tab.url);
    });
    if (priorities.length === 0) {
      chrome.tabs.remove(tabs[0].id, () => resolve(tabs[0]));
    } else {
      chrome.tabs.remove(priorities[0].id, () => resolve(priorities[0]));
    }
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
          closeTab(setting.itemsRe, tabs)
            .then(closedTab => {
              resolve(closedTab);
            });
        }
      });
    });
}

/**
 * 削除されたタブ情報を表示
 */
function notify(tab = null) {
  if (tab !== null) {
    return clearNotify().then(() => createNotify(tab));
  }
}

/**
 * 通知を作る
 */
function createNotify(tab) {
  return new Promise(resolve => {
    chrome.notifications.create(
      notificationConfig.id,
      notificationConfig.get(tab),
      () => resolve(tab)
    )
  });
}

/**
 * 通知を閉じる
 */
function clearNotify() {
  return new Promise(resolve => {
    chrome.notifications.clear(
      notificationConfig.id,
      () => resolve()
    );
  });
};

/**
 * メイン処理を実行
 */
chrome.tabs.onCreated.addListener(tab => {
  getSetting()
    .then(setting => closeTabIfCxceedsUpperLimit(tab, setting))
    .then(closedTab => notify(closedTab))
    .then(closedTab => cache.notification.tab = closedTab);
});

/**
 * 通知のボタンをおした時にそれぞれ処理を実行する
 */
chrome.notifications.onButtonClicked.addListener((id, btnIdx) => {
  switch (btnIdx) {
    case 0:
      return createTab().then(() => clearNotify());
    case 1:
      return clearNotify();
  }
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
