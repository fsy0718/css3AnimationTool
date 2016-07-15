"use strict";

define(['data', 'event'], function (data, event) {
  var identifier = data.identifier;
  var typeMap = ['','的样式'];
  var delEle = {
    show: function (type, msg) {
      type = type || 0;
      var _curArgs = data.getCurrentArgs();
      var _identifier = identifier.getItemByIndex(_curArgs.index);
      msg = msg || '确认删除' + _identifier.identifier + typeMap[type];
      event.trigger('showPrompt.popup',msg , {
        beforePrompt: function (e) {
          event.trigger(type ? 'delRule' : 'delEle', _curArgs);
        }
      });
    }
  }
  return delEle;
});