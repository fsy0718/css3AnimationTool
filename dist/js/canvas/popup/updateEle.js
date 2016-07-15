"use strict";

define(['tpl/addElement', './popup', 'data'], function (addElement, popup, data) {
  var identifier = data.identifier;
  var identifierReg = /^[^\d]\w+([\-\_]\w+)*$/;
  var identifierIsValid = function (identifier) {
    return identifierReg.test(identifier);
  };
  //修改元素对象 {{{
  var _updateEle = {
    hasInited: false,
    cached: {
    },
    show: function (curArgs) {
      this.curArgs = curArgs;
      var curIdentifier = this.$el.find('#css3_tool_add_element_index').val();
      if (curArgs.index !== curIdentifier) {
        var s = this.getContentHtmlString(curArgs);
        this.$el.find('.pure-form').html(s);
      }
      this.$el.show();
      popup.show();
    },
    hide: function () {
      delete this.curArgs;
      this.$el.hide();
      popup.hide();
    },
    getContentHtmlString: function (curArgs, isFull) {
      if (this.cached[curArgs.index]) {
        return this.cached[curArgs.index];
      }
      var _data = identifier.getItemByIndex(curArgs.index);
      _data = Object.assign({}, _data, {
        disabled: true,
        isFull: isFull
      });
      var s = addElement(data);
      this.cached[curArgs.index] = s;
      return s;
    },
    init: function (curArgs) {
      this.hasInited = true;
      var s = this.getContentHtmlString(curArgs, true);
      var $el = $(s).appendTo(popup.$operate);
      this.$el = $el;
      this.curArgs = curArgs;
      this.initEvent(curArgs);
      popup.show();
    },
    initEvent: function () {
      var $el = this.$el;
      var self = this;
      $el.find('.pure-form').on('submit', function (e) {
        e.preventDefault();
      })
      $el.on('click', '.button-success', function (e) {
        var $type = $el.find('select');
        var $identifier = $el.find('input[name="identifier"]');
        var type = $type.val();
        var newidentifier = $identifier.val().trim();
        var isValid = identifierIsValid(newidentifier);
        var isExist = identifier.hasIdentifier(newidentifier);
        var $tip = $identifier.parent().next('span');
        if (isValid && !isExist) {
          $tip.removeClass('error').text('此元素标识只有一个，且不能重复');
          var oldOpts = identifier.getItemByIndex(self.curArgs.index);
          var oldidentifier = oldOpts.identifier;
          event.trigger('updateElement.canvas', {
            oldClassName: oldidentifier,
            newClassName: newidentifier
          }, self.curArgs.$el, function () {
            identifier.updateIdentifier(self.curArgs.index, newidentifier);
            data.setCached(self.curArgs.index, 'identifier', newidentifier);
          });
          //更新缓存
          self.cached[self.curArgs.index] = $el.find('.pure-form').html();
          self.hide();
        } else {
          $tip.addClass('error').text(!isValid ? '标识必须为英文，可以用-_进行连接' : isExist ? '标识已存在' : '标识不能为空');
        }
      });
      $el.on('click', '.close', function (e) {
        self.hide();
      });
    }
  }
  // }}}
  return _updateEle;
})