"use stric";
define(['./addEle', './menu', './prompt', './rule', './updateEle', 'data'], function (addEle, menu, prompt, rule, updateEle, data) {
  return {
    addElement: function () {
      if (addEle.hasInited) {
        addEle.show();
      } else {
        addEle.init();
      }
    },
    updateElement: function () {
      var _curArgs = data.getCurrentArgs();
      if (_curArgs) {
        if (updateEle.hasInited) {
          updateEle.show(_curArgs);
        } else {
          updateEle.init(_curArgs);
        }
      }
    },
    showMenu: function (e, options) {
      menu.show(e, options);
    },
    hideMenu: function () {
      menu.hide();
    },
    showRule: function () {
      var _curArgs = data.getCurrentArgs();
      if (_curArgs) {
        if (rule.hasInited) {
          rule.show(_curArgs);
        } else {
          rule.init(_curArgs);
        }
      }
    },
    showPrompt: function (msg, opts) {
      prompt.show(msg, opts);
    }
  }
});