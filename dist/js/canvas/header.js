/** Javascript file
*--------------------------------------------------
*
*          Filename: header.js
*
*            Author: fsy0718 - fsy0718@gmail.com
*       Description: ---------- 
*            Create: 2016-07-18 09:34:05
*     Last Modified: 2016-07-18 09:34:05
*--------------------------------------------------
**/
"use strict";
define(['event'], function(event){
  var $header = $('header.header');
  var $layout = $('#layout');
  //按钮
  var btnEventMaps = {
    preview: function($el){
      var isPreview = $el.data('isPreview');
      $el.data('isPreview', isPreview ? null : 'preview');
      $el.find('span').text(isPreview ? '预览' : '退出预览');
      event.trigger('preview', !isPreview);
    },
    run: function($el){
      event.trigger('runAnimation');
    }
  };
  var btnEvent = function(){
    $header.on('click','.pure-button', function(e){
      var $target = $(this);
      var action = $target.data('action')
      btnEventMaps[action] && btnEventMaps[action]($target);
    });
  };
  var header = {
    $el: $header,
    init: function(){
      var self = this;
      btnEvent();
      event.on('preview.header', function(isPreview){
        if(isPreview){
          $layout.addClass('layout--preview');
        }else{
          $layout.removeClass('layout--preview');
        }
      });
    }
  };
  return header;
});
