require(['event', 'js/canvas/layout', 'js/canvas/popup', 'data', 'underscore', 'library/index'],function(event,layout, popup, data, _, library){
  //event 事件
  event.on('addElement.popup', popup.addElement);
  event.on('updateElement.popup', popup.updateElement);
  event.on('showMenu.popup', popup.showMenu);
  event.on('hideMenu.popup', popup.hideMenu);
  event.on('showStyle.popup', popup.showStyle);
  event.on('showPrompt.popup', popup.showPrompt);

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

  var delCssFn = function(curArg){
      //删除cached
      data.delCached(curArg.index, 'animationName')
      data.delCached(curArg.index, 'style');
      data.css.destroyCssByNamespace(curArg.index);
  }

  event.on('delCss', delCssFn);

  //页面脚本
  var $styleDemo = null;
  var parseToolItems = function(obj){
      var string = '';
      var addIngClass = {};
      var selectors = [];
      _.each(obj, function(val, key){
        //如果有animation名称,则添加名称
        var c = '';
        if(val.classNames || val.animationName || val.style){
            selectors.push(val.identifier);
            if(val.classNames){
                c += val.classNames.join(' ');
            }
            if(val.animationName){
                c += val.animationName
            }
            if(c || val.style){
                addIngClass[val.identifier] = c;
            }
        }
        string += '.animated.' + val.identifier + '{\n' + (val.style || '') + '}\n';
      });
      return {addIngClass: addIngClass, style: string, selectors: selectors};

  }
  var timer = null;
  $('.header').on('click', '.pure-button', function(e){
    var $target = $(e.target);
    var action = $target.data('action');
    //预览 TODO 此处需要做缓存 如果未修改任何样式，则不用替换css
    if(action === 'preview'){
        if(!$styleDemo){
            $styleDemo = $('<style class="animation_plus_tool_style"></style>').appendTo('head');
        }
        var demoDatas = data.getCached();
        var _data = parseToolItems(demoDatas);
        $styleDemo.text(_data.style);
        _.each(_data.selectors, function(selector){
            $('.' + selector).addClass('animated ' + _data.addIngClass[selector])
        })
        timer = setTimeout(function(){
            _.each(_data.selectors, function(selector){
                $('.' + selector).removeClass('animated ' + _data.addIngClass[selector])
            })
        }, 5000)

    }
  });

  //event.trigger('showStyle.popup');
});


