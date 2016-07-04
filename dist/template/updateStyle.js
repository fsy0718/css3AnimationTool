app.tpl.updateStyle = function(obj){
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

__p+=' ';
 if(obj.isFull){ 
__p+=' <div class="tab"> <ul class="tab-nav pure-g"> ';
 _.each(navItems, function(item, key){ 
__p+=' <li class="'+
((__t=((key == obj.idx ? 'active' : null)))==null?'':__t)+
' tab-nav-item pure-u-1-3" data-index="'+
((__t=(key))==null?'':__t)+
'"> <a href="javascript:;" class="tab-nav-item-a">'+
((__t=(item.name))==null?'':__t)+
'</a> </li> ';
 }) 
__p+=' </ul> <ul class="tab-cont"> ';
 } 
__p+=' ';
 if(obj['2']){ 
__p+=' <li class="tab-cont-item pure-u-1" data-index="2"><dl> ';
 _.each(animations, function(animation, key){ 
__p+=' <dt class="sort-title"><span>'+
((__t=(animation.name))==null?'':__t)+
'</span></dt> ';
if(animation.items){
__p+=' <dd class="sort-content"> ';
 _.each(animation.items, function(item, _key){ 
__p+=' <a href="javascript:;" class="pure-button button-small '+
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
__p+=' </dl></li> ';
 } 
__p+=' ';
 if(obj.isFull){
__p+=' </ul> </div> ';
 } 
__p+=' ';
}
return __p;
};