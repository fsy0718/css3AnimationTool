(function(win){
  var defaultVal = {

  }
  var helpCssProps = {
    defaultVal: {
      'transform-origin': {
        x: '50%',
        y: '50%'
      },
      matrix: {
        a: 1,
        b: 0,
        c: 1,
        d: 0,
        e: 0,
        f: 0
      }
    },
    onOrderKey: ['transform'],
    orderKey: {
      diy: ['transform'],
      fix: {
        matrix : ['a','b','c','d','e','f']
      }
    }
  }

  var cssParse = {
    matrix: function(val){
      var result = helpCssProps.orderKey.fix.matrix.map(function(a){
        return val[a];
      });
      return 'matrix(' + result.join(',') + ')';
    },
    default: function(val,key){
      //解决origin相关的
      if(/\-origin/.test(key)){
        return key + ':' + val.x + ' ' + val.y;
      }
    }
  }

  var StyleFn = function(){
    this.styles = {};
  };
  StyleFn.cssParse = cssParse;
  StyleFn.helpCssProps = helpCssProps;

  StyleFn.prototype = {
    //增加style
    addCss: function(namespace,key, val, parent, origin){
      if(!namespace){
        throw Error('需要namespace');
        return;
      }
      if(!this.styles[namespace]){
        this.styles[namespace] = {};
      }
      var source = this.styles[namespace];
      //获取添加的对象
      var target = this.getStyleTarget(source, origin, parent);
      //如果origin需要记录顺序
      if(this.shouldOnOrder(origin)){
        //如果parent存在，则记录parent的顺序，否则记录本身的顺序,比如布matrix中a的值，需要记录matrix的顺序
        var name = parent ? parent : key;
        var index = source[origin].__index
        if(!index){
          source[origin].__index = [name]
        }else{
          index.indexOf(name) === -1 ? index.push(name) : null;
        }
      }
      target[key] = val;
    },
    shouldOnOrder: function(key){
      return StyleFn.helpCssProps.orderKey.diy.indexOf(key) !== -1;
    },
    getStyleTarget: function(source, origin, parent){
      var target = source;
      if(origin){
        if(!target[origin]){
          target[origin] = {};
        }
        target = target[origin];
      }
      if(parent){
        if(!target[parent]){
          target[parent] = {};
        }
        target = target[parent];
      }
      return target;
    },
    getStyleObjByNamespace: function(namespace){
      return this.styles[namespace] || null;
    },
    parseStyleObj: function(obj){
      var result = [];
        for(var cssKey in obj){
          var cssVal = obj[cssKey];
          if(cssVal && typeof cssVal !== 'object'){
            result.push(cssKey + ':' + cssVal);
          }else{
            if(cssVal.__index){
              var cssString = cssKey + ':';
              cssVal.__index.forEach(function(key,index){
                if(cssVal[key] && typeof cssVal[key] !== 'object'){
                  cssString += ' ' + key + '(' + cssVal[key] + ')'
                }else{
                  if(StyleFn.helpCssProps.defaultVal[key]){
                    var _val = Object.assign({}, StyleFn.helpCssProps.defaultVal[key], cssVal[key]);
                  }
                  var _cssString = (StyleFn.cssParse[key] || StyleFn.cssParse.default)(_val,key)
                  _cssString ? cssString += ' ' + _cssString : null;
                }
              })
              result.push(cssString);
            }else{
              if(StyleFn.helpCssProps.defaultVal[cssKey]){
                var _val = Object.assign({}, StyleFn.helpCssProps.defaultVal[cssKey], cssVal);
              }
              var _cssString = StyleFn.cssParse[cssKey] || StyleFn.cssParse.default(_val, cssKey)
              _cssString && result.push(_cssString);
            }
          }
        }
        return result.join(';\n') + ';\n';
    },
    getCssObjByNamespace: function(namespace){
      var styleObj = this.getStyleObjByNamespace(namespace);
      if(styleObj){
        this.parseStyleObj(styleObj);
      }else{
        return undefined;
      }
    }
  }
  win.StyleFn = StyleFn;

})(window)
