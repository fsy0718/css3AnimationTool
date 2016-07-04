(function(win){
  "use strict";
  var _a = win.app;
  var c = _a.canvas = {};
  var _t = _a.tpl;
  var canvas = $('#canvas');
  var defaultAddEleString = _t.addElement({});

  c.addElement = function(){
    layer.alert(defaultAddEleString,{
      title: '添加元素'
    });
  }



  canvas.on('contextmenu', function(e){
    e.preventDefault();
    e.stopPropagation();
    var $target = $(e.target);
    c.addElement();
  })


  c.$el = canvas;


})(window)
