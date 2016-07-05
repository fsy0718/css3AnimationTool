define(['event'],function(event) {
  //画布函数
  var _current = {
    key: null,
    $el: null
  };
  var layout = {
    $canvas: $('#canvas'),
    addElement: function(string) {
      layout.$canvas.append(string);
    },
    updateElement: function(obj, el, call) {
      if (!el) {
        el = layout.getCurrentArgs().$el;
      }
      obj = obj || {};
      if (obj.oldClassName) {
        el.removeClass(obj.oldClassName);
      }
      if (obj.newClassName) {
        el.addClass(obj.newClassName);
      }
      if($.isFunction(call)){
        call(obj, el);
      }
    },
    setCurrentArgs: function(key, el) {
      _current.key = key;
      _current.$el = el;
      return _current;
    },
    getCurrentArgs: function() {
      return _current;
    },
    init: function() {
      var self = this;
      this.$canvas.on('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $target = $(e.target);
        //如果是在画布上,则新建
        if ($target.hasClass('canvas')) {
          //新建
          event.trigger('addElement.popup');
        } else {
          var key = $target.data('key');
          if (key) {
            self.setCurrentArgs(key, $target);
            event.trigger('showMenu.popup',e);
          }
        }
      })
    }
  };
  return layout;
})
