"use strict";
var $popup = document.querySelector('.popup');
var currentNamespace = null;
//引入简单树
var $tree = document.querySelector('.treebox');

//添加右侧资源
var tree = new Tree(null,
  {
    dom: $tree,
    contextmenuFn: function(e,target,data){
      currentNamespace = 'tree_' + data.id;
      $popup.removeClass('Ldn');
    }
});

var snap = Snap(document.querySelector('#canvas'));
var t = tree.addTreeItem('测试资源');
snap.paper.el('circle',{
  r: 30,
  cx: 150,
  cy: 50,
  fill: 'yellow'
}).addClass('tree_' + t.id);



//css规则构造函数
var styles = new StyleFn();
//var transformStyleItems = [].slice.call(document.querySelectorAll('input[type="number"],input[type="text"],input[type="radio"]:checked'));
var transformStyleDD3d = [].slice.call(document.querySelectorAll('.s3d'));
var transformStyleDD3dIpt = [];
var transformStyleDD3dRange = [];
var isTransformStyleDD3dZ = /Z\s*$/
transformStyleDD3d.forEach(function(ele){
  transformStyleDD3dIpt.push(ele.querySelector('input[type="text"]'));
  transformStyleDD3dRange.push(ele.querySelector('input[type="range"]'));
});

$popup.addEventListener('input', function(e){
  var $target = e.target;
  var $type = $target.getAttribute('type');
  if($type === 'range'){
    var $show  = $target.parentNode.previousElementSibling.querySelector('input');
    $show.value = $target.value;
  }
},false)

$popup.addEventListener('change', function(e){
  var $target = e.target;
  var $type = $target.getAttribute('type');
  //更新后面的range
  if($type == 'text'){
    var $range = $target.parentNode.parentNode.nextElementSibling.querySelector('input[type="range"]');
    $range.value= $target.value;
  }
  if($type == 'range'){
    var $show  = $target.parentNode.previousElementSibling.querySelector('input');
  }else{
    var $show = $target;
  }

  var parent = $show.dataset.parent;
  var name = $show.getAttribute('name');
  var origin = $show.dataset.origin;
  var _value = $show.value;
  //切换2d 3d
  if($type == 'radio' && name === 'transform-style'){
    //2d时，需要删除3d的属性
    var is2D = _value === 'flat';
    if(is2D){
      deleteTransform3DStyle();

    }
    transformStyleDD3d.forEach(function(ele, index){
      ele.classList[is2D ? 'add' : 'remove']('Ldn');
      if(is2D){
        transformStyleDD3dRange[index].value = 0;
        transformStyleDD3dIpt[index].value = null;
      }
    });
  }
  styles.addCss(currentNamespace, name, _value, parent, origin);
  console.log(styles);
})

$popup.addEventListener('click', function(e){
  var $target = e.target;
  //关闭
  if($target.classList.contains('close')){
    $popup.style.display = 'none';
  }
  //获取属性
  if($target.classList.contains('btn--green')){
    var css = styles.getCssByNamespaceWithoutSelector(currentNamespace);
    css = '.' + currentNamespace + '.animated {\n' + css + '}\n';
    setHeadStyle(css);
    $popup.style.display = 'none';
  }
})

//删除3d特有的transform规则
var deleteTransform3DStyle = function(){
  var transformStyle = styles.getCssObjByNamespace(currentNamespace).transform;
  if(transformStyle){
   transformStyle.__index.forEach(function(z){
      //如果是3d独有属性
      if(isTransformStyleDD3dZ.test(z)){
        styles.delCss(currentNamespace, z, null, 'transform');
      }
      return true;
    })
  }
}

var css3Style = document.querySelector('#css3Style');

var setHeadStyle = function(val){
  if(!css3Style){
    var css3Style = document.createElement('style');
    css3Style.id = 'css3Style';
    document.head.appendChild(css3Style);
  }
  css3Style.innerHTML = val;
}

var $headBtnBox = document.querySelector('.header .btnbox');
var timer = null;
$headBtnBox.addEventListener('click', function(e){
  var target = e.target;
  if(target.hasClass('btn__run')){
    //TODO 此处只调试一个，后面再修改
    var $dom = document.querySelector('.' + currentNamespace)
    if($dom){
      $dom.style = null;
      $dom.removeClass('animated');
      clearTimeout(timer);
      timer = setTimeout(function(){
        $dom.addClass('animated');
      },300)

    }
  }
},false)




