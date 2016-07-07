define(['event', 'data'],function(event, data) {
  //画布函数
  var layout = {
    $canvas: $('#canvas'),
    parseObjectToHtmlString: function(obj){
        return '<div class="pure-u-1-5 animation_plus_tool_item ' + obj.identifier + '" data-key="' + obj.index + '"><i class="animation_plus_tool_item_origin"></i></div>'
    },
    addElement: function(opts) {
      var htmlString = layout.parseObjectToHtmlString(opts);
      layout.$canvas.append(htmlString);
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
        el.css(obj.css.name, obj.css.rule);
      }
      //删除样式
      if (obj.style === null){
          el[0].style = null;
      }
      if($.isFunction(call)){
        call(obj, el);
      }
    },
    delElement: function(el){
        el.remove();
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
            data.setCurrentArgs(key, $target);
            event.trigger('showMenu.popup',e);
          }
        }
      })
    }
  };
  layout.init();
  return layout;
})
