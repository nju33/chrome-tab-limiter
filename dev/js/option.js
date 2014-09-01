(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
chrome.storage.local.get(['setting'], function(res) {
  var app;
  if (chrome.extension.lastError) {
    return alert('不明なエラーが起こりました。');
  } else {
    return app = new Vue({
      el: '#ctrl',
      components: {
        'option-number': {
          template: "<div class=\"option-group\"><span>{{label}}</span><input type=\"number\" v-model=\"model\"></div>"
        },
        'option-check': {
          template: "<div class=\"option-group\"><input type=\"checkbox\" v-model=\"model\"><span>{{label}}</span></div>"
        },
        'option-textarea': {
          template: "<div class=\"option-group\"><span class=\"block\">{{label}}</span><textarea v-model=\"model\" placeholder=\"chrome://newtab/\nhttps://www.google.co.jp/search?\"></textarea></div>"
        },
        'option-submit': {
          template: "<div class=\"option-group\"><button v-on=\"click: submit\">{{label}}</button></div>"
        }
      },
      data: {
        setting: res.setting,
        locales: {
          tab: chrome.i18n.getMessage('labelTab'),
          notify: chrome.i18n.getMessage('labelNotify'),
          priority: chrome.i18n.getMessage('labelPriority'),
          save: chrome.i18n.getMessage('labelSave')
        }
      },
      methods: {
        submit: function() {
          res.setting = this.setting;
          return chrome.storage.local.set(res, function() {});
        }
      }
    });
  }
});



},{}]},{},[1]);