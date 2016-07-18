define(['underscore'],function(_){return function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="pure-menu"> <dl class="pure-menu-list"> <dt class="library-title pure-menu-item library-title-grid"> <i class="fa fa-plus"></i> <i class="fa fa-question-circle"></i> <span>布局设置</span> </dt> <dd class="library-content library-grid-content"> ';

          var grids = [{key:'v_12_12', val:'12 12'},{key:'v_8_8_8_8', val:'8 8 8'},{key:'v_6_6_6_6',val:'6 6 6 6'},{key:'v_1',val:'1'}];
        
__p+=' ';
 _.each(grids, function(grid, key){ 
__p+=' <div class="css3_tool_item_demo ui-draggable" data-val="'+
((__t=(grid.key))==null?'':__t)+
'"> <a href="javascript:;" class="del pure-button button-error"><i class="fa fa-times"></i>删除</a> <span class="drag pure-button"> <i class="fa fa-arrows"></i>拖动 </span> <div class="preview"> <input value="'+
((__t=(grid.val))==null?'':__t)+
'" type="text"> </div> <div class="views"> <div class="pure-u-g Lcfx"> ';

                        var arr = grid.val.split(/\s/);
                        _.each(arr, function(num){ 
__p+=' <div class="ui-sortable pure-grids Lfll pure-u-'+
((__t=(num))==null?'':__t)+
'-24"></div> ';
 })
                    
__p+=' </div> </div> </div> ';
 }) 
__p+=' </dd> <dt class="library-title pure-menu-item library-title-box"> <i class="fa fa-plus"></i> <i class="fa fa-question-circle"></i> <span>基本css</span> </dt> <dd class="library-content library-box-content"> <div class="css3_tool_item_demo ui-draggable"> <a href="javascript:;" class="del pure-button button-error"><i class="fa fa-times"></i>删除</a> <span class="drag pure-button"> <i class="fa fa-arrows"></i>拖动 </span> <div class="preview"> 按钮 </div> <div class="views"> <a href="javascript:;" class="pure-button">按钮</a> </div> </div> </dd> </dl> </div> ';
}
return __p;
}});