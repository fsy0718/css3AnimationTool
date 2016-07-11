define(['library/pure/index'],function(pure){
  var $library = $('.library');
  var getLibraryHtml = function(obj, name){
      return '<li data-library="' + name + '">' + obj.init() + '</li>';
  }
  var _pure = getLibraryHtml(pure);
  $library.append(_pure);
})
