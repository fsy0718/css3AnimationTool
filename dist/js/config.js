(function(win,d){
  "use strict";
  var app = win.app;
  var lib = './dist/lib';
  //pure
  d.define('pure',{
    path: lib + '/pure/pure-min.css',
    type: 'css'
  });
  //font-awesome
  d.define('font',{
    path: lib + '/font-awesome/css/font-awesome.min.css',
    type: 'css'
  })
  //jquery
  d.define('jquery',{
    path: lib + '/jquery/jquery-3.0.0.js',
    type: 'js'
  });
  //layer
  d.define('layer', {
    path: lib + '/layer/layer.js',
    type: 'js'
  })

  //underscore
  d.define('underscore',{
    path: lib + '/underscore/underscore-min.js',
    type: 'js'
  });


  var js = './dist/js';
  //js
  d.define('canvas',{
    path: js + '/canvas.js',
    type: 'js',
    requires: ['underscore','tpl_addElement','layer']
  });
  d.define('header', {
    path: js + '/header.js',
    type: 'js',
    requires: ['check-data']
  })
  d.define('check-data', {
    path: js + '/check-data.js',
    type: 'js'
  })
  d.define('style', {
    path: js + '/style.js',
    type: 'js'
  })

  //template
  var tpl = './dist/template';
  d.define('tpl_addElement', {
    path: tpl + '/addElement.js',
    type: 'js'
  });

  Do.setConfig('coreLib',['pure', 'font', 'jquery']);

})(window,Do)