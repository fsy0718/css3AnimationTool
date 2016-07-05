define(function() {
  //TODO  用es5将这些属性隐藏起来
  var classNames = {};
  var uniques = {};
  var shortId = function() {
    return Date.now();
  }
  var data = {
    hasClassName: function(className) {
      return classNames[className] !== undefined;
    },
    addElement: function(className, type) {
      if (!data.hasClassName(className)) {
        var _i = shortId();
        classNames[className] = _i;
        uniques[_i] = {
          className: className,
          type: type,
          key: _i
        }
        return uniques[_i];
      }
      return null;
    },
    updateElement: function(key, className) {
      if (data.hasClassName(className)) {
        return null;
      }
      //获取旧的信息
      var oldInfo = data.getElementByKey(key);
      if (oldInfo) {
        delete classNames[oldInfo.className];
        classNames[className] = key;
        oldInfo.className = className;
        return oldInfo;
      } else {
        return null;
      }
    },
    getElementByClassName: function(className) {
      var key = classNames[className]
      if (key) {
        return data.getElementByKey(key);
      }
    },
    getElementByKey: function(key) {
      return uniques[key];
    }
  };
  return data;

})
