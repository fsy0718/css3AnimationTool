(function(win){
  var a = win.app;
  var d = a.data;
  //TODO  用es5将这些属性隐藏起来
  var classNames  = {};
  var uniques = {};
  var shortId = function(){
    return Date.now();
  }
  d.hasClassName = function(className){
    return classNames[className] !== undefined;
  }
  d.addElement = function(className, type){
    if(!d.hasClassName(className)){
      var _i  = shortId();
      classNames[className]  = _i;
      uniques[_i] = {
        className: className,
        type: type,
        key: _i
      }
      return uniques[_i];
    }
    return null;
  }
  d.updateElement = function(key,className){
    if(d.hasClassName(className)){
      return null;
    }
    //获取旧的信息
    var oldInfo = d.getElementByKey(key);
    if(oldInfo){
      delete classNames[oldInfo.className];
      classNames[className] = key;
      oldInfo.className = className;
      return oldInfo;
    }else{
      return null;
    }
  }
  d.getElementByClassName = function(className){
    var key = classNames[className]
    if(key){
      return d.getElementByKey(key);
    }
  }
  d.getElementByKey = function(key){
    return uniques[key];
  }
})(window)
