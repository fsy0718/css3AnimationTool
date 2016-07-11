define(['underscore'],function(_){return function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';

  var navItems = {
    '0': {
      name: "变形&过渡"
    },
    '1': {
      name: '自定义动画'
    },
    '2': {
      name: '动画库'
    }
  }
  var animations = [{
    name: '基本效果',
    items: {
      flash: "闪光灯",
      bounce: "弹起",
      shake: "摇摆",
      tada: "秋千",
      swing: "swing",
      wobble: "疯狂摆动",
      pulse: "脉冲"
    }
  }, {
    name: '翻转',
    items: {
      flip: "翻转",
      flipInX: "X轴淡入",
      flipOutX: "X轴淡出",
      flipInY: "Y轴淡入",
      flipOutY: "Y轴淡出"
    }
  }, {
    name: '淡入效果',
    items: {
      fadeIn: "淡入",
      fadeInUp: "下方淡入",
      fadeInDown: "上方淡入",
      fadeInLeft: "左边淡入",
      fadeInRight: "右边淡入",
      fadeInUpBig: "底部淡入",
      fadeInDownBig: "顶部淡入",
      fadeInLeftBig: "页面左边淡入",
      fadeInRightBig: "页面右边淡入"
    }
  }, {
    name: "淡出效果",
    items: {
      fadeOut: "淡出",
      fadeOutUp: "向上淡出",
      fadeOutDown: "向下淡出",
      fadeOutLeft: "向左淡出",
      fadeOutRight: "向右淡出",
      fadeOutUpBig: "顶部淡出",
      fadeOutDownBig: "底部淡出",
      fadeOutLeftBig: "页面左边淡出",
      fadeOutRightBig: "页面右边淡出"
    }
  }, {
    name: "弹跳进入效果",
    items: {
      bounceIn: "bounceIn",
      bounceInDown: "bounceInDown",
      bounceInUp: "bounceInUp",
      bounceInLeft: "bounceInLeft",
      bounceInRight: "bounceInRight"
    }
  }, {
    name: "弹跳退出效果",
    items: {
      bounceOut: "bounceOut",
      bounceOutDown: "bounceOutDown",
      bounceOutUp: "bounceOutUp",
      bounceOutLeft: "bounceOutLeft",
      bounceOutRight: "bounceOutRight"
    }
  }, {
    name: "旋转进入效果",
    items: {
      rotateIn: "rotateIn",
      rotateInDownLeft: "rotateInDownLeft",
      rotateInDownRight: "rotateInDownRight",
      rotateInUpLeft: "rotateInUpLeft",
      rotateInUpRight: "rotateInUpRight"
    }
  }, {
    name: "旋转退出效果",
    items: {
      rotateOut: "rotateOut",
      rotateOutDownLeft: "rotateOutDownLeft",
      rotateOutDownRight: "rotateOutDownRight",
      rotateOutUpLeft: "rotateOutUpLeft",
      rotateOutUpRight: "rotateOutUpRight"

    }
  }, {
    name: "特效",
    items: {
      hinge: "hinge",
      rollIn: "rollIn",
      rollOut: "rollOut"
    }
  }];
  var NumberReg = /^[-]?(\d+)(\.\d+)?$/;

__p+=' ';
 if(obj.isFull){ 
__p+=' <div class="css3_tool_change_animate"> <i class="fa fa-times close" title="关闭"></i> <ul class="tab-nav pure-g"> ';
 _.each(navItems, function(item, key){ 
__p+=' <li class="'+
((__t=((key == obj.idx ? 'active' : null)))==null?'':__t)+
' tab-nav-item pure-u-1-3" data-index="'+
((__t=(key))==null?'':__t)+
'"> <a href="javascript:;" class="tab-nav-item-a">'+
((__t=(item.name))==null?'':__t)+
'</a> </li> ';
 }) 
__p+=' </ul> <ul class="tab-cont pure-g"> <li class="tab-cont-item tab-cont-item-transform tab-cont-item-0 pure-u-1" data-index="0"> ';
 } 
__p+=' ';
 if(obj.idx == 0) { 
__p+=' ';

    obj['0'] ? null : obj['0'] = {};
    var x = 50;
    var y = 50;
    if(obj['0']['transform-origin']){
        var _x = parseFloat(obj['0']['transform-origin'].x)
        var _y = parseFloat(obj['0']['transform-origin'].y)
        _x >= 0 ? x = _x : null;
        _y >= 0 ? y = _y : null;
    }
    var is3D = obj['0']['transform-style'] && obj['0']['transform-style'] === 'preserve-3d' ? true : false;
    var is2D = obj['0']['transform-style'] && obj['0']['transform-style'] === 'flat' ? true : false;
    var direction = [['旋转','deg','rotate',-360,360],['缩放','倍','scale',-5,5],['位移','px','translate',-1000,1000],['倾斜','deg','skew',-180,180]];
    var t = {};
    if(obj['0']['transform']){

        t.X0 = parseFloat(obj['0']['transform'].rotateX);
        t.Y0 = parseFloat(obj['0']['transform'].rotateY);
        t.Z0 = parseFloat(obj['0']['transform'].rotateZ);
        t.X1 = parseFloat(obj['0']['transform'].scaleX);
        t.Y1 = parseFloat(obj['0']['transform'].scaleY);
        t.Z1 = parseFloat(obj['0']['transform'].scaleZ);
        t.X2 = parseFloat(obj['0']['transform'].translateX);
        t.Y2 = parseFloat(obj['0']['transform'].translateY);
        t.Z2 = parseFloat(obj['0']['transform'].translateZ);
        t.X3 = parseFloat(obj['0']['transform'].skewX);
        t.Y3 = parseFloat(obj['0']['transform'].skewY);
      if(obj['0']['transform']['matrix']){
        t.a = parseFloat(obj['0']['transform']['matrix'].a);
        t.b = parseFloat(obj['0']['transform']['matrix'].b);
        t.c = parseFloat(obj['0']['transform']['matrix'].c);
        t.d = parseFloat(obj['0']['transform']['matrix'].d);
        t.e = parseFloat(obj['0']['transform']['matrix'].e);
        t.f = parseFloat(obj['0']['transform']['matrix'].f);
      }
    }
  
__p+=' <dl> <dt>变形原点</dt> <dd class="s2d"> <ul class="list"> <li class="item pure-g"> <label class="pure-u-1-3"> <span class="label">X</span> <input type="text" name="x" data-parent="transform-origin" min="0" max="100" step="1" , value="'+
((__t=(x))==null?'':__t)+
'"> <span class="unit">%</span> </label> <span class="control pure-u-2-3"> <input type="range" min="0" max="100" step="1" , value="'+
((__t=(x))==null?'':__t)+
'"> </span> </li> <li class="item pure-g"> <label class="pure-u-1-3"> <span class="label">Y</span> <input type="text" name="y" data-parent="transform-origin" min="0" max="100" step="1" , value="'+
((__t=(y))==null?'':__t)+
'"> <span class="unit">%</span> </label> <span class="control pure-u-2-3"> <input type="range" min="0" max="100" step="1" , value="'+
((__t=(y))==null?'':__t)+
'"> </span> </li> </ul> </dd> <dd class="s2d"> <span>是否3D呈现</span> <ul class="list pure-g"> <li class="item pure-u-1-2"> <label> <input type="radio" name="transform-style" , value="flat" '+
((__t=((is2D ? 'checked="checked"' : null)))==null?'':__t)+
'> <span class="label">2d</span> </label> </li> <li class="item pure-u-1-2"> <label> <input type="radio" name="transform-style" , value="preserve-3d" '+
((__t=((is3D ? 'checked="checked"' : null)))==null?'':__t)+
'> <span class="label">3d</span> </label> </li> </ul> </dd> ';
 _.each(direction, function(val, key){ 
__p+=' ';
 if(key === 3){ 
__p+=' ';
 var _dir = ['X', 'Y'] 
__p+=' ';
}else{ 
__p+=' ';
 var _dir = ['X', 'Y', 'Z'] 
__p+=' ';
} 
__p+=' ';
 _.each(_dir, function(_val, _key){ 
__p+=' <dd class="pure-g '+
((__t=((_key == 2 ? (is3D ? 's3d' : 's3d Ldn') : 's2d')))==null?'':__t)+
'"> <label class="pure-u-1-3"> <span class="label">'+
((__t=(_val))==null?'':__t)+
'轴'+
((__t=(val[0]))==null?'':__t)+
'</span> <span class="input"> <input type="text" name="'+
((__t=((val[2] + _val)))==null?'':__t)+
'" data-origin="transform" value="'+
((__t=((NumberReg.test(t[_val + key]) ? t[_val + key] : null)))==null?'':__t)+
'"> </span> <span class="unit">'+
((__t=(val[1]))==null?'':__t)+
'</span> </label> <span class="control pure-u-2-3"> <input type="range" min="'+
((__t=(val[3]))==null?'':__t)+
'" max="'+
((__t=(val[4]))==null?'':__t)+
'" step="1" value="'+
((__t=((NumberReg.test(t[_val + key]) ? t[_val + key] : null)))==null?'':__t)+
'"> </span> </dd> ';
}) 
__p+=' ';
 }) 
__p+=' <dt>矩阵变形</dt> <dd class="s2d"> <ul class="list pure-g"> ';
 _.each(['a', 'b','c', 'd', 'e', 'f'], function(val, key){ 
__p+=' <li class="item pure-u-1-3"> <label> <span class="label">参数'+
((__t=(val))==null?'':__t)+
'</span> <input type="number" name="'+
((__t=(val))==null?'':__t)+
'" data-parent="matrix" data-origin="transform" value="'+
((__t=((NumberReg.test(t[val]) ? t[val] : (key < 2 ? 1 : 0))))==null?'':__t)+
'"> </label> </li> ';
 }) 
__p+=' </ul> </dd> <dd class="s2d"> <label> <span class="label">过渡css属性</span> <span class="input"> <input type="text" name="transition-property" value="all"> </span> </label> </dd> <dd class="s2d"> <label> <span class="label">过渡延迟时间</span> <span class="input"> <input type="number" name="transition-delay" step="0.1" value="'+
((__t=((obj['0']['transition-delay'] ? parseFloat(obj['0']['transition-delay']) : null)))==null?'':__t)+
'"> </span> <span class="unit">s</span> </label> </dd> <dd class="s2d"> <label> <span class="label">过渡时间</span> <span class="input"> <input type="number" name="transition-duration" step="0.1" value="'+
((__t=((obj['0']['transition-duration'] ? parseFloat(obj['0']['transition-duration']) : null)))==null?'':__t)+
'"> </span> <span class="unit">s</span> </label> </dd> <dt>过渡效果</dt> <dd class="s2d"> <ul class="list pure-g"> ';
_.each(['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'], function(val,key){ 
__p+=' <li class="item pure-u-1-3"> <label> <input type="radio" name="transition-timing-function" value="'+
((__t=(val))==null?'':__t)+
'" '+
((__t=((obj['0']['transition-timing-function'] === val ? 'checked="checked"' : null)))==null?'':__t)+
' > <span class="label">'+
((__t=(val))==null?'':__t)+
'</span> </label> </li> ';
 }) 
__p+=' <li class="item pure-u-1-3"> <label> ';

            if(/^cubic\-bezier/.test(obj['0']['transition-timing-function'])){ 
__p+=' <input type="radio" name="transition-timing-function" value="'+
((__t=(obj['0']['transition-timing-function']))==null?'':__t)+
'" checked="checked"> <span class="label">'+
((__t=(obj['0']['transition-timing-function']))==null?'':__t)+
'</span> ';
 }else{
__p+=' <input type="radio" name="transition-timing-function" value="cubic-bezier(0.500,0.250,0.500,0.750)"> <span class="label">cubic-bezier(0.500,0.250,0.500,0.750)</span> ';
}
__p+=' </label> </li> </ul> </dd> </dl> ';
} 
__p+=' ';
 if(obj.isFull){ 
__p+=' </li> <li class="tab-cont-item tab-cont-item-1 tab-cont-item-animate-diy pure-u-1" data-index="1"> </li> <li class="tab-cont-item tab-cont-item-2 tab-cont-item-animate pure-u-1" data-index="2"> ';
 } 
__p+=' ';
 if(obj.idx == 2){ 
__p+=' <dl> ';
 _.each(animations, function(animation, key){ 
__p+=' <dt class="sort-title"><span>'+
((__t=(animation.name))==null?'':__t)+
'</span></dt> ';
if(animation.items){
__p+=' <dd class="sort-content"> ';
 _.each(animation.items, function(item, _key){ 
__p+=' <a href="javascript:;" class="pure-button button-animation button-small '+
((__t=((obj['2'] === _key ? 'button-success' : null)))==null?'':__t)+
'" data-key="'+
((__t=(_key))==null?'':__t)+
'">'+
((__t=(item))==null?'':__t)+
'</a> ';
 }) 
__p+=' </dd> ';
} 
__p+=' ';
 }) 
__p+=' </dl> ';
 } 
__p+=' ';
 if(obj.isFull){
__p+=' </li> </ul> <div class="pure-text-align-center animate-button-box"> <a href="javascript:;" class="pure-button button-reset">重置</a> <a href="javascript:;" class="button-success pure-button button-ok">确定</a> </div> </div> ';
 } 
__p+=' ';
}
return __p;
}});