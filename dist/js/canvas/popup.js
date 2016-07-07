"use strict";
define(['tpl/addElement', 'tpl/updateStyle', 'layer', 'data', 'event'], function(addElement, updateStyle, layer, data, event) {
  // data下两个实例
  var identifier = data.identifier;
  var css = data.css;

  //获取添加元素弹框的html字符串
  var getAddEleLayerString = function(option) {
    option = option || {};
    return addElement(option)
  };
  // 隐藏弹框
  var layerHide = function(e, ele, _l, l) {
    return l.hide();
  };

  var layerHideWithDelCurretArgs = function(e, ele, _l, l){
      data.delCurrentArgs();
      return l.hide();
  }

  var defaultEleOptionString = getAddEleLayerString();
  var identifierReg = /^\w+([\-\_]\w+)*$/;
  var identifierIsValid = function(identifier) {
    return identifierReg.test(identifier);
  };
  var defaultStyleOptionString = updateStyle({
    0: {
      'transition-timing-function': 'cubic-bezier(0.500,0.500,0.500,0.750)'
    },
    '2': 'shake',
    isFull: true,
    idx: '0'
  });


  var parseElOpts = function(opt) {
    return '<div class="pure-u-1-5 ' + opt.identifier + '" data-key="' + opt.index + '"></div>';
  };
  //添加元素确认函数 {{{
  var addEleOkFn = function(e, ele, _l, l, eData) {
    var $type = _l.find('select');
    var $identifier = _l.find('input[name="identifier"]');
    var type = $type.val();
    var _identifier = $identifier.val().trim();
    var isValid = identifierIsValid(_identifier);
    var isExist = identifier.hasIdentifier(_identifier);
    var $tip = $identifier.parent().next('span');
    if (isValid && !isExist) {
      var elOpts = identifier.addIdentifier(_identifier, type);
      $tip.removeClass('error').text('此元素标识只有一个，且不能重复');
      event.trigger('addElement.canvas', elOpts);
      data.setCached(elOpts.index, 'identifier', elOpts.identifier);
      l.hide();
    } else {
      $tip.addClass('error').text(!isValid ? '标识必须为英文，可以用-_进行连接' : isExist ? '标识已存在' : '标识不能为空');
    }
  };
  //}}}
  //更新元素确认函数 {{{
  var updateEleOkFn = function(e, ele, _l, l, eData) {
    var $type = _l.find('select');
    var $identifier = _l.find('input[name="identifier"]');
    var type = $type.val();
    var _identifier = $identifier.val().trim();
    var isValid = identifierIsValid(_identifier);
    var isExist = identifier.hasIdentifier(_identifier);
    var $tip = $identifier.parent().next('span');
    if (isValid && !isExist) {
      $tip.removeClass('error').text('此元素标识只有一个，且不能重复');
      var _curArgs = data.getCurrentArgs();
      if(_curArgs.index){
        var oldOpts = identifier.getItemByIndex(_curArgs.index);
        var oldidentifier = oldOpts.identifier;
        event.trigger('updateElement.canvas',{
          oldClassName: oldidentifier,
          newClassName: _identifier
        }, _curArgs.$el, function(){
          identifier.updateIdentifier(_curArgs.index, _identifier);
          data.setCached(_curArgs.index, 'identifier', _identifier);
        });
      }

      l.hide();
      data.delCurrentArgs();
    } else {
      $tip.addClass('error').text(!isValid ? '标识必须为英文，可以用-_进行连接' : isExist ? '标识已存在' : '标识不能为空');
    }
  }
  //}}}

  var addEleOptions = {
    title: '新建元素',
    callbacks: {
      ok: addEleOkFn
    }
  };
  var updateEleOptions = {
    title: '更新元素',
    callbacks: {
      ok: updateEleOkFn
    }
  };

  var isTransformStyle3DZ = /Z\s*$/;

  //切换translate3D显示 {{{
  var switchTransfromStyle = function(items, ipts ,is2D, curArgs){
    items[is2D ? 'addClass' : 'removeClass']('Ldn');
    if(is2D){
        ipts.val(null);
        var s3DStylesObj = css.getCssObjByNamespace(curArgs.index);
        if(s3DStylesObj && s3DStylesObj.transform){
            s3DStylesObj.transform.__index.forEach(function(z){
                if(isTransformStyle3DZ.test(z)){
                    css.delCss(curArgs.index, z, null, 'transform');
                };
                return true;
            })
        }
    }
  };
  // }}}


  // input的change事柄 {{{
  var inputChangeHandler = function(e, $s3d, $s3dIpt){
    var $target = $(e.target);
    var _curArgs = data.getCurrentArgs();
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
    var par = $show.data('parent');
    var name = $show.prop('name');
    var origin = $show.data('origin');
    var val = $show.val().trim();
    if(type === 'radio' && name === 'transform-style'){
      var is2D = val === 'flat';
      switchTransfromStyle($s3d, $s3dIpt ,is2D, _curArgs);
    }
    if(_curArgs.index){
        var _style = css.addCss(_curArgs.index, name, val, par, origin);
        if(par === 'transform-origin'){
            var opts = {name: name == 'x' ? 'left' : 'top', rule: _style['transform-origin'][name]}
            event.trigger('updateElement.canvas', {css: opts}, _curArgs.$el.find('.animation_plus_tool_item_origin'));
        }
      var styles = data.css.getStyleByFilter(_curArgs.index, name, par, origin);
      event.trigger('updateElement.canvas',{css: styles}, _curArgs.$el);
    }
  }
  // }}}
  // 初始化修改样式弹框函数 {{{
  var _initStylePopupEvent = function(_l, l) {
    var tabNavItem = _l.find('.tab-nav-item');
    var tabContItem = _l.find('.tab-cont-item');
    var btnAnimations = _l.find('.button-animation');
    var timer = null;
    var animationClass = null;
    var $s3d = _l.find('.s3d');
    var $s3dIpt = _l.find('.s3d input[type="text"], .s3d input[type="range"]');
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
        var _curArgs = data.getCurrentArgs();
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
      }else{
        $target.removeClass('button-success');
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
        inputChangeHandler.call(this, e, $s3d, $s3dIpt);
    });
  }
  // }}}

  var styleLayer = null;
  var warnLayer = null;

  var _styleBeforeShowFn = function(_l, l) {
    //首次显示，绑定事件
    if (styleLayer) {

    } else {
      _initStylePopupEvent(_l, l);
    }
  }

  // style ok函数 {{{
  var _styleOkFn = function(e, ele, _l, l, eData){
    var activeTabCont = _l.find('.tab-cont-item.active');
    var idx = activeTabCont.data('index');
    var _curArgs = data.getCurrentArgs();
    if(_curArgs.index){
        //添加className
        if(idx == '2'){
            var animationActive = activeTabCont.find('.button-animation.button-success');
            if(animationActive.length){
              var oldAnimationName = data.getCached(_curArgs.index, 'animationName');
              //删除原来的animationName
              data.delCached(_curArgs.index, 'classNames', oldAnimationName);
              var key = animationActive.data('key');
              data.setCached(_curArgs.index, {
                  'classNames': key,
                  'curIdx': idx,
                  'animationName': key
              });
            }else{
                data.setCached(_curArgs.index, 'animationName', null);
            }
        }
        //自定义transform
        if(idx == '0'){
            var _style = css.getCssByNamespaceWithoutSelector(_curArgs.index);
            data.setCached(_curArgs.index, {
                'style': _style,
                'curIdx': idx
            });
            event.trigger('updateElement.canvas', {style: null}, _curArgs.$el);
        }
    }
    l.hide();
    //清除当前
    data.delCurrentArgs();
  }
  //}}}
  //警告弹框显示 {{{
  var warnBeforeShowFn = function(_l, l, isFirst){
    if(!isFirst){
      _l.find('.layer-cont').text(l.__opts.msg);
    }
  }
  // }}}
  // 警告弹框确认按钮 {{{
  var warnOkFn = function(e, ele, _l, l){
    var _curArgs = data.getCurrentArgs();
    if(_curArgs.$el){
      event.trigger('delEle', _curArgs);
      data.delCurrentArgs();
      l.hide();

    }

  }
  // }}}
  var showMenuFirst  = false;
  // 初始化menu弹框 {{{
  var menuInit =  function() {
    showMenuFirst = true;
    popup.$menu.on('click', 'li', function(e) {
      e.stopPropagation();
      var $target = $(e.target);
      var key = $target.data('key');
      //隐藏
      event.trigger('hideMenu.popup');
      if (key === 'update-ele') {
        event.trigger('updateElement.popup');
      }
      if (key === 'update-css') {
        event.trigger('showStyle.popup');
      }
      if (key === 'delete-ele'){
          var _curArgs = data.getCurrentArgs();
          var _identifier = identifier.getItemByIndex(_curArgs.index);
          event.trigger('showWarn.popup', {msg: '确认删除' + _identifier.identifier});
      }
    });
    popup.$menu.on('click', '.close', function(e){
        data.delCurrentArgs();
        event.trigger('hideMenu.popup')
    })
  };
  // }}}
  //弹框对象 {{{
  var popup = {
    addElement: function() {
      layer.alert(defaultEleOptionString, addEleOptions);
    },
    updateElement: function() {
      var _curArgs = data.getCurrentArgs();
      //TODO 这里需要自定义menu
      if (_curArgs.$el) {
        var lidx = _curArgs.$el.data('lidx');
        if (lidx) {
          return layer.getLayerByIndex(lidx).show();
        }
      }
      if (_curArgs.index) {
        var _curData = identifier.getItemByIndex(_curArgs.index);
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
          btns : [['ok', 's-save', '确定'], ['reset', 's-cancel', '重置']],
          view: {
            left: '10px'
          },
          callbacks: {
            beforeShow: _styleBeforeShowFn,
            no: layerHideWithDelCurretArgs,
            close: layerHideWithDelCurretArgs,
            ok: _styleOkFn
          }
        })
      }
    },
    showWarn: function(opts){
        if(warnLayer){
          //TODO Layer不能获取新的opts，后期需要修改
          warnLayer.__opts = opts;
          warnLayer.show();
        }else{
          warnLayer = layer.alert(opts.msg,{
              title: '删除元素',
              view: {
                maxWidth: '50%',
                minWidth: 500,
                minHeight: 300
              },
              callbacks: {
                beforeShow: warnBeforeShowFn,
                no: layerHideWithDelCurretArgs,
                close: layerHideWithDelCurretArgs,
                ok: warnOkFn
              }
          });
        }
    }
  }
  // }}}
  return popup
});


// vim: se ts=2 sts=2 sw=2 fdm=marker cc=80 et:
