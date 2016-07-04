(function(win){
  "use strict";
  var _a = win.app;
  var _d = app.data;
  var _l = app.layer = {};
  var _c = app.canvas = {};
  var _t = _a.tpl;
  var $canvas = _c.$canvas = $('#canvas');

  //监听canvas contextmenu函数
  $canvas.on('contextmenu', function(e){
    e.preventDefault();
    e.stopPropagation();
    var $target = $(e.target);
    //如果是在画布上,则新建
    if($target.hasClass('canvas')){
      //新建
      _l.addElement();
    }else{
      var key = $target.data('key');
      if(key){
        _c.setCurrentArgs(key, $target);
        _l.showMenu(e);
      }
    }
  })

  //layer相关方法
  var getAddEleLayerString = function(option){
    option = option || {};
    return _t.addElement(option)
  }

  var layerHide = function(e,ele, _layer,l){
    return l.hide();
  }
  var defaultEleOptionString = getAddEleLayerString();
  var classNameReg = /^\w+([\-\_]\w+)*$/;
  var classNameIsValid = function(className){
    return classNameReg.test(className);
  }
  var defaultStyleOptionString = _t.updateStyle({
    2: 'shake',
    isFull: true,
    idx: '2'
  });
  var styleLayer = null;

  var parseElOpts = function(opt){
    return '<div class="pure-u-1-5 ' + opt.className + '" data-key="' + opt.key + '"></div>';
  }

  var addEleOkFn = function(e, ele, _layer, l, eData){
    var $type = _layer.find('select');
    var $className = _layer.find('input[name="className"]');
    var type = $type.val();
    var className = $className.val().trim();
    var isValid = classNameIsValid(className);
    var isExist = _d.hasClassName(className);
    var $tip = $className.parent().next('span');
    if(isValid && !isExist){
      var elOpts = _d.addElement(className, type);
      var elString = parseElOpts(elOpts);
      $tip.removeClass('error').text('此元素标识只有一个，且不能重复');
      _c.addElement(elString);
      l.hide();
    }else{
      $tip.addClass('error').text(!isValid ? '标识必须为英文，可以用-_进行连接' : isExist ? '标识已存在' : '标识不能为空');
    }
  }
  var updateEleOkFn = function(e, ele, _layer, l, eData){
    var $type = _layer.find('select');
    var $className = _layer.find('input[name="className"]');
    var type = $type.val();
    var className = $className.val().trim();
    var isValid = classNameIsValid(className);
    var isExist = _d.hasClassName(className);
    var $tip = $className.parent().next('span');
    if(isValid && !isExist){
      $tip.removeClass('error').text('此元素标识只有一个，且不能重复');
      var _curArgs = _c.getCurrentArgs();
      var oldOpts = _d.getElementByKey(_curArgs.key);
      var oldClassName = oldOpts.className;
      var elOpts = _d.updateElement(_curArgs.key, className);
      _c.updateElement({
        oldClassName: oldClassName,
        newClassName: elOpts.className
      }, _curArgs.$el);
      l.hide();
    }else{
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
  //添加元素
  _l.addElement = function(){
    layer.alert(defaultEleOptionString,addEleOptions);
  }
  //更新元素
  _l.updateElement = function(){
    var _curArgs = _c.getCurrentArgs();
    //TODO 这里需要自定义menu
    if(_curArgs.$el){
      var lidx = _curArgs.$el.data('lidx');
      if(lidx){
        return win.layers[lidx].show();
      }
    }
    if(_curArgs.key){
      var _curData = _d.getElementByKey(_curArgs.key);
      _curData = Object.assign({}, _curData, {disabled: true});
      var s = getAddEleLayerString(_curData);
      var l = layer.alert(s,updateEleOptions);
      _curArgs.$el.data('lidx', l.idx);
    }
  }
  _l.$menu = $('.popup-menu');
  _l.$menuCont = _l.$menu.find('.popupbox');
  _l.$menu.on('click', 'li', function(e){
    var $target = $(e.target);
    var key = $target.data('key');
    _l.hideMenu();
    if(key === 'update-ele'){
      _l.updateElement();
    }
    if(key === 'update-css'){
      _l.showStylePopup();
    }
  });
  //显示右键目录
  _l.showMenu = function(e){
    _l.$menuCont.css({
      left: e.clientX,
      top: e.clientY
    });
    _l.$menu.show();
  }
  //隐藏右键菜单
  _l.hideMenu = function(){
    _l.$menu.hide();
  }

  var styleBeforeShowFn = function(_layer, l){
    //是否为首次
  }
  //显示stylePopup
  _l.showStylePopup = function(){
    if(styleLayer){
      styleLayer.show();
    }else{
      styleLayer = layer.alert(defaultStyleOptionString, {
        title: null,
        lclass: 'layer-style',
        toolbar: null,
        callbacks: {
          beforeShow: styleBeforeShowFn,
          no: layerHide
        }
      })
    }

  }
  //画布函数
  var _current = {
    key: null,
    $el: null
  };
  _c.addElement = function(string){
    _c.$canvas.append(string);
  }
  _c.updateElement = function(obj,el){
    if(!el){
      el = _c.getCurrentArgs().$el;
    }
    obj = obj || {};
    if(obj.oldClassName){
      el.removeClass(obj.oldClassName);
    }
    if(obj.newClassName){
      el.addClass(obj.newClassName);
    }

  }
  _c.setCurrentArgs = function(key, el){
    _current.key = key;
    _current.$el = el;
    return _current;
  }
  _c.getCurrentArgs = function(){
    return _current;
  }

})(window)
