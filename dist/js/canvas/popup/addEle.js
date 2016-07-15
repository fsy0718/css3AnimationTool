"use strict";
define(['tpl/addElement', './popup', 'data', 'event'], function (addElement, popup, data, event) {
  var identifier = data.identifier;
  //获取添加元素弹框的html字符串 {{{
  var identifierReg = /^[^\d]\w+([\-\_]\w+)*$/;
  var identifierIsValid = function (identifier) {
    return identifierReg.test(identifier);
  };
  var parseAddEleString = function (option) {
    option = option || {};
    return addElement(option)
  };
  // }}}
  //添加元素对象{{{
  var addEle = {
    defaultString: parseAddEleString({ isFull: true, isAdd: true }),
    hasInited: false,
    // init {{{
    init: function () {
      this.hasInited = true;
      var $el = $(this.defaultString).appendTo(_popup.$operate);
      this.$el = $el;
      this.initEvent();
      popup.show();
    },
    // }}}
    // initEvent {{{
    initEvent: function () {
      var $el = this.$el;
      var self = this;
      this.$type = $el.find('select')
      this.$identifier = $el.find('input[name="identifier"]');
      this.$tip = this.$identifier.parent().next('span');
      $el.find('.pure-form').on('submit', function (e) {
        e.preventDefault();
      })
      $el.on('click', '.button-success', function (e) {
        var type = self.$type.val();
        var _identifier = self.$identifier.val().trim();
        var isValid = identifierIsValid(_identifier);
        var isExist = identifier.hasIdentifier(_identifier);
        if (isValid && !isExist) {
          var elOpts = identifier.addIdentifier(_identifier, type);
          self.$tip.removeClass('error').text('此元素标识只有一个，且不能重复');
          event.trigger('addElement.canvas', elOpts);
          data.setCached(elOpts.index, 'identifier', elOpts.identifier);
          self.hide();
        } else {
          self.$tip.addClass('error').text(!isValid ? '标识必须为英文，可以用-_进行连接' : isExist ? '标识已存在' : '标识不能为空');
        }
      });
      $el.on('click', '.close', function (e) {
        self.hide();
      })
    },
    // }}}
    show: function () {
      this.reset();
      this.$el.show();
      popup.show();
    },
    hide: function () {
      this.$el.hide();
      popup.hide();
    },
    reset: function () {
      this.$type.val('control-predefined');
      this.$identifier.val(null);
      this.$tip.text('标识必须为英文，可以用-_进行连接').removeClass('error');
    }
  }
  // }}}
  return addEle;
})