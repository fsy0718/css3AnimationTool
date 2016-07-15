define(['event', 'data', 'popup/promptDelEleOrCss' ,'underscore'],function(event, data,promptDelEleOrCss, _) {
  //画布函数
  var layout = {
    $canvas: $('#canvas'),
    parseObjectToHtmlString: function(obj){
        return '<div class="pure-u-1-5 animation_plus_tool_item ' + obj.identifier + '" data-key="' + obj.index + '"><i class="animation_plus_tool_item_origin"></i></div>'
    },
    addElement: function(opts, $el) {
      var string;
      $el = $el || layout.$canvas;
      _opts = $.isArray(opts) ? opts[0] : opts;
      if($.isPlainObject(_opts)){
        string = layout.parseObjectToHtmlString(_opts);
      }else{
        string = _opts;
      }
      return $(string).appendTo($el);
    },
    updateElement: function(obj, el, call) {
      if (!el) {
        el = data.getCurrentArgs().$el;
      }
      obj = obj || {};
      if (obj.oldClassName) {
        el.removeClass(obj.oldClassName);
      }
      if (obj.newClassName) {
        el.addClass(obj.newClassName);
      }
      if (obj.css){
        if(obj.css.rule){
            //变更样式
            el.css(obj.css.name, obj.css.rule);
        }else{
            //删除样式
            el[0].style[obj.css.name] = null;
        }
      }else if(obj.css === null){
        el[0].style = null;
      }
      if($.isFunction(call)){
        call(obj, el);
      }
    },
    delElement: function(el){
        el.remove();
    },
    status: 'editor',
    init: function() {
      var self = this;
      //右键事件
      this.$canvas.on('contextmenu', '.css3_tool_item_demo', function(e){
        if(self.status === 'editor'){
          var $target = $(this);
          var key = $target.data('css3Iden');
          if(key){
            e.preventDefault();
            e.stopPropagation();
            event.trigger('showMenu.popup',e, {key: key, $el: $target});
          }
        }
      });
      //删除事件
      this.$canvas.on('click', '.del', function(e){
        var $target = $(this).parent('.css3_tool_item_demo');
        var key = $target.data('css3Iden');
        if(key){
          data.setCurrentArgs(key, $target);
          promptDelEleOrCss.show();
        }
      })
      // this.$canvas.on('contextmenu', function(e) {
      //   if(self.status === 'editor'){
      //     e.preventDefault();
      //     e.stopPropagation();
      //     var $target = $(e.target);
      //     console.log($target);
      //     //如果是在画布上,则新建
      //     if ($target.hasClass('canvas')) {
      //       //新建
      //       event.trigger('addElement.popup');
      //     } else {
      //       var key = $target.data('key');
      //       if (key) {
      //         event.trigger('showMenu.popup',e, {key: key, $el: $target});
      //       }
      //     }
      //   }
      // })
    }
  };
  layout.init();
  return layout;
})
