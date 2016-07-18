define(['event', 'data', 'popup/promptDelEleOrCss' ,'underscore', './header'],function(event, data,promptDelEleOrCss, _, header) {
  //画布函数
  var layout = {
    $el: $('#canvas'),
    parseObjectToHtmlString: function(obj){
        return '<div class="pure-u-1-5 animation_plus_tool_item ' + obj.identifier + '" data-key="' + obj.index + '"><i class="animation_plus_tool_item_origin"></i></div>'
    },
    addElement: function(opts, $el) {
      var string;
      $el = $el || layout.$el;
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
      this.$el.on('contextmenu', '.css3_tool_item_demo', function(e){
        if(self.status === 'editor'){
          console.log($(e.target));
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
      this.$el.on('click', '.del', function(e){
        var $target = $(this).parent('.css3_tool_item_demo');
        var key = $target.data('css3Iden');
        if(key){
          data.setCurrentArgs(key, $target);
          promptDelEleOrCss.show();
        }
      });
      //监听事件
      event.on('preview.canvas', function(isPreview){
        if(isPreview){
            self.$el.removeClass('canvas--editor').addClass('canvas--preview');
            self.status = 'preview';
        }else{
            self.$el.removeClass('canvas--preview').addClass('canvas--editor');
            self.status = 'editor';
        }
      })
    }
  };
  layout.init();
  header.init();
  return layout;
});

// vim:sw=2:ts=2:sts=2:noet:fdm=marker:fdc=1
