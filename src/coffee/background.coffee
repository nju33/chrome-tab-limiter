Q = require 'q'

datas =
  notify:
    id: 'tabLimiter'
    data: ->
      type: 'basic',
      iconUrl: '../icon/icon_128.png'
      title: "#{@title}"
      message: 'Tab closed by [Tab Limiter]'
      buttons: [
        {title: chrome.i18n.getMessage('btnMsg1'), iconUrl: '../icon/pin.png'}
        {title: chrome.i18n.getMessage('btnMsg2'), iconUrl: '../icon/close.png'}
      ]
  setting: null
  tmp: null
  tabs: null
  currentTabAO: []
  pinTab: null

hasObj = (obj) -> Object.keys(obj).length > 0

###*
 * 削除優先URLがあった場合はそのタブを配列の頭へ、
 * 順番は見つけた順に移動させる
 * @param  {Array} tabAO 現在のウィンドウでピンしてないすべてのタブ
 * @return {Array}       削除優先URLタブを先頭に配置し変えた配列
###
shiftPriorityTabs = (tabAO) ->
  priorityRES = datas.setting.priority
                             .split /\n+/
                             .join '*|'
  priorityRE = new RegExp "(#{priorityRES})"
  matchAO = []
  unmatchAO = []

  for tab in tabAO
    if tab.url.match priorityRE
    then matchAO.push tab
    else unmatchAO.push tab

  matchAO.concat unmatchAO

###*
 * 非同期で`setting`オブジェクトのデータを取得する
 * @return {Object} Promiseを返す
###
getSetting = ->
  deferred = Q.defer()
  chrome.storage.local.get ['setting'], (res) ->
    if hasObj res
      datas.setting = res.setting
      deferred.resolve()
    else
      deferred.reject()

  deferred.promise

###*
 * 非同期で、現在のウィンドウで開かれているピン化していないタブ一覧を取得する
 * @return {Object} Promiseを返す
###
getTabs = ->
  deferred = Q.defer()
  chrome.tabs.query {pinned: false, currentWindow: true}, (tabs) ->
    if hasObj tabs
      datas.tabs = if datas.setting.priority isnt '' then shiftPriorityTabs tabs else tabs
      deferred.resolve()
    else
      deferred.reject()

  deferred.promise

###*
 * 一度削除されたタブをピン化した状態で作成する
###
createTab = ->
  Q
  .promise (resolve) ->
    chrome.tabs.create {url: datas.tmp.url, pinned: true, active: false}, ->
      datas.pinTab = datas.tmp.url
      resolve()
  .done -> datas.tmp = null

###*
 * 設定よりも多くのタブを開いていた場合に、
 * 設定したタブ数と同じになるように左側のタブから閉じる
 * @return {Object} Promiseを返す
###
removeOverTabs = ->
  deferred = Q.defer()
  tabSizeN = Object.keys(datas.tabs).length
  removeTabAO = null

  if tabSizeN > datas.setting.tabNum

    if datas.tabs[0].id is datas.currentTabAO.shift().id
    then removeTabAO = datas.tabs.slice 1, tabSizeN - datas.setting.tabNum + 1
    else removeTabAO = datas.tabs.slice 0, tabSizeN - datas.setting.tabNum

    for tab in removeTabAO
      datas.tmp = tab
      chrome.tabs.remove tab.id, -> deferred.resolve()

  else
    deferred.reject()
  deferred.promise

###*
 * ユーザに削除されたタブ情報を表示させる
 * @param  {Object} options 表示させるタイトルやアイコン、メッセージなど
 * @return {Object}         Promiseを返す
###
createNotify = ->
  deferred = Q.defer()
  chrome.notifications.create datas.notify.id, datas.notify.data.call(datas.tmp), -> deferred.resolve()
  deferred.promise

###*
 * 表示されているNotificationIdがある場合、それを閉じる
 * @return {Object}   Promiseを返す
###
clearNotify = ->
  deferred = Q.defer()
  if datas.setting.notify
    chrome.notifications.clear datas.notify.id, -> deferred.resolve()
  else
    deferred.reject()

  deferred.promise

###*
 * メイン処理を実行する
###
doOpenTabLimiter = ->
  getSetting()
  .then -> getTabs()
  .then -> removeOverTabs()
    .then -> clearNotify()
    .then -> createNotify()
  .done()

###*
 * タブが作成された時にそれが削除をキャンセルしたタブじゃない場合、
 * メイン処理を実行する
###
chrome.tabs.onCreated.addListener (tabO) ->
  datas.currentTabAO.push tabO
  if datas.pinTab?
  then datas.pinTab = null
  else doOpenTabLimiter()


###*
 * ボタンをおした時にそれぞれ処理を実行する
 * @param  {String} id     NotifycationId
 * @param  {Number} btnIdx 何番目のボタンが押されたか
###
chrome.notifications.onButtonClicked.addListener (id, btnIdx) ->
  switch btnIdx
    when 0 then createTab()
    when 1 then clearNotify().done()


###*
 * 拡張インストール時にsetting用の初期データをローカルに保存する
###
chrome.runtime.onInstalled.addListener ->
  chrome.storage.local.get ['setting'], (res) ->
    if Object.keys(res).length < 1
      initData =
        setting:
          tabNum: 15
          notify: true
          priority: ''

      chrome.storage.local.set initData, ->
