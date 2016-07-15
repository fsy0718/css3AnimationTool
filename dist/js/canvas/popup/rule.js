"use strict";
define(['data', 'tpl/updateRule', './popup', 'event'], function (data, updateRule, popup, event) {
  var css = data.css;
  var isTransformStyle3DZ = /Z\s*$/;
  //自定义样式对象 {{{
  var _rule = {
    hasInited: false,
    cached: {},
    // init {{{
    init: function (curArgs) {
      this.hasInited = true;
      this.curArgs = curArgs;
      var s = this.getRuleHtml({ isFull: true });
      var $el = $(s).appendTo(popup.$operate);
      this.cached.idx = { 0: true, cur: 0 };
      this.$el = $el;
      this.setDoms(0);
      var $content = $('.content');
      this.setRuleContMaxHeight($content.height());
      popup.show();
      this.$tabNavItem = $el.find('.tab-nav-item');
      this.$tabContItem = $el.find('.tab-cont-item');
      this.$tabContItem.eq(0).addClass('active');
      this.initEvent();
    },
    // }}}
    // show {{{
    show: function (curArgs) {
      this.curArgs = curArgs;
      var _data = data.getCached(curArgs.index);
      var type = _data.curIdx || 0;
      this.switchTabView(type);
      this.cached.idx[type] = true;
      this.cached.idx.cur = type;
      this.$el.show();
      popup.show();
    },
    // }}}
    // hide {{{
    hide: function () {
      var idx = this.curArgs.index;
      //缓存
      this.cached.lastNamespace = idx;
      delete this.curArgs;
      delete this.$s3d;
      delete this.$s3dIpt;
      this.timer = null;
      this.cached.idx = {};
      this.$el.hide();
      popup.hide();
    },
    // }}}
    // [getRuleHtml] {{{
    getRuleHtml: function (opts) {
      var curArgs = this.curArgs;
      var type = opts.type || 0;
      var s = '';
      if (!this.cached[curArgs.index]) {
        this.cached[curArgs.index] = {};
      }
      if (type === 0) {
        var _rules = css.getRulesByNamespace(curArgs.index);
        s = updateRule({
          '0': _rules,
          isFull: opts.isFull,
          idx: '0'
        });
      }
      if (type == 2) {
        s = updateRule({
          '2': data.getCached(curArgs.index, 'animationName'),
          isFull: opts.isFull,
          idx: '2'
        });
      }
      return s;
    },
    // }}}
    // setTabContItemHtml {{{
    setTabContItemHtml: function (idx, e) {
      var $el = this.$tabContItem.eq(idx);
      var $children = $el.children();
      if (!$children.length) {
        var s = this.getRuleHtml({ type: idx });
        $el.append(s);
        this.setDoms(idx);
      } else if (idx != 2) {
        var s = this.getRuleHtml({ type: idx });
        $children.replaceWith(s);
        this.setDoms(idx);
      } else {
        var _data = data.getCached(this.curArgs.index);
        //为动画库的时，只要切换class即可
        var animationName = _data.animationName;
        var activeAnimation = this.$btnAnimations.filter('.active');
        if (activeAnimation.length && activeAnimation.data('key') !== animationName) {
          activeAnimation.removeClass('active');
        } else if (animationName) {
          this.$btnAnimations.filter('[data-key="' + animationName + '"]').addClass('active');
        }
      }
      return this;
    },
    // }}}
    // 切换动画库类名事柄 [animationNameSwitchHandler] {{{
    animationNameSwitchHandler: function (e) {
      var $target = $(e.target);
      var self = this;
      if (!$target.hasClass('button-success')) {
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
        self.timer = setTimeout(function () {
          event.trigger('updateElement.canvas', {
            oldClassName: _newAnimationClass
          }, $el)
        }, 1500)
      } else {
        $target.removeClass('button-success');
      }
    },
    // }}}
    // 存储一些dom变量，用于事件 [setDoms] {{{
    setDoms: function (idx) {
      if (idx == 0) {
        this.$s3d = this.$el.find('.s3d');
        this.$s3dIpt = this.$el.find('.s3d input[type="text"], .s3d input[type="range"]');
      }
      if (idx == 2) {
        this.$btnAnimations = this.$el.find('.button-animation');
      }
    },
    // }}}
    // transformIptChangeHandler {{{
    transformIptChangeHandler: function (e) {
      var $target = $(e.target);
      var _curArgs = this.curArgs;
      var type = $target.prop('type');
      //更新range
      var $range = $target.parent().parent().next().find('input[type="range"]');
      if ($range.length && type === 'text') {
        $range.val($target.val());
      }
      if (type === 'range') {
        var $show = $target.parent().prev().find('input[type="text"]');
      } else {
        var $show = $target;
      }
      var par = $show.data('parent');
      var name = $show.prop('name');
      var origin = $show.data('origin');
      var val = $show.val().trim() || null;
      if (type === 'radio' && name === 'transform-style') {
        var is2D = val === 'flat';
        this.switchTransformStyleItems(is2D);
      }
      if (_curArgs.index) {
        var _rule = css.addRule(_curArgs.index, name, val, par, origin);
        if (par === 'transform-origin') {
          var opts = { name: name == 'x' ? 'left' : 'top', rule: _rule['transform-origin'][name] }
          event.trigger('updateElement.canvas', { css: opts }, _curArgs.$el.find('.animation_plus_tool_item_origin'));
        }
        var styles = css.getCssObjByFilter(_curArgs.index, name, par, origin);
        event.trigger('updateElement.canvas', { css: styles }, _curArgs.$el);
      }
    },
    // }}}
    // switchTabView {{{
    switchTabView: function (idx) {
      var $activeTabNavItem = this.$tabNavItem.filter('.active');
      var curIdx = $activeTabNavItem.data('index');
      //如果当前视图不是指定的视图
      if (idx != curIdx || this.curArgs.index != this.cached.lastNamespace) {
        //如果当前视图还未更新成指定元素的视图
        if (!this.cached.idx[idx]) {
          this.setTabContItemHtml(idx);
          this.cached.idx[idx] = true;
        }
        this.$tabContItem.filter('.active').removeClass('active');
        $activeTabNavItem.removeClass('active');
        this.$tabContItem.eq(idx).addClass('active');
        this.$tabNavItem.eq(idx).addClass('active');
        this.cached.idx.cur = idx;
      }
    },
    // }}}
    // switchTransformStyleItems {{{
    switchTransformStyleItems: function (is2D) {
      var curArgs = this.curArgs;
      this.$s3d[is2D ? 'addClass' : 'removeClass']('Ldn');
      if (is2D) {
        this.$s3dIpt.val(null);
        var transformStyleRuleObj = css.getRulesByNamespace(curArgs.index);
        if (transformStyleRuleObj && transformStyleRuleObj.transform) {
          transformStyleRuleObj.transform.__index.forEach(function (z) {
            if (isTransformStyle3DZ.test(z)) {
              css.delRule(curArgs.index, z, null, 'transform');
            };
            return true;
          })
        }
      }
    },
    // }}}
    // ruleOkHandler {{{
    ruleOkHandler: function (e) {
      var idx = this.cached.idx.cur;
      var index = this.curArgs.index;
      var $el = this.curArgs.$el;
      //添加className
      if (idx == '2') {
        var animationActive = this.$el.find('.button-animation.button-success');
        if (animationActive.length) {
          var key = animationActive.data('key');
          data.setCached(index, {
            'curIdx': idx,
            'animationName': key
          });
        } else {
          data.setCached(index, 'animationName', null);
        }
      }
      //自定义transform
      if (idx == '0') {
        var _css = css.getCssByNamespaceWithoutSelector(index);
        data.setCached(index, {
          'css': _css,
          'curIdx': idx
        });
        event.trigger('updateElement.canvas', { css: null }, $el);
      }
      this.hide();
    },
    // }}}
    // initEvent {{{
    initEvent: function () {
      var self = this;
      var $el = this.$el;
      var timer = null;
      var animationClass = null;
      //切换tab
      $el.on('click', '.tab-nav-item', function (e) {
        var $target = $(e.target);
        $target = $target.hasClass('tab-nav-item') ? $target : $target.parent();
        var idx = $target.data('index');
        self.switchTabView(idx)
      });
      //切换动画库
      $el.on('click', '.button-animation', function (e) {
        self.animationNameSwitchHandler(e);
      });
      //input[type="range"]的input事件
      $el.on('input', 'input[type="range"]', function (e) {
        var $target = $(e.target);
        var $show = $target.parent().prev().find('input[type="text"]');
        $show.val($target.val());
      });
      //input change
      $el.on('change', 'input', function (e) {
        var _self = this;
        self.transformIptChangeHandler(e, _self);
      });
      $el.on('click', '.button-ok', function (e) {
        self.ruleOkHandler(e);
      });
      $el.on('click', '.close', function (e) {
        self.hide();
      })
    },
    // }}}
    // setRuleContMaxHeight {{{
    setRuleContMaxHeight: function (h) {
      this.$el.find('.tab-cont').css('max-height', h - 160);
    }
    // }}}
  }
  // }}}
  return _rule;
});