chrome.storage.local.get ['setting'], (res) ->
  if chrome.extension.lastError then alert '不明なエラーが起こりました。'
  else
    app = new Vue
      el: '#ctrl'
      components:
        'option-number':
          template: """<div class="option-group"><span>{{label}}</span><input type="number" v-model="model"></div>"""
        'option-check':
          template: """<div class="option-group"><input type="checkbox" v-model="model"><span>{{label}}</span></div>"""
        'option-textarea':
          template: """<div class="option-group"><span class="block">{{label}}</span><textarea v-model="model" placeholder="chrome://newtab/\nhttps://www.google.co.jp/search?"></textarea></div>"""
        'option-submit':
          template: """<div class="option-group"><button v-on="click: submit">{{label}}</button></div>"""

      data:
        setting: res.setting
        locales:
          tab: chrome.i18n.getMessage 'labelTab'
          notify: chrome.i18n.getMessage 'labelNotify'
          priority: chrome.i18n.getMessage 'labelPriority'
          save: chrome.i18n.getMessage 'labelSave'

      methods:
        submit: ->
          res.setting = @setting
          chrome.storage.local.set res, ->

