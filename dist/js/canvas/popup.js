"use strict";
define(['tpl/addElement', 'tpl/updateStyle', 'layer', 'data', 'event'], function(addElement, updateStyle, layer, data, event) {
  // data下两个实例
  var identifier = data.identifier;
  var css = data.css;
  // 隐藏弹框
  var layerHide = function(e, ele, _l, l) {
    return l.hide();
  };

  var layerHideWithDelCurretArgs = function(e, ele, _l, l){
      data.delCurrentArgs();
      return l.hide();
  }
  var identifierReg = /^[^\d]\w+([\-\_]\w+)*$/;
  var identifierIsValid = function(identifier) {
    return identifierReg.test(identifier);
  };
  var isTransformStyle3DZ = /Z\s*$/;

  var warnLayer = null;

  var _styleBeforeShowFn = function(_l, l) {
    //首次显示，绑定事件
    if (styleLayer) {

    } else {
      _initStylePopupEvent(_l, l);
    }
  }
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
      event.trigger(l.__opts.type === 'delete-ele' ? 'delEle' : 'delCss', _curArgs);
      data.delCurrentArgs();
      l.hide();

    }

  }
  // }}}
  //获取添加元素弹框的html字符串 {{{
  var parseAddEleString = function(option) {
    option = option || {};
    return addElement(option)
  };
  // }}}
  //添加元素对象{{{
  var _addElePopup = {
    defaultString: parseAddEleString({isFull: true, isAdd: true}),
    hasInited: false,
    init: function(){
      this.hasInited = true;
      var $el  = $(this.defaultString).appendTo(_popup.$operate);
      this.$el = $el;
      this.initEvent();
      _popup.show();
    },
    initEvent: function(){
      var $el = this.$el;
      var self = this;
      this.$type = $el.find('select')
      this.$identifier = $el.find('input[name="identifier"]');
      this.$tip = this.$identifier.parent().next('span');
      $el.find('.pure-form').on('submit', function(e){
        e.preventDefault();
      })
      $el.on('click', '.button-success', function(e){
        var type = self.$type.val();
        var _identifier = self.$identifier.val().trim();
        var isValid = identifierIsValid(_identifier);
        var isExist = identifier.hasIdentifier(_identifier);
        if (isValid && !isExist) {
          var elOpts = identifier.addIdentifier(_identifier, type);
          self.$tip.removeClass('error').text('此元素标识只有一个，且不能重复');
          event.trigger('addElement.canvas', elOpts);
          data.setCached(elOpts.index, 'identifier', elOpts.identifier);
          self.hide();
        } else {
          self.$tip.addClass('error').text(!isValid ? '标识必须为英文，可以用-_进行连接' : isExist ? '标识已存在' : '标识不能为空');
        }
      });
      $el.on('click', '.close', function(e){
        self.hide();
      })
    },
    show: function(){
      this.reset();
      this.$el.show();
      _popup.show();
    },
    hide: function(){
      this.$el.hide();
      _popup.hide();
    },
    reset: function(){
      this.$type.val('control-predefined');
      this.$identifier.val(null);
      this.$tip.text('标识必须为英文，可以用-_进行连接').removeClass('error');
    }

  }
  // }}}
  //修改元素对象 {{{
  var _updateEle = {
    hasInited: false,
    cached: {
    },
    show: function(curArgs){
      this.curArgs = curArgs;
      var curIdentifier = this.$el.find('#css3_tool_add_element_index').val();
      if(curArgs.index !== curIdentifier){
        var s = this.getContentHtmlString(curArgs);
        this.$el.find('.pure-form').html(s);
      }
      this.$el.show();
      _popup.show();
    },
    hide: function(){
      delete this.curArgs;
      this.$el.hide();
      _popup.hide();

    },
    getContentHtmlString: function(curArgs,isFull){
      if(this.cached[curArgs.index]){
        return this.cached[curArgs.index];
      }
      var _data = identifier.getItemByIndex(curArgs.index);
      _data = Object.assign({}, _data, {
        disabled: true,
        isFull: isFull
      });
      var s =  parseAddEleString(_data);
      this.cached[curArgs.index] = s;
      return s;
    },
    init: function(curArgs){
      this.hasInited = true;
      var s = this.getContentHtmlString(curArgs,true);
      var $el = $(s).appendTo(_popup.$operate);
      this.$el = $el;
      this.curArgs = curArgs;
      this.initEvent(curArgs);
      _popup.show();
    },
    initEvent: function(){
      var $el = this.$el;
      var self = this;
      $el.find('.pure-form').on('submit', function(e){
        e.preventDefault();
      })
      $el.on('click', '.button-success', function(e){
        var $type = $el.find('select');
        var $identifier = $el.find('input[name="identifier"]');
        var type = $type.val();
        var newidentifier = $identifier.val().trim();
        var isValid = identifierIsValid(newidentifier);
        var isExist = identifier.hasIdentifier(newidentifier);
        var $tip = $identifier.parent().next('span');
        if (isValid && !isExist) {
          $tip.removeClass('error').text('此元素标识只有一个，且不能重复');
          var oldOpts = identifier.getItemByIndex(self.curArgs.index);
          var oldidentifier = oldOpts.identifier;
          event.trigger('updateElement.canvas',{
            oldClassName: oldidentifier,
            newClassName: newidentifier
          }, self.curArgs.$el, function(){
            identifier.updateIdentifier(self.curArgs.index, newidentifier);
            data.setCached(self.curArgs.index, 'identifier', newidentifier);
          });
          //更新缓存
          self.cached[self.curArgs.index] = $el.find('.pure-form').html();
          self.hide();
        } else {
          $tip.addClass('error').text(!isValid ? '标识必须为英文，可以用-_进行连接' : isExist ? '标识已存在' : '标识不能为空');
        }
      });
      $el.on('click', '.close', function(e){
        self.hide();
      });
    }
  }
  // }}}
  // 自定义菜单对象 {{{
  var _menu = {
    hasInited: false,
    init: function() {
      var self = this;
      this.hasInited = true,
      this.$menu.on('click', 'li', function(e) {
        e.stopPropagation();
        var $target = $(e.target);
        var key = $target.data('key');
        //隐藏
        self.hide();
        if (key === 'update-ele') {
          event.trigger('updateElement.popup');
        }
        if (key === 'update-css') {
          event.trigger('showStyle.popup');
        }
        if (key === 'delete-ele' ||  key === 'delete-css'){
            var _curArgs = data.getCurrentArgs();
            var _identifier = identifier.getItemByIndex(_curArgs.index);
            event.trigger('showWarn.popup', {msg: '确认删除' + _identifier.identifier + (key === 'delete-css' ? '的样式' : null), type: key});
        }
      });
      this.$menu.on('click', '.close', function(e){
          data.delCurrentArgs();
          self.hide();
      });
    },
    $menu: $('.popup-menu'),
    $menuCont: $('.popup-menu .popupbox'),
    show: function(e){
      if(!this.hasInited){
        this.init();
      }
      this.$menuCont.css({
        left: e.clientX,
        top: e.clientY
      });
      this.$menu.show();
    },
    hide: function() {
      this.$menu.hide();
    },
  };
  // }}}
  //自定义样式对象 {{{
  var _style = {
    hasInited: false,
    cached: {},
    // init {{{
    init: function(curArgs){
      this.hasInited = true;
      this.curArgs = curArgs;
      var s = this.getStyleHtml({isFull: true});
      var $el = $(s).appendTo(_popup.$operate);
      this.cached.idx = {0:true, cur: 0};
      this.$el = $el;
      var $content = $('.content');
      this.setMaxHeight($content.height());
      _popup.show();
      this.$tabNavItem = $el.find('.tab-nav-item');
      this.$tabContItem = $el.find('.tab-cont-item');
      this.$tabContItem.eq(0).addClass('active');
      //第一次进入直接设置
      this.$s3d = $el.find('.s3d');
      this.$s3dIpt = $el.find('.s3d input[type="text"], .s3d input[type="range"]');
      this.initEvent();
    },
    // }}}
    // show {{{
    show: function(curArgs){
      this.curArgs = curArgs;
      
    },

    // }}}
    // hide {{{
    hide: function(curArgs){
      delete this.curArgs;
      delete this.$s3d;
      delete this.$s3dIpt;
      this.timer = null;
      delete this.$btnAnimations;
      this.cached.idx = {};
      this.$el.hide();
      _popup.hide();
    },
    // }}}
    // [getStyleHtml] {{{
    getStyleHtml: function(opts){
      var curArgs = this.curArgs;
      var type = opts.type || 0;
      var cached = this.cached[curArgs.index];
      if(cached && cached[type]){
        return cached[type];
      }else{
        var s = '';
        if(!cached){
          this.cached[curArgs.index] = {};
        }
        if(type === 0){
          var _style = css.getStyleObjByNamespace(curArgs.index);
          s = updateStyle({
            '0': _style,
            isFull: opts.isFull,
            idx: '0'
          });
        }
        if(type == 2){
          s = updateStyle({
            '2': data.getCached(curArgs.index, 'animationName'),
            isFull: opts.isFull,
            idx: '2'
          });
        }
        this.cached[curArgs.index][type] = s;
        return s;
      }
    },
    // }}}
    // 切换动画库类名事柄 [animationNameSwitchHandler] {{{
    animationNameSwitchHandler: function(e){
      var $target = $(e.target);
      var self = this;
      if(!$target.hasClass('button-success')){
        var key = $target.data('key');
        var oldBtnAnimation = this.$btnAnimations.filter('.button-success');
        oldBtnAnimation.removeClass('button-success');
        var _oldAnimationClass = 'animated ' + (oldBtnAnimation.data('key') || '');
        var _newAnimationClass = 'animated ' + key;
        $target.addClass('button-success');
        clearTimeout(self.timer);
        var $el = this.curArgs.$el;
        event.trigger('updateElement.canvas', {
          oldClassName: _oldAnimationClass,
          newClassName: _newAnimationClass
        }, $el);
        self.timer = setTimeout(function(){
          event.trigger('updateElement.canvas',{
            oldClassName: _newAnimationClass
          }, $el)
        },1500)
      }else{
        $target.removeClass('button-success');
      }
    },
    // }}}
    // 存储一些dom变量，用于事件 [setDoms] {{{
    setDoms: function(idx){
      if(idx == 0){
        this.$s3d = this.$el.find('.s3d');
        this.$s3dIpt = this.$el.find('.s3d input[type="text"], .s3d input[type="range"]');
      }
      if(idx == 2){
        this.$btnAnimations = this.$el.find('.button-animation');
      }

    },
    // }}}
    // transformIptChangeHandler {{{
    transformIptChangeHandler: function(e){
      var $target = $(e.target);
      var _curArgs = this.curArgs;
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
      var val = $show.val().trim() || null;
      if(type === 'radio' && name === 'transform-style'){
        var is2D = val === 'flat';
        this.switchTransfromStyle(is2D);
      }
      if(_curArgs.index){
          var _style = css.addCss(_curArgs.index, name, val, par, origin);
          if(par === 'transform-origin'){
              var opts = {name: name == 'x' ? 'left' : 'top', rule: _style['transform-origin'][name]}
              event.trigger('updateElement.canvas', {css: opts}, _curArgs.$el.find('.animation_plus_tool_item_origin'));
          }
        var styles = css.getStyleByFilter(_curArgs.index, name, par, origin);
        event.trigger('updateElement.canvas',{css: styles}, _curArgs.$el);
      }
    },
    // }}}
    // tabItemClickHandler {{{
    tabItemClickHandler: function(e){
      var $target = $(e.target);
      $target = $target.hasClass('.tab-cont-item') ? $target : $target.parent();
      if (!$target.hasClass('active')) {
        var idx = $target.data('index');
        if(!this.cached.idx[idx]){
          var s = this.getStyleHtml({type: idx})
          this.$tabContItem.eq(idx).append(s)
          this.setDoms(idx);
          this.cached.idx[idx] = true;
        }
        this.$tabContItem.eq(this.cached.idx.cur).removeClass('active');
        this.$tabContItem.eq(idx).addClass('active');
        this.$tabNavItem.eq(this.cached.idx.cur).removeClass('active');
        $target.addClass('active');
        this.cached.idx.cur = idx;
      }
    },
    // }}}
    // switchTransfromStyle {{{
    switchTransfromStyle:function(is2D){
      var curArgs = this.curArgs;
      this.$3d[is2D ? 'addClass' : 'removeClass']('Ldn');
      if(is2D){
          this.$3dIpt.val(null);
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
    },
    // }}}
    // styleOkHandler {{{
    styleOkHandler: function(e){
      var idx = this.cached.idx.cur;
      var index = this.curArgs.index;
      var $el = this.curArgs.$el;
      //添加className
      if(idx == '2'){
        var animationActive = this.$el.find('.button-animation.button-success');
        if(animationActive.length){
          var key = animationActive.data('key');
          data.setCached(index, {
              'curIdx': idx,
              'animationName': key
          });
        }else{
          data.setCached(index, 'animationName', null);
        }
      }
      //自定义transform
      if(idx == '0'){
        var _style = css.getCssByNamespaceWithoutSelector(index);
        data.setCached(index, {
            'style': _style,
            'curIdx': idx
        });
        event.trigger('updateElement.canvas', {style: null}, $el);
      }
      this.hide();
    },
    // }}}
    // initEvent {{{
    initEvent: function(){
      var self = this;
      var $el = this.$el;
      var timer = null;
      var animationClass = null;
      //切换tab
      $el.on('click', '.tab-nav-item', function(e) {
        self.tabItemClickHandler(e);
      });
      //切换动画库
      $el.on('click', '.button-animation', function(e){
        self.animationNameSwitchHandler(e);
      });
      //input[type="range"]的input事件
      $el.on('input', 'input[type="range"]', function(e){
        var $target = $(e.target);
        var $show = $target.parent().prev().find('input[type="text"]');
        $show.val($target.val());
      });
      //input change
      $el.on('change', 'input', function(e){
        var _self = this;
        self.transformIptChangeHandler(e, _self);
      });
      $el.on('click', '.button-ok', function(e){
        self.styleOkHandler(e);
      });
      $el.on('click', '.close', function(e){
        self.hide();
      })
    },
    // }}}
    // setMaxHeight {{{
    setMaxHeight: function(h){
      this.$el.find('.tab-cont').css('max-height', h - 160);
    }
    // }}}
  }
  // }}}
  //内部popup对象 {{{
  var _popup = {
    $operatePopup: $('#operate-popup'),
    $operate : $('#operate'),
    addEle: _addElePopup,
    updateEle: _updateEle,
    menu: _menu,
    style: _style,
    hide: function(){
      data.delCurrentArgs();
      this.$operatePopup.addClass('Ldn');
    },
    show: function(){
      this.$operatePopup.removeClass('Ldn');
    }
  }
  // }}}
  //对外popup对象接口 {{{
  var popup = {
    addElement: function() {
      if(_popup.addEle.hasInited){
        _popup.addEle.show();
      }else{
        _popup.addEle.init();
      }
    },
    updateElement: function() {
      var _curArgs = data.getCurrentArgs();
      if(_curArgs){
        if(_popup.updateEle.hasInited){
          _popup.updateEle.show(_curArgs);
        }else{
          _popup.updateEle.init(_curArgs);
        }
      }
    },
    showMenu: function(e){
      _popup.menu.show(e);
    },
    hideMenu: function(){
      _popup.menu.hide();
    },
    showStyle: function(){
      var _curArgs = data.getCurrentArgs();
      if(_curArgs){
        if(_popup.style.hasInited){
          _popup.style.show(_curArgs);
        }else{
          _popup.style.init(_curArgs);
        }
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
          warnLayer.__opts = opts;
        }
    }
  }
  // }}}
  return popup
});


// vim: se ts=2 sts=2 sw=2 fdm=marker cc=80 et:
