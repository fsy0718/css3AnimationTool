"use strict";
define(['tpl/addElement', 'tpl/updateStyle', 'layer', 'data', 'event', './layout'], function(addElement, updateStyle, layer, data, event, layout) {
  var getAddEleLayerString = function(option) {
    option = option || {};
    return addElement(option)
  };
  var layerHide = function(e, ele, _l, l) {
    return l.hide();
  };
  var defaultEleOptionString = getAddEleLayerString();
  var classNameReg = /^\w+([\-\_]\w+)*$/;
  var classNameIsValid = function(className) {
    return classNameReg.test(className);
  }
  var defaultStyleOptionString = updateStyle({
    0: {
      'transition-timing-function': 'cubic-bezier(0.500,0.500,0.500,0.750)'
    },
    '2': 'shake',
    isFull: true,
    idx: '0'
  });


  var parseElOpts = function(opt) {
    return '<div class="pure-u-1-5 ' + opt.className + '" data-key="' + opt.key + '"></div>';
  }

  var addEleOkFn = function(e, ele, _l, l, eData) {
    var $type = _l.find('select');
    var $className = _l.find('input[name="className"]');
    var type = $type.val();
    var className = $className.val().trim();
    var isValid = classNameIsValid(className);
    var isExist = data.hasClassName(className);
    var $tip = $className.parent().next('span');
    if (isValid && !isExist) {
      var elOpts = data.addElement(className, type);
      var elString = parseElOpts(elOpts);
      $tip.removeClass('error').text('此元素标识只有一个，且不能重复');
      event.trigger('addElement.canvas', elString);
      l.hide();
    } else {
      $tip.addClass('error').text(!isValid ? '标识必须为英文，可以用-_进行连接' : isExist ? '标识已存在' : '标识不能为空');
    }
  }
  var updateEleOkFn = function(e, ele, _l, l, eData) {
    var $type = _l.find('select');
    var $className = _l.find('input[name="className"]');
    var type = $type.val();
    var className = $className.val().trim();
    var isValid = classNameIsValid(className);
    var isExist = data.hasClassName(className);
    var $tip = $className.parent().next('span');
    if (isValid && !isExist) {
      $tip.removeClass('error').text('此元素标识只有一个，且不能重复');
      var _curArgs = layout.getCurrentArgs();
      if(_curArgs.$el){
        var oldOpts = data.getElementByKey(_curArgs.key);
        var oldClassName = oldOpts.className;
        event.trigger('updateElement.canvas',{
          oldClassName: oldClassName,
          newClassName: className
        }, _curArgs.$el, function(){
          data.updateElement(_curArgs.key, className);
        });
      }

      l.hide();
    } else {
      $tip.addClass('error').text(!isValid ? '标识必须为英文，可以用-_进行连接' : isExist ? '标识已存在' : '标识不能为空');
    }
  }

  var addEleOptions = {
    title: '新建元素',
    callbacks: {
      ok: addEleOkFn
    }
  }
  var updateEleOptions = {
    title: '更新元素',
    callbacks: {
      ok: updateEleOkFn
    }
  }
  var _initStylePopupEvent = function(_l, l) {
    var tabNavItem = _l.find('.tab-nav-item');
    var tabContItem = _l.find('.tab-cont-item');
    var btnAnimations = _l.find('.button-animation');
    var timer = null;
    var animationClass = null;
    //切换tab
    _l.on('click', '.tab-nav-item-a', function(e) {
      var $target = $(e.target);
      var $par = $target.parent();
      if (!$par.hasClass('active')) {
        var idx = $par.data('index');
        tabNavItem.filter('.active').removeClass('active');
        $par.addClass('active');
        tabContItem.filter('.active').removeClass('active');
        styleLayer.autoArea({});
        tabContItem.filter('.tab-cont-item-' + idx).addClass('active');
      }
    });
    //切换动画库
    _l.on('click', '.button-animation', function(e){
      var $target = $(e.target);
      if(!$target.hasClass('button-success')){
        var key = $target.data('key');
        btnAnimations.filter('.button-success').removeClass('button-success');
        $target.addClass('button-success');
        var _curArgs = layout.getCurrentArgs();
        if(_curArgs.$el){
          clearTimeout(timer);
          var _animationClass = 'animated ' + key;
          event.trigger('updateElement.canvas', {
            oldClassName: animationClass,
            newClassName: _animationClass
          }, _curArgs.$el, function(){
            animationClass = _animationClass;
          });
          timer = setTimeout(function(){
            event.trigger('updateElement.canvas',{
              oldClassName: animationClass
            }, _curArgs.$el, function(){
              animationClass = null;
            })
          },1500)
        }


      }
    });
    //input[type="range"]的input事件
    _l.on('input', 'input[type="range"]', function(e){
      var $target = $(e.target);
      var $show = $target.parent().prev().find('input[type="text"]');
      $show.val($target.val());
    });
    //input change
    _l.on('change', 'input', function(e){
      var $target = $(e.target);
      var _curArgs = layout.getCurrentArgs();
      var type = $target.prop('type');
      //更新range
      var $range = $target.parent().parent().next().find('input[type="range"]');
      if($range.length && type === 'text'){
        $range.val($target.val());
      }
      if(type === 'range'){
        var $show = $target.parent().prev().find('input[type="text"]');
      }else{
        var $show = $target;
      }

    })
  }

  var styleLayer = null;

  var _styleBeforeShowFn = function(_l, l) {
    //首次显示，绑定事件
    if (styleLayer) {

    } else {
      _initStylePopupEvent(_l, l);
    }
  }
  var showMenuFirst  = false;
  var menuInit =  function() {
    showMenuFirst = true;
    popup.$menu.on('click', 'li', function(e) {
      var $target = $(e.target);
      var key = $target.data('key');
      //隐藏
      event.trigger('hideMenu.popup');
      if (key === 'update-ele') {
        event.trigger('updateElement');
      }
      if (key === 'update-css') {
        event.trigger('showStyle');
      }
    })
  };
  var popup = {
    addElement: function() {
      layer.alert(defaultEleOptionString, addEleOptions);
    },
    updateElement: function() {
      var _curArgs = layout.getCurrentArgs();
      //TODO 这里需要自定义menu
      if (_curArgs.$el) {
        var lidx = _curArgs.$el.data('lidx');
        if (lidx) {
          return layer.getLayerByIndex(lidx).show();
        }
      }
      if (_curArgs.key) {
        var _curData = data.getElementByKey(_curArgs.key);
        _curData = Object.assign({}, _curData, {
          disabled: true
        });
        var s = getAddEleLayerString(_curData);
        var l = layer.alert(s, updateEleOptions);
        _curArgs.$el.data('lidx', l.idx);
      }
    },
    $menu: $('.popup-menu'),
    $menuCont: $('.popup-menu .popupbox'),
    showMenu: function(e) {
      if(!showMenuFirst){
        menuInit();
      }
      popup.$menuCont.css({
        left: e.clientX,
        top: e.clientY
      });
      popup.$menu.show();
    },
    hideMenu: function() {
      popup.$menu.hide();
    },
    showStyle: function() {
      if (styleLayer) {
        styleLayer.show();
      } else {
        styleLayer = layer.alert(defaultStyleOptionString, {
          title: null,
          lclass: 'layer-style',
          toolbar: null,
          view: {
            left: '10px'
          },
          callbacks: {
            beforeShow: _styleBeforeShowFn,
            no: layerHide,
            close: layerHide
          }
        })
      }
    }
  }
  return popup
});
