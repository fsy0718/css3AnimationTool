"use strict";

var $popup = document.querySelector('.popup');

var transformStyle = {
}

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

  if($type == 'text'){
    var $range = $target.parentNode.parentNode.nextElementSibling.querySelector('input[type="range"]');
    $range.value= $target.value;
  }
  if($type == 'range'){
    var $show  = $target.parentNode.previousElementSibling.querySelector('input');
  }else{
    var $show = $target;
  }
  var origin = $show.dataset.origin;
  var name = $show.getAttribute('name');
  var key = $show.dataset.key;
  if(!origin){
    console.error('this elements ' + $target + ' do not have origin');
  }
  //设置值
  if(name){
    if(!transformStyle[origin]){
      transformStyle[origin] = {};
    }
    transformStyle[origin][name] = $show.value;
  }else{
    transformStyle[origin] = $show.value;
  }
  //设置顺序
  if(key){
    if(!transformStyle[key]){
      transformStyle[key] = {
        index: []
      };
    }
    if(transformStyle[key].index.indexOf(origin) == -1){
      transformStyle[key].index.push(origin);
    }
  }

})


$popup.addEventListener('click', function(e){
  var $target = e.target;
  //关闭
  if($target.classList.contains('close')){
    $popup.style.display = 'none';
  }
  //获取属性
  if($target.classList.contains('btn--green')){
    getTransformStyle();
  }
})
