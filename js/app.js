"use strict";


var controlBtnEvents = function() {
  var controlBtnBox = document.querySelector('.control .btnbox');
  controlBtnBox.addEventListener('click', function(e) {
    var target = e.target;
    if (target.hasClass('btn__add')) {
      app.trigger('popupFileShow');
    }
  }, false);
  var headBtnBox = document.querySelector('header .btnbox');
  headBtnBox.addEventListener('click', function(e){
    var target = e.target;
    if(target.hasClass('btn__run')){
      app.trigger('animationRun');
    }
  })
}

var popupTransformEvents = function(context) {
  var $popupTransform = context.$popupTransform;
  var styles = context.styles;
  //var transformStyleItems = [].slice.call(document.querySelectorAll('input[type="number"],input[type="text"],input[type="radio"]:checked'));
  var transformStyleDD3d = [].slice.call(document.querySelectorAll('.s3d'));
  var transformStyleDD3dIpt = [];
  var transformStyleDD3dRange = [];
  var isTransformStyleDD3dZ = /Z\s*$/
  transformStyleDD3d.forEach(function(ele) {
    transformStyleDD3dIpt.push(ele.querySelector('input[type="text"]'));
    transformStyleDD3dRange.push(ele.querySelector('input[type="range"]'));
  });
  //删除3d特有的transform规则
  var deleteTransform3DStyle = function(currentNamespace) {
    var cssObj = styles.getCssObjByNamespace(currentNamespace);
    if (cssObj && cssObj.transform) {
      cssObj.transform.__index.forEach(function(z) {
        //如果是3d独有属性
        if (isTransformStyleDD3dZ.test(z)) {
          styles.delCss(currentNamespace, z, null, 'transform');
        }
        return true;
      })
    }
  };
  $popupTransform.addEventListener('input', function(e) {
    var $target = e.target;
    var $type = $target.getAttribute('type');
    if ($type === 'range') {
      var $show = $target.parentNode.previousElementSibling.querySelector('input');
      $show.value = $target.value;
    }
  }, false);

  $popupTransform.addEventListener('change', function(e) {
    var $target = e.target;
    var currentNamespace = context.currentNamespace;
    var $type = $target.getAttribute('type');
    //更新后面的range
    if ($type == 'text') {
      var $range = $target.parentNode.parentNode.nextElementSibling.querySelector('input[type="range"]');
      $range.value = $target.value;
    }
    if ($type == 'range') {
      var $show = $target.parentNode.previousElementSibling.querySelector('input');
    } else {
      var $show = $target;
    }

    var parent = $show.dataset.parent;
    var name = $show.getAttribute('name');
    var origin = $show.dataset.origin;
    var _value = $show.value;
    //切换2d 3d
    if ($type == 'radio' && name === 'transform-style') {
      //2d时，需要删除3d的属性
      var is2D = _value === 'flat';
      if (is2D) {
        deleteTransform3DStyle(currentNamespace);
      }
      transformStyleDD3d.forEach(function(ele, index) {
        ele.classList[is2D ? 'add' : 'remove']('Ldn');
        if (is2D) {
          transformStyleDD3dRange[index].value = 0;
          transformStyleDD3dIpt[index].value = null;
        }
      });
    }

    var _s = styles.addCss(currentNamespace, name, _value, parent, origin);
    //更新origin在图示中的位置
    if(parent === 'transform-origin'){
      var _kk = name === 'x' ? 'left' : 'top'
      context.$activeEle.querySelector('.css3_item_origin').css(_kk, _s['transform-origin'][name]);
    }
    context.trigger('addCssComplete', {
      name: name,
      parent: parent,
      origin: origin,
      namespace: currentNamespace
    })

  })

  var $tabContItem = [].slice.call(context.$popupTransform.querySelectorAll('.tab-cont-item'));
  var $tabNavItem = [].slice.call(context.$popupTransform.querySelectorAll('.tab-nav-item'));
  $popupTransform.addEventListener('click', function(e) {
    var $target = e.target;
    //关闭
    if ($target.hasClass('close')) {
      context.trigger('popupTransformHide');
    }
    //获取属性
    if ($target.hasClass('btn--green')) {
      context.trigger('popupTransformOk');
    }
    if($target.hasClass('tab-nav-item-a')){
      $target = $target.parentNode;
    }
    if($target.hasClass('tab-nav-item') && !$target.hasClass('active')){
      var _idx = +$target.dataset.index;
      $tabContItem.forEach(function(el,i){
        el.css('display', i === _idx ? 'block' : 'none')
      });
      $tabNavItem.forEach(function(el,i){
        el[i === _idx ? 'addClass' : 'removeClass']('active');
      })
    }
  })
}

