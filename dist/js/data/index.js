define(['identifier', 'css', 'module'],function(Identifier, Css, module){
  var debug = module.config().debug;
  //缓存当前编辑的元素信息
  var currentArgs = {};
  var cached = {};
  var innerKeyReg = /^@__(.+)__@$/;
  var validKeys = ['css', 'classNames', 'html', 'curIdx', 'identifier', 'animationName', '@__css__@', '@__change__@']
  var setCached = function(obj, key, val){
    if(typeof key === 'object'){
        for(var i in key){
            if(key.hasOwnProperty(i)){
                setCached(obj, i, key[i]);
            }
        }
    }else{
        if(validKeys.indexOf(key) > -1){
            if(key === 'classNames'){
                if(val){
                    if(obj[key]){
                        obj[key].push(val);
                    }else{
                        obj[key] = [val];
                    }
                }
            }else if(val !== undefined || val !== null){
                obj[key] = val;
            }else{
                delete obj[key];
            }
            var _r = innerKeyReg.exec(key);
            if(_r && _r[1] === 'css'){
                delete cached['@__change__@'];
            }else{
                cached['@__change__@'] = 1;
            }
        }
    }
  }

  var data = {
    identifier: new Identifier(),
    css: new Css(),
    setCurrentArgs: function(index, ele){
      currentArgs.index = index;
      currentArgs.$el = ele;
      return currentArgs;
    },
    getCurrentArgs: function(){
      return currentArgs;
    },
    delCurrentArgs: function(){
        if(debug){
            data.currentArgs = {};
        }
        return currentArgs = {};
    },
    setCached: function(namespace, key, val){
      if(!cached[namespace]){
        cached[namespace] = {};
      }
      setCached(cached[namespace], key, val);
    },
    getCached: function(namespace, key){
        if(!namespace){
            return cached;
        }else if(cached[namespace]){
            return key ? cached[namespace][key] : cached[namespace];
        }
        return null;
    },
    delCached: function(namespace, key, val){
      if(!namespace){
          cached = {};
      }else if(cached[namespace]){
          if(key === 'classNames'){
            var _classNames = cached[namespace].classNames;
            if(_classNames){
                if(val){
                    var _idx = _classNames.indexOf(val);
                    if(_idx > -1){
                        _classNames.splice(_idx, 1);
                    }
                }else{
                    _classNames = null;
                    delete cached[namespace].classNames;
                }

            }
          }
          else if(key){
            cached[namespace][key] = null
            delete cached[namespace][key]
          }
          else{
            cached[namespace] = null;
            delete cached[namespace];
          }
      }
      return true;
    }

  };
  if(debug){
    data.currentArgs = currentArgs;
    data.cached = cached;
    if(!window.__app__){
      window.__app__ = {};
    }
    window.__app__.data = data;
  }
  return data;
})
