define(function(){
  var _events = {};
  var namespaceReg =  /^(\w+)(?:\.(\w+))?$/;
  var parseNameSpace = function(namespace){
    var namespaceArr = namespaceReg.exec(namespace);
    var namespaces = {};
    if(namespaceArr){
      namespaces.type = namespaceArr[1]
      if(namespaceArr[2]){
        namespaces.namespace = namespaceArr[2];
      }
    }
    return namespaces;
  };

  var getHandlers = function(type, namespace,concat){
    var _e = _events[type];
    if(_e){
      if(namespace){
        _e = _e[namespace];
        if(_e){
          return _e.handlers.concat();
        }else{
          return null;
        }
      }else{
        if(concat){
          var _r = (_e.handlers || []).concat();
          for(var i in _e){
            if(i !== 'handlers' && _e[i] && _e[i].handlers){
              _r = _r.concat(_e[i].handlers);
            }
          }
          return _r;
        }else{
          return (_e.handlers || []).concat();
        }
      }
    }
    return null;
  };

  var trigger = function(type, context){
    var args = [].slice.call(arguments,2);
    context = context || this;
    var namespace = parseNameSpace(type);
    if(namespace.type){
      var handlers = getHandlers(namespace.type, namespace.namespace,true);
      if(handlers){
        handlers.forEach(function(handler, index){
          handler.apply(context, args);
        });
      }
    }
  }
  var events = {
    on: function(type, handler){
      var namespace = parseNameSpace(type);
      if(namespace.type){
        if(!_events[namespace.type]){
          _events[namespace.type] = {};
        }
        if(namespace.namespace){
          if(!_events[namespace.type][namespace.namespace]){
            _events[namespace.type][namespace.namespace] = {
              handlers: []
            };
          }
          _events[namespace.type][namespace.namespace].handlers.push(handler);
        }else{
          if(!_events[namespace.type].handlers){
            _events[namespace.type].handlers = [];
          }
          _events[namespace.type].handlers.push(handler);
        }
      }

    },
    trigger: function(type){
      var args = [].slice.call(arguments,0);
      args.splice(1,0,null);
      return trigger.apply(this,args);
    },
    triggerWithContext: function(type){
      return trigger(arguments);
    },
    off: function(type, handler){
      var namespace = parseNameSpace(type);
      if(namespace.type){
        var e = _events[namespace.type];
        if(e){
          if(!namespace.namespace){
            if(!handler){
              e.handlers = null;
              delete _events[namespace.type];
            }else{
              e.handlers = e.handlers.filter(function(_handler){
                return _handler !== handler;
              })
            }
          }else{
            var _e = e[namespace.namespace];
            if(!handler){
              _e.handlers = null;
              delete e[namespace.namespace];
            }else{
              _e.handlers = _e.handlers.filter(function(_handler){
                return _handler !== handler;
              })
            }
          }
        }

      }
    }
  };
  return events;
})
