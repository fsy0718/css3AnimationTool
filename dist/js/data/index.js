define(['identifier', 'style', 'module'],function(Identifier, Style, module){
  var debug = module.config().debug;

  //缓存当前编辑的元素信息
  var currentArgs = {};
  var cached = {};
  var validKeys = ['style', 'classNames', 'html', 'curIdx', 'identifier', 'animationName']
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
            }else if(val){
                obj[key] = val;
            }else{
                delete obj[key];
            }
        }
    }
  }

  var data = {
    identifier: new Identifier(),
    css: new Style(),
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
                var _idx = _classNames.indexOf(val);
                if(_idx > -1){
                    _classNames.splice(_idx, 1);
                }
            }
          }
          else if(key){
            cached[namespace][key] = null
          }
          else{
            cached[namespace] = null;
          }
      }
      return true;
    }

  };
  if(debug){
    data.currentArgs = currentArgs;
    data.cached = cached;
    window.appData = data;
    
  }
  return data;
})