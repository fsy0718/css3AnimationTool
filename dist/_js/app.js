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
    if(target.hasClass('btn__export')){
      target.setAttribute('download', 'download.css');
      target.setAttribute('href', 'data: text/css;charset=utf-8,body{color:red}');
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
    var cssObj = styles.getRulesByNamespace(currentNamespace);
    if (cssObj && cssObj.transform) {
      cssObj.transform.__index.forEach(function(z) {
        //如果是3d独有属性
        if (isTransformStyleDD3dZ.test(z)) {
          styles.delRule(currentNamespace, z, null, 'transform');
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
    var _s = styles.addRule(currentNamespace, name, _value, parent, origin);
    //更新origin在图示中的位置
    if(parent === 'transform-origin'){
      var _kk = name === 'x' ? 'left' : 'top'
      context.$activeEle.querySelector('.css3_item_origin').css(_kk, _s['transform-origin'][name]);
    }
    context.trigger('addRuleComplete', {
      name: name,
      parent: parent,
      origin: origin,
      namespace: currentNamespace
    })
  })

  var $tabContItem = [].slice.call(context.$popupTransform.querySelectorAll('.tab-cont-item'));
  var $tabNavItem = [].slice.call(context.$popupTransform.querySelectorAll('.tab-nav-item'));
  var $animatedActive = null;
  var popupTransformNavIdx = 0;
  $popupTransform.addEventListener('click', function(e) {
    var $target = e.target;
    //关闭
    if ($target.hasClass('close')) {
      context.trigger('popupTransformHide');
    }
    //获取属性
    if ($target.hasClass('btn--green')) {

      context.trigger('popupTransformOk', popupTransformNavIdx, popupTransformNavIdx == 2 ? $animatedActive.dataset.key : null);
    }
    if($target.hasClass('tab-nav-item-a')){
      $target = $target.parentNode;
    }
    if($target.hasClass('tab-nav-item') && !$target.hasClass('active')){
      var _idx = +$target.dataset.index;
      $tabNavItem[popupTransformNavIdx].removeClass('active');
      $tabContItem[popupTransformNavIdx].removeClass('active');
      $target.addClass('active');
      $tabContItem[_idx].addClass('active');
      popupTransformNavIdx = _idx;
    }
    if($target.hasClass('btn__animate') && !$target.hasClass('active')){
      var animate = $target.dataset.key;
      $target.addClass('active');
      $animatedActive && $animatedActive.removeClass('active');
      $animatedActive = $target;
      context.trigger('addRuleComplete',animate)
    }
  })
}

var popupFileIptClass = null;
var popupFileIptName = null;
var popupFileSelect = null;
var popupFileImport = null;
var popupFileImportIpt = null;
var popupFilePreview = null;
var namespaceReg = /^\w+([\-\_]\w+)*$/;
var popupFileArg = {};
var popupFileHideHandler = function(){
  //恢复到初始状态
  popupFilePreview.innerHTML = '';
  popupFileIptClass.value = '';
  popupFileIptName.value = '';
  popupFileImportIpt.value = '';
  popupFileSelect.value = 'circle';
  //将值改为初始状态
  popupFileArg = {}
  popupFileImport.hide();
  this.$popupFile.hide();

}
var popupFileShowHandler = function(){
    //第一次运行赋四个值
  if(!popupFileIptClass){
    var ipts = this.$popupFile.querySelectorAll('input[type="text"]')
    popupFileIptClass = ipts[0];
    popupFileIptName = ipts[1];
    popupFilePreview = this.$popupFile.querySelector('.preview');
    popupFileSelect = this.$popupFile.querySelector('select');
    popupFileImport = this.$popupFile.querySelector('.import-area');
    popupFileImportIpt = popupFileImport.querySelector('input[type="file"]');
  }
  //如果当前transform还存在
  if(this.$activeEle){
    this.trigger('popupTransformHide');
  }
  this.$popupFile.css('display', 'flex');
}

var popupFileEvent = function(context) {
  var hasError = false;
  context.$popupFile.addEventListener('click', function(e){
    var target = e.target;
    if(target.hasClass('btn--green') && !hasError){
      var a = popupFilePreview.children[0];
      if(a){
        popupFileArg.file = a;
        context.trigger('addFile',popupFileArg);
      }else{
        context.trigger('popupFileHide');
      }

    }
    if(target.hasClass('close')){
      context.trigger('popupFileHide');
    }
  },false);
  context.$popupFile.addEventListener('change', function(e){
    var $target = e.target;
    var type = $target.getAttribute('type');
    if($target.nodeName.toLowerCase() === 'select'){
      var isFile = $target.value === 'file';
      popupFileImport[ isFile ? 'show' : 'hide']();
      popupFileImportIpt.value = '';
      //类型需要变化
      popupFileArg.type = +isFile;

    }
    if(type === 'file'){
      var file = $target.files[0];
      var img = document.createElement('img');
      img.file = file;
      //首先需要清空已添加的元素，一次只能添加一个
      popupFilePreview.appendChild(img);
      var reader = new FileReader();
      reader.onload = (function(aImg) {
        return function(e) {
          aImg.src = e.target.result;
        }
      })(img);
      reader.readAsDataURL(file);
    }
    if(type === 'text'){
      var name = $target.getAttribute('name');
      var val = ($target.value || '').trim();
      if(val){
        if(name === 'namespace'){
          if(namespaceReg.test(val) && context.classes._classList.indexOf(val) === -1){
            popupFileArg.namespace = val;
            hasError = false;
            popupFileIptClass.removeClass('error');
          }else{
            popupFileIptClass.addClass('error');
            hasError = true;
          }
        }
        if(name === 'name'){
          popupFileArg.name = val;
        }
      }
    }
  })
}

var popupMenuEvent = function(context) {
  context.$popupMenu.addEventListener('click', function(e){
    e.stopPropagation();
    var $target = e.target;
    if($target.hasClass('item')){
      var key = $target.dataset.key;
      if(key === 'editor_animation'){
        context.trigger('popupMenuHide');
        context.trigger('popupTransformShow');
      }
    }
  })
  document.body.addEventListener('click', function(e){
    context.trigger('popupMenuHide');
  },false)
}

var animationClass = null;
var animationTimer = null;
var initFn = function() {
  var self = this;
  self.tree = new Tree(null, {
    dom: self.$tree,
    contextmenuFn: function(e, target, data) {
      self.currentNamespace = data.id;
      self.trigger('popupMenuShow', e, target, data);
    }
  });
  self.styles = new StyleFn();
  self.animationList = [];
  //监听展示弹框
  self.on('popupTransformShow', function(data) {
    self.$activeEle = document.querySelector('.' + self.classes[self.currentNamespace].namespace);
    this.$popupTransform.css('display', 'flex');
  });
  self.on('popupFileShow', function(data) {
    popupFileShowHandler.apply(self, arguments);
  });
  self.on('popupMenuShow', function(e){
    //top要减去本身高度的一半
    self.$popupMenu.css('left', e.x + 'px').css('top',(e.y - 48)+ 'px' )
    self.$popupMenuBox.show();
  });
  self.on('popupTransformHide', function(data) {
    self.currentNamespace = null;
    self.$activeEle = null;
    self.$popupTransform.hide();
  });
  self.on('popupFileHide', function(){
    return popupFileHideHandler.apply(self, arguments);
  });
  self.on('popupMenuHide', function(data){
    self.$popupMenuBox.hide();
  })
  self.on('popupTransformOk', function(idx, className){
    var namespace = self.classes[self.currentNamespace];
    if(idx == 2){
      namespace.alias ? namespace.alias.push(className) : namespace.alias = [className];
    }else if(idx == 0 ){
      var css = self.styles.getCssByNamespaceWithoutSelector(self.currentNamespace);
      if(css){
        if(!self.$style){
          self.$style = document.createElement('style');
          self.$style.id = 'css3__style';
          document.head.appendChild(self.$style);
        }
        self.$style.innerHTML = '.animated.' + namespace.namespace + '{\n' + css + '}\n';
      }
    }
    self.$activeEle.style = null;
    self.trigger('popupTransformHide');

  });
    //监听添加资源
  self.on('addFile', function(obj) {
    var name,namespace;
    if(!obj.name){
      var treeId = self.tree.getShortId();
      name = 'tree_' + treeId;
    }else{
      name = obj.name;
    }
    var tree = self.tree.addTreeItem(name, treeId);
    var $dom = document.createElement('div');
    self.classes[tree.id] = {
      namespace: obj.namespace || 'css3_item_' + treeId
    }
    $dom.innerHTML = '<i class="css3_item_origin"></i>'
    $dom.className = 'css3_items ' + self.classes[tree.id].namespace;
    $dom.appendChild(obj.file);
    self.$canvas.appendChild($dom);
    obj.namespace && self.classes._classList.push(obj.namespace);
    self.trigger('popupFileHide');
    //默认全部添加进动画 TODO后期需要做分组动画演示
    self.animationList.push(tree.id);
  });
    //监听变化css样式
  self.on('addRuleComplete', function(data) {
    //添加class
    if(typeof data === 'string'){
      clearTimeout(animationTimer);
      animationClass && self.$activeEle.removeClass(animationClass);
      animationClass = 'animated ' + data;
      self.$activeEle.addClass(animationClass);
      animationTimer = setTimeout(function(){
        self.$activeEle.removeClass(animationClass);
        animationClass = null;
      },1500);
    }else{
      var styles = self.styles.getStyleByFilter(data.namespace, data.name, data.parent, data.origin);
      self.$activeEle.css(styles.name, styles.rule);
    }

  });
  self.on('animationRun', function(){
    if(self.animationList.length){
      self.animationList.forEach(function(id){
        var selector = self.classes[id].namespace;
        var className = 'animated ' + (self.classes[id].alias || []).join(' ');
        var el = document.querySelector('.' + selector);
        var timer = null;
        if(el.hasClass('animated')){
          el.removeClass(className);
          clearTimeout(timer);
          timer = setTimeout(function(){
            el.addClass(className);
          },300);
        }else{
          el.addClass(className);
        }
      })
    }
  })
  popupTransformEvents(self);
  popupFileEvent(self);
  popupMenuEvent(self);
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
  var arg = [].slice.call(arguments,1);
  var events = self.events;
  if (events[type]) {
    events[type].apply(self, arg);
  }
}
var $popupMenuBox = document.querySelector('.popup__contextmenu');
var $popupMenu = $popupMenuBox.querySelector('.popupbox');
var app = {
  $popupTransform: document.querySelector('.popup__transform'),
  $popupFile: document.querySelector('.popup__file'),
  $popupMenuBox: $popupMenuBox,
  $popupMenu: $popupMenu,
  $tree: document.querySelector('.treebox'),
  $canvas: document.querySelector('#canvas'),
  $style: document.querySelector('#css3__style'),
  init: initFn,
  trigger: trigger,
  on: on,
  events: {},
  classes: {_classList:[]}
};

app.init();
