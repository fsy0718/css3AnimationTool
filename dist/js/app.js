require(['event', 'js/canvas/layout', 'js/canvas/popup', 'data', 'underscore'],function(event,layout, popup, data, _){
  //event 事件
  event.on('addElement.popup', popup.addElement);
  event.on('updateElement.popup', popup.updateElement);
  event.on('showMenu.popup', popup.showMenu);
  event.on('hideMenu.popup', popup.hideMenu);
  event.on('showStyle.popup', popup.showStyle);
  event.on('showWarn.popup', popup.showWarn);

  event.on('addElement.canvas', layout.addElement);
  event.on('updateElement.canvas',layout.updateElement);

  var addCssCompleteFn = function(opts, addStyleResult){
      if(opts.par === 'transform-origin'){
        var _kk = name === 'x' ? 'left' : 'top';
        opts.$el.find('.animation_plus_tool_item_origin').css(_kk, addStyleResult['transform-origin'][name]);
      }
      var styles = data.css.getStyleByFilter(opts.index, opts.name, opts.par, opts.origin);
      opts.$el.css(styles.name, styles.rule);
  }

  event.on('addCssComplete',addCssCompleteFn);
  //页面脚本
  var $styleDemo = null;
  var parseInlineStyle = function(obj){
      var string = '';
      var selectors = [];
      _.each(obj, function(val, key){
        selectors.push('.' + val.identifier);
        string += '.animated.' + val.identifier + '{\n' + (val.style || '') + '}\n';
      });
      var result = {style: string, selectors: selectors.join(',')};
      selectors = null;
      return result;

  }
  var timer = null;
  $('.header').on('click', '.pure-button', function(e){
    var $target = $(e.target);
    var action = $target.data('action');
    //预览
    if(action === 'preview'){
        if(!$styleDemo){
            $styleDemo = $('<style class="animation_plus_tool_style"></style>').appendTo('head');
        }
        var demoDatas = data.getCached();
        var _style = parseInlineStyle(demoDatas);
        $styleDemo.text(_style.style);
        clearTimeout(timer);
        var $el = $(_style.selectors);
        $el.addClass('animated');
        timer = setTimeout(function(){
            $el.removeClass('animated');
        }, 5000)

    }
  })
});


