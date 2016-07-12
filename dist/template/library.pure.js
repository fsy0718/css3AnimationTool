define(['underscore'],function(_){return function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="pure-menu"> <dl class="pure-menu-list"> <dt class="library-title pure-menu-item library-title-grid"> <i class="fa fa-plus"></i> <i class="fa fa-question-circle"></i> <span>布局设置</span> </dt> <dd class="library-content library-grid-content"> ';

            var grids = ['12 12','8 8 8','6 6 6 6','1'];
        
__p+=' ';
 _.each(grids, function(grid){ 
__p+=' <div class="lyrow ui-draggable"> <div class="preview"> <input value="'+
((__t=(grid))==null?'':__t)+
'" type="text"> </div> <span class="drag label"> <i class="fa fa-arrows"></i>拖动 </span> </div> ';
 }) 
__p+=' </dd> </dl> </div> ';
}
return __p;
}});