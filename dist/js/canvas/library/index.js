/** Javascript file
*--------------------------------------------------
*
*          Filename: d:\vos\web\css3animationtool\dist\js\canvas\library\index.js
*
*            Author: fsy0718 - fsy0718@gmail.com
*       Description: ---------- 
*            Create: 2016-07-12 10:20:06
*     Last Modified: 2016-07-12 10:20:06
*--------------------------------------------------
**/

"use strict";
define(['underscore', 'library/pure/index'], function(_, pure){
  var _lib = {
    getLibHtml: function(name, config, opts){
        return  '<li data-library="' + name + '"><h3 class="library-name">' + name + '</h3>' + config.tpl(opts) + '</li>';
    },
    lib: {}
  };
  var library = {
    $el: $('.library'),
    addLib: function(name, config){
      if(name && _.isObject(config)){
        _lib.lib[name] = config;
        return true;
      }
      return false;
    },
    loadLib: function(name, opts){
      var self = this;
      var config = _lib.lib[name];
      if(config){
          if(name && _lib.lib['@__current__@'] !== name){
              var firstLoad = true;
              var $lib;
              if(config['@__hasInited__@']){
                firstLoad = false;
                $lib = self.$el.find('.css3-tool-library-' + name).show();
              }else{
                var string = _lib.getLibHtml(name, config, opts);
                $lib = $(string).appendTo(self.$el);
                config['@__hasInited__@'] = true;
                _.isFunction(config.init) && config.init($lib, self.$el, opts);
              }
              _.isFunction(config.show) && config.show($lib, self.$el, firstLoad, opts);
          }
          return true;
      }
      return false;
    }
  };
  // 默认添加pure;
  library.addLib('pure', pure);
  library.loadLib('pure');
  return library;
});

// vim:sw=2:ts=2:sts=2:noet:fdm=marker:fdc=1
