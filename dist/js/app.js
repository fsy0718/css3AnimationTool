/** Javascript file
*--------------------------------------------------
*
*          Filename: d:\vos\web\css3animationtool\dist\js\app.js
*
*            Author: fsy0718 - fsy0718@gmail.com
*       Description: ---------- 
*            Create: 2016-07-12 10:23:40
*     Last Modified: 2016-07-12 10:23:40
*--------------------------------------------------
**/
"use strict";
require(['event', 'js/canvas/layout', 'popup/index', 'data', 'underscore', 'library/index'],function(event,layout, popup, data, _, library){
  //event 事件 {{{
  event.on('addElement.popup', popup.addElement);
  event.on('updateElement.popup', popup.updateElement);
  event.on('showMenu.popup', popup.showMenu);
  event.on('hideMenu.popup', popup.hideMenu);
  event.on('showRule.popup', popup.showRule);
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

  var delRuleFn = function(curArg){
  //删除cached
  data.delCached(curArg.index, 'animationName')
  data.delCached(curArg.index, 'style');
  data.css.destroyCssByNamespace(curArg.index);
  }
  event.on('delRule', delRuleFn);
  // }}}
  //页面脚本
  var $cssToolDemo = null;
  var parseToolItems = function(obj){
      var string = '';
      var addIngClass = {};
      var selectors = [];
      _.each(obj, function(val, key){
        //如果有animation名称,则添加名称
        var c = '';
        if(val.classNames || val.animationName || val.css){
            selectors.push(val.identifier);
            if(val.classNames){
                c += val.classNames.join(' ');
            }
            if(val.animationName){
                c += val.animationName
            }
            if(c || val.css){
                addIngClass[val.identifier] = c;
            }
        }
        string += '.animated.' + val.identifier + '{\n' + (val.css || '') + '}\n';
      });
      return {addIngClass: addIngClass, css: string, selectors: selectors};
  }
  var timer = null;
  var createCss = function(){
    if(!$cssToolDemo){
        $cssToolDemo = $('<style class="css3_tool_style"></style>').appendTo('head');
    }
    var demoDatas = data.getCached();
    var _data = parseToolItems(demoDatas);
    $cssToolDemo.text(_data.css);
    _.each(_data.selectors, function(selector){
        $('.' + selector).addClass('animated ' + _data.addIngClass[selector])
    })
    timer = setTimeout(function(){
        _.each(_data.selectors, function(selector){
            $('.' + selector).removeClass('animated ' + _data.addIngClass[selector])
        })
    }, 5000);
  }
  //生成样式
  event.on('preview.css',function(isPreview){
    isPreview && createCss();
  });
  //event.trigger('showStyle.popup');
});


// vim:sw=4:ts=4:sts=4:noet:fdm=marker:fdc=1