var popupFileEvent = function(context) {
  var file = context.$popupFile.querySelector('input[type="file"]');
  var preview = context.$popupFile.querySelector('.preview');
  file.onchange = function(e) {
    var file = this.files[0];
    var img = document.createElement('img');
    img.file = file;
    //首先需要清空已添加的元素，一次只能添加一个
    preview.appendChild(img);
    var reader = new FileReader();
    reader.onload = (function(aImg) {
      return function(e) {
        aImg.src = e.target.result;
      }
    })(img);
    reader.readAsDataURL(file);
  }
  context.$popupFile.addEventListener('click', function(e){
    var target = e.target;
    if(target.hasClass('btn--green')){
      var a = preview.children[0];
      if(a){
        context.trigger('addFile',a);
      }
      file.value = null;
      context.trigger('popupFileHide');
    }
  },false)
}

var initFn = function() {
  var self = this;
  self.tree = new Tree(null, {
    dom: self.$tree,
    contextmenuFn: function(e, target, data) {
      self.currentNamespace = 'css3_item_' + data.id;
      self.trigger('popupTransformShow');
    }
  });
  self.styles = new StyleFn();
  self.animationList = [];
  //监听展示弹框
  self.on('popupTransformShow', function(data) {
    self.$activeEle = document.querySelector('.' + self.currentNamespace);
    this.$popupTransform.css('display', 'flex');
  })
  self.on('popupFileShow', function(data) {
    //如果当前transform还存在
    if(self.$activeEle){
      self.trigger('popupTransformHide');
    }
    this.$popupFile.css('display', 'flex');
  })
  self.on('popupTransformHide', function(data) {
    self.currentNamespace = null;
    self.$activeEle = null;
    self.$popupTransform.hide();
  })
  self.on('popupFileHide', function(){
    self.$popupFile.hide();

  });
  self.on('popupTransformOk', function(){
    if(!self.$style){
      self.$style = document.createElement('style');
      self.$style.id = 'css3__style';
      document.head.appendChild(self.$style);
    }
    var css = self.styles.getCssByNamespace(self.currentNamespace);
    self.$style.innerHTML = '.animated.' + css;
    self.$activeEle.style = null;
    //TODO 后期需要做分组动画
    self.animationList.push(self.currentNamespace);
    self.trigger('popupTransformHide');
  });
    //监听添加资源
  self.on('addFile', function(el) {
      var tree = self.tree.addTreeItem('添加一个svg文件');
      var $dom = document.createElement('div');
      $dom.innerHTML = '<i class="css3_item_origin"></i>'
      $dom.className = 'css3_items css3_item_' + tree.id;
      $dom.appendChild(el);
      self.$canvas.appendChild($dom);
  });
    //监听变化css样式
  self.on('addCssComplete', function(data) {
    var styles = self.styles.getStyleByFilter(data.namespace, data.name, data.parent, data.origin);
    self.$activeEle.css(styles.name, styles.rule);
  });
  self.on('animationRun', function(){
    if(self.animationList.length){
      self.animationList.forEach(function(selector){
        var el = document.querySelector('.' + selector);
        var timer = null;
        if(el.hasClass('animated')){
          el.removeClass('animated');
            clearTimeout(timer);
            timer = setTimeout(function(){
              el.addClass('animated')
            },300);
        }else{
          el.addClass('animated');
        }
      })
    }
  })
  popupTransformEvents(self);
  popupFileEvent(self);
  controlBtnEvents();
  return self;
}

var on = function(type, call) {
  var self = this;
  var events = self.events;
  events[type] = call;
}

var trigger = function(type, data) {
  var self = this;
  var events = self.events;
  if (events[type]) {
    events[type].call(self, data);
  }
}

var app = {
  $popupTransform: document.querySelector('.popup__transform'),
  $popupFile: document.querySelector('.popup__file'),
  $tree: document.querySelector('.treebox'),
  $canvas: document.querySelector('#canvas'),
  $style: document.querySelector('#css3__style'),
  init: initFn,
  trigger: trigger,
  on: on,
  events: {}
};

app.init();
