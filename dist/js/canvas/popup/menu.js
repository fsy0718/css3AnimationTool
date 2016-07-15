"use strict";

define(['event', 'data', './promptDelEleOrCss'], function (event, data, promptDelEleOrCss) {
  var identifier = data.identifier;
  // 自定义菜单对象 {{{
  var _menu = {
    hasInited: false,
    init: function () {
      var self = this;
      this.hasInited = true,
        this.$menu.on('click', 'li', function (e) {
          e.stopPropagation();
          var $target = $(e.target);
          var key = $target.data('key');
          //隐藏
          self.hide();
          if (key === 'update-ele') {
            event.trigger('updateElement.popup');
          }
          if (key === 'update-css') {
            event.trigger('showRule.popup');
          }
          if (key === 'delete-ele' || key === 'delete-css') {
            promptDelEleOrCss.show(Number(key === 'delete-css'));
            // var _curArgs = data.getCurrentArgs();
            // var _identifier = identifier.getItemByIndex(_curArgs.index);
            // event.trigger('showPrompt.popup', '确认删除' + _identifier.identifier + (key === 'delete-css' ? '的样式' : ''), {
            //   beforePrompt: function (e) {
            //     var curArgs = data.getCurrentArgs();
            //     event.trigger(key === 'delete-ele' ? 'delEle' : 'delRule', curArgs);
            //   }
            // });
          }
        });
      this.$menu.on('click', '.close', function (e) {
        data.delCurrentArgs();
        self.hide();
      });
    },
    $menu: $('.popup-menu'),
    $menuCont: $('.popup-menu .popupbox'),
    show: function (e, options) {
      if (!this.hasInited) {
        this.init();
      }
      this.$menuCont.css({
        left: e.clientX,
        top: e.clientY
      });
      data.setCurrentArgs(options.key, options.$el);
      this.$menu.show();
    },
    hide: function () {
      this.$menu.hide();
    }
  };
  // }}}
  return _menu;
});