"use strict";
define(['data'], function (data) {
  var popup = {
    $operatePopup: $('#operate-popup'),
    $operate: $('#operate'),
    hide: function () {
      data.delCurrentArgs();
      this.$operatePopup.addClass('Ldn');
    },
    show: function () {
      this.$operatePopup.removeClass('Ldn');
    }
  }
  return popup;
})