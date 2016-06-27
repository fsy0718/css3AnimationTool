(function(win,undefined){
  var doc = document.body.ownerDocument;
  var body = document.body;
  var reg = /^\s*([\.|#])?([^\d].+)/;
  var selectorTypes = ['tag', 'class', 'id'];
  var parseSelector = function(selector){
    var matches = reg.exec(selector);
    var type = matches[1] === '.' ? 1 : matches[1] === '#' ? 2 : 0;
    return {
      type: type,
      selector: matches[2],
      typeStr: selectorTypes[type]
    }
  }
  win.HTMLElement.prototype.hasClass = function(className){
    if(className){
      return this.classList.contains(className);
    }
    return false;
  };
  win.HTMLElement.prototype.addClass = function(className){
    if(!this.hasClass(className)){
      this.classList.add(className);
    }
    return this;
  }
  win.HTMLElement.prototype.removeClass = function(className){
    this.classList.remove(className);
    return this;
  }
  win.HTMLElement.prototype.parents = function(selector){
    if(selector){
      selector = parseSelector(selector);
      var validFn;
      if(selector.type === 0){
        validFn = function(node){
          return node.tagName.toLowerCase() === selector.selector;
        }
      }
      else if(selector.type === 1){
        validFn = function(node){
          return node.hasClass(selector.selector);
        }
      }else{
        validFn = function(node){
          return node.id = selector.id;
        }
      }
      var parent = this.parentNode;
      while(parent){
        if(validFn(parent)){
          return parent;
        }else{
          parent = parent.parentNode;
        }
      }
    }
    return body;
  }
})(window)
