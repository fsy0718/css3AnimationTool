"use strict";

var $popup = document.querySelector('.popup');

var styles = {
}
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
      changeTransformStyle();

    }
    transformStyleDD3d.forEach(function(ele, index){
      ele.classList[is2D ? 'add' : 'remove']('Ldn');
      if(is2D){
        transformStyleDD3dRange[index].value = 0;
        transformStyleDD3dIpt[index].value = null;
      }
    });
  }
  var result;
  var unit = css3Units[name];
  if(origin){
    styles[origin] ? null : styles[origin] = {};
    result = styles[origin]
    //设置顺序
    if(origin === 'transform'){
      var _name = parent ? parent : name
      if(!result._index){
        result._index = [_name];
      }else{
        result._index.indexOf(_name) === -1 ? result._index.push(_name) : null;
      }
    }
  }else{
    result = styles;
  }

  if(parent){
    unit = css3Units[parent + '-' + name]
    result[parent] ? null : result[parent] = {};
    result = result[parent];
  }

  if(unit){
    result[name] = _value + unit;
  }else if(/^\s*\d+\s*$/.test(_value)){
    result[name] = Number(_value);
  }else{
    result[name] = _value;
  }
  //如果是matrix
  if(parent === 'matrix' && Object.keys(result).length < 6){
    styles.transform.matrix = Object.assign({}, css3TransformDefaultVal.matrix, result);
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
    $popup.style.display = 'none';
    var cssString = createTransformStyle();
    rInterface('circle', cssString);
  }
})


var matrixOrder = ['a','b','c','d','e','f'];

var parseStyle = {
  matrix: function(val){
    var result = matrixOrder.map(function(a){
      return val[a];
    });
    return 'matrix(' + result.join(',') + ')';
  },
  default: function(val,key){
    //解决origin相关的
    if(/\-origin/.test(key)){
      return key + ':' + val.x + ' ' + val.y;
    }
  }
}

var changeTransformStyle = function(){
  if(styles.transform){
    styles.transform._index = styles.transform._index.filter(function(z){
      //如果是3d独有属性
      if(isTransformStyleDD3dZ.test(z)){
        delete styles.transform[z];
        return false;
      }
      return true;
    })
  }
}

var createTransformStyle = function(){
  var result = [];
  for(var cssKey in styles){
    var cssVal = styles[cssKey];
    if(cssVal && typeof cssVal !== 'object'){
      result.push(cssKey + ':' + cssVal);
    }else{
      if(cssVal._index){
        var cssString = cssKey + ':';
        cssVal._index.forEach(function(key,index){
          if(cssVal[key] && typeof cssVal[key] !== 'object'){
            cssString += ' ' + key + '(' + cssVal[key] + ')'
          }else{
            if(css3TransformDefaultVal[key]){
              var _val = Object.assign({}, css3TransformDefaultVal[key], cssVal[key]);
            }
            var _cssString = (parseStyle[key] || parseStyle.default)(_val,key)
            _cssString ? cssString += ' ' + _cssString : null;
          }
        })
        result.push(cssString);
      }else{
        if(css3TransformDefaultVal[cssKey]){
          var _val = Object.assign({}, css3TransformDefaultVal[cssKey], cssVal);
        }
        var _cssString = parseStyle[cssKey] || parseStyle.default(_val, cssKey)
        _cssString && result.push(_cssString);
      }
    }

  }
  return result.join(';');
}


var $circle = document.querySelector('circle');

var  resources = {};

var rInterface = function(key,val,cb){
  resources[key] = val;
  window['$' + key].style = val;
}
