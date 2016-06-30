(function(win,undefined){
  var doc = document.body.ownerDocument;
  var body = document.body;
  var reg = /^\s*([\.|#])?([^\d].+)/;
  var selectorTypes = ['tag', 'class', 'id'];
  var cache = {};
  var parseSelector = function(selector){
    var matches = reg.exec(selector);
    var type = matches[1] === '.' ? 1 : matches[1] === '#' ? 2 : 0;
    return {
      type: type,
      selector: matches[2],
      typeStr: selectorTypes[type]
    }
  }

  var wordSpaceReg = /\b\s+\b/;
  var elemdisplay = {
    'html': 'block',
    'body': 'block'
  }
  var actualDisplay = function(name){
    var dom = document.createElement(name);
    document.body.appendChild(dom);
    var display = dom.css('display');
    elemdisplay[name] = display;
    document.body.removeChild(dom);
    return display;

  }

  var showHide = function(show){
    var id = this.dataset.__index;
    if(!id){
      id = this.dataset.__index = Date.now();
    }
    if(!cache[id]){
      cache[id] = {}
    }
    var display = this.style.display;
    if(show){
      if(cache[id].olddisplay){
        display = cache[id].olddisplay;
      }else{
        display = cache[id].olddisplay = actualDisplay(this.nodeName);
      }
    }else{
      display = 'none';
    }
    this.style.display = display;
    return this;
  }
  var parseClassName = function(className){
    if(className){
      return className.split(wordSpaceReg);
    }
  }
  var hasClass = function(className,el){
    className = parseClassName(className);
    if(className){
      var c1 = [];
      var c2 = [];
      className.forEach(function(_c){
        el.classList.contains(_c) ? c1.push(_c) : c2.push(_c);
      });
      return {y: c1, n: c2};
    }
    return null;
  }

  win.SVGElement.prototype.hasClass = win.HTMLElement.prototype.hasClass = function(className){
    var result = hasClass(className, this);
    if(result && !result.n.length){
      return true;
    }
    return false;
  };
  win.SVGElement.prototype.addClass = win.HTMLElement.prototype.addClass = function(className){
    className = parseClassName(className);
    className && this.classList.add.apply(this.classList,className);
    return this;
  }
  win.SVGElement.prototype.removeClass = win.HTMLElement.prototype.removeClass = function(className){
    className = parseClassName(className);
    className && this.classList.remove.apply(this.classList,className);
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
  win.HTMLElement.prototype.show = function(){
    return showHide.call(this,true);
  }
  win.HTMLElement.prototype.hide = function(){
    return showHide.call(this);
  }
  win.SVGElement.prototype.css = win.HTMLElement.prototype.css = function(key, val){
    if(!val){
      return win.getComputedStyle(this,null)[key];
    }
    this.style[key] = val;
    return this;
  }


})(window)
