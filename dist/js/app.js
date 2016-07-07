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

  var delEleFn = function(curArg){
    //删除cached
    data.delCached(curArg.index);
    data.identifier.delItem(curArg.index);
    data.css.destroyCssByNamespace(curArg.index);
    //删除元素
    layout.delElement(curArg.$el);
  }
  event.on('delEle', delEleFn);

  //页面脚本
  var $styleDemo = null;
  var parseToolItems = function(obj){
      var string = '';
      var selectors = {};
      _.each(obj, function(val, key){
        //如果有animation名称,则添加名称
        if(val.classNames){
            selectors[val.identifier] = val.classNames;
        }else if(val.style){
            //如果有样式，则添加
            selectors[val.identifier] = '';
        }
        string += '.animated.' + val.identifier + '{\n' + (val.style || '') + '}\n';
      });
      var result = {style: string, selectors: selectors};
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
        var _style = parseToolItems(demoDatas);
        $styleDemo.text(_style.style);
        var selectors = [];

        timer = setTimeout(function(){
           //$el.removeClass('animated');
        }, 5000)

    }
  })
});


