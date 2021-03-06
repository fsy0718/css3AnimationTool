define(['underscore'],function(_){return function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';

  var types = [{
    type: 'control-predefined',
    name: '选择控件组'
  },{
    type: 'control-import',
    name: '导入控件组'
  },{
    type: 'control-diy',
    name: '在线组件控件组'
  }];
  if(!obj){
    obj = {};
  }

__p+=' ';
 if(obj.isFull){ 
__p+=' <div class="css3_tool_add_element"> <i class="fa fa-times close" title="关闭"></i> <div class="pure-u-1 pure-text-align-center title">'+
((__t=((obj.isAdd ? '添加' : '修改')))==null?'':__t)+
'元素</div> <form class="pure-form"> ';
 } 
__p+=' <input type="hidden" id="css3_tool_add_element_index" value="'+
((__t=(obj.index))==null?'':__t)+
'"> <div class="pure-control-group pure-u-1"> <label> <span class="pure-u-mid-1-4">元素类型</span> <span class="pure-u-mid-1-2"> <select name="type" '+
((__t=((obj.disabled ? 'disabled="disabled"' : null)))==null?'':__t)+
'> ';
 _.each(types,function(type, index){ 
__p+=' <option value="'+
((__t=( type.type))==null?'':__t)+
'" '+
((__t=((obj.type === type.type ? 'selected="selected"' : null)))==null?'':__t)+
'>'+
((__t=(type.name))==null?'':__t)+
'</option> ';
 }) 
__p+=' </select> </span> <span class="pure-u-mid-1-4">目前仅支持选择控件组</span> </label> </div> <div class="pure-control-group pure-u-1"> <label> <span class="pure-u-mid-1-4">元素标识</span> <span class="pure-u-mid-2-4"> <input type="text" , name="identifier" placeholder="元素标识" , value="'+
((__t=(obj.identifier))==null?'':__t)+
'"> </span> <span class="pure-u-mid-1-4">此元素标识只有一个，且不能重复</span> </label> </div> <div class="pure-control-group pure-u-1 pure-text-align-center"> <a href="javascript:;" class="pure-button button-success">确定</a> </div> ';
 if(obj.isFull){ 
__p+=' </form> </div> ';
 } 
__p+=' ';
}
return __p;
}});