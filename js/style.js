//TODO 做缓存
(function(win) {
  var numLikeReg = /^[-+]?(\d+|)(\.\d+)?$/;
  var cssHelp = {
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
        matrix: ['a', 'b', 'c', 'd', 'e', 'f']
      }
    },
    cssUnits: {
      'transform-origin-x': '%',
      'transform-origin-y': '%',
      rotate: 'deg',
      rotateX: 'deg',
      rotateY: 'deg',
      rotateZ: 'deg',
      translate: 'px',
      translateX: 'px',
      translateY: 'px',
      translateZ: 'px',
      skew: 'deg',
      skewX: 'deg',
      skewY: 'deg',
      skewZ: 'deg',
      perspective: 'px',
      'transition-duration': 's',
      'transition-delay': 's',
      'animation-delay': 's'
    }
  }

  var cssParse = {
    matrix: function(val) {
      var result = cssHelp.orderKey.fix.matrix.map(function(a) {
        return val[a];
      });
      return 'matrix(' + result.join(',') + ')';
    },
    //单位由StyleFn解决
    transform: function(val, key) {
      //此处只处理transform中除matrix的属性
      return key + '(' + val + ')';
    },
    default: function(val, key) {
      //解决origin相关的
      if (/\-origin/.test(key)) {
        return val.x + ' ' + val.y;
      }
    }
  }

  var StyleFn = function() {
    this.styles = {};
  };
  StyleFn.cssParse = cssParse;
  StyleFn.cssHelp = cssHelp;

  var Cache = function() {
    this.caches = {};
    return this;
  };
  Cache.prototype = {
    updateKey: function(key, namespace, isAdd) {
      if (!this.caches[namespace]) {
        this.caches[namespace] = {
          __hasChanged: [key]
        }
      }
      if (this.caches[namespace]){
        var list = this.caches[namespace].__hasChanged;
        var idx = list.indexOf(key);
        var has = idx !== -1;
        if(isAdd && !has){
          list.push(key);
        }
        if(!isAdd && has){
          list.splice(idx, 1);
        }
      }
      return this;
    },
    hasChange: function(key, namespace) {
      if(!this.caches[namespace]){
        return false;
      }
      var list = this.caches[namespace].__hasChanged;
      if(!key){
        return list.length !== 0
      }
      var idx = list.indexOf(key);
      return idx !== -1;
    },
    addChange: function(key, namespace) {
      this.updateKey(key, namespace, true)
    },
    removeChange: function(key, namespace) {
      this.updateKey(key, namespace, false);
    },
    add: function(key, namespace, value) {
      if (!this.caches[namespace]) {
        this.addChange(key, namespace)
      }
      this.caches[namespace][key] = value;
    },
    get: function(key, namespace) {
      if (this.caches[namespace]) {
        return key ? this.caches[namespace][key] : this.caches[namespace];
      }
      return null;
    },
    restore: function() {
      this.caches = {};
    },
    destroy: function(key, namespace) {
      if (!namespace) {
        this.restore();
      } else if (this.caches[namespace]) {
        this.caches[namespace] = {};
      }
      return this;
    }
  };

  var caches = new Cache();

  StyleFn.prototype = {
    /**
     * 添加css规则，如果符合样式有前后顺序之分的，会自动记录parent或key在origin顺序
     * @todo val 支持Object格式
     * @param {String} namespace 样式规则空间
     * @param {String} key       css属性名
     * @param {String} val       css属性值
     * @param {String} [parent]    css属性父属性
     * @param {String} [origin]    css属性属于哪个css属性
     * @example
     * //描述修改或新增transform下matrix中的a的值为0,值为{'#header':{transform:{matrix:{a:1},__index: ['matrix']}}}
     * addCss('#header','a','0','matrix','transform')
     */
    addCss: function(namespace, key, val, parent, origin) {
      if (!namespace) {
        throw Error('需要namespace');
        return;
      }
      var isDel = val === null;
      if (!this.styles[namespace]) {
        this.styles[namespace] = {};
      }
      var source = this.styles[namespace];
      //获取添加的对象
      var target = this.getCssTarget(source, origin, parent);
      //如果origin需要记录顺序
      if (this.shouldOnOrder(origin)) {
        //如果parent存在，则记录parent的顺序，否则记录本身的顺序,比如布matrix中a的值，需要记录matrix的顺序
        var name = parent ? parent : key;
        var index = source[origin].__index;
        if (!index && !isDel) {
          source[origin].__index = [name]
        } else{
          var idx = index.indexOf(name);
          if(isDel){
            idx !== -1 ? index.splice(idx,1) : null;
          }else{
            idx === -1 ? index.push(name) : null;
          }
        }
      }
      if(isDel){
        if(key){
          delete target[key]
        }else if(parent){
          origin ? delete source[origin][parent] : source[parent];
        }else if(origin){
          delete source[origin];
        }

      }else{
        target[key] = this.parseCssVal(val, key, parent);
      }

      var cacheName = origin || parent || key;
      //更新缓存
      caches.addChange(cacheName, namespace)
      return source;
    },

    /**
     * 解析css规则属性值，加单位
     * @param  {String} val    属性值
     * @param  {String} key    css属性名
     * @param  {String} [parent] css规则属性父属性
     * @return {String}
     */
    parseCssVal: function(val, key, parent) {
      var unit = StyleFn.cssHelp.cssUnits[key] || '';
      if (parent) {
        unit = StyleFn.cssHelp.cssUnits[parent + '-' + key] || ''
      };
      val += unit;
      if (numLikeReg.test(val)) {
        val = +val;
      }
      return val;

    },
    /**
     * 删除指定样式规则
     * @param  {String} [namespace] css规则空间，如果未有namespace，则删除全部
     * @param  {String} key       css规则属性名
     * @param  {String} parent    css规则属性父属性名
     * @param  {String} origin    css规则属性顶层属性名
     * @return {Boolean}           是否删除成功
     */
    delCss: function(namespace, key, parent, origin) {
      return this.addCss(namespace, key, null, parent, origin);
    },
    /**
     * 是否需要关注属性的顺序
     * @param  {String} key css规则属性名
     * @return {Boolean}
     * @example
     * // transform的规则效果与规则的前后顺序有关
     * @return true  有关
     * shouldOnOrder('transform')
     * @return false 无关
     * shouldOnOrder('width')
     */
    shouldOnOrder: function(key) {
      return StyleFn.cssHelp.orderKey.diy.indexOf(key) !== -1;
    },
    /**
     * 获取css属性设置的对象
     * @param  {Object} source css规则空间对象
     * @param  {String} [origin] css属性顶层属性名
     * @param  {String} [parent] css属性父属性名
     * @return {Object}
     */
    getCssTarget: function(source, origin, parent) {
      var target = source;
      if (origin) {
        if (!target[origin]) {
          target[origin] = {};
        }
        target = target[origin];
      }
      if (parent) {
        if (!target[parent]) {
          target[parent] = {};
        }
        target = target[parent];
      }
      return target;
    },
    /**
     * 获取css规则对象，为最原始的数据
     * @param  {String} namespace css规则空间对象
     * @return {(Object|null)}
     */
    getCssObjByNamespace: function(namespace) {
      return this.styles[namespace] || null;
    },
    parseStyleObj: function(k,v) {
      var result = '';
      if (v && typeof v !== 'object') {
        //result.push(k + ':' + v);
        result = v;
      } else {
        //如果有顺序
        if (v.__index) {
          var _result = [];
          //var cssString = k + ':';
          v.__index.forEach(function(key, index) {
            var _val = v[key]
            if (_val && typeof _val === 'object' && StyleFn.cssHelp.defaultVal[key]) {
              var _val = Object.assign({}, StyleFn.cssHelp.defaultVal[key], _val);
            }
            //解析函数调用顺序为当前属性名，顶级属性名，默认属性名
            var _c = (StyleFn.cssParse[key] || StyleFn.cssParse[k] || StyleFn.cssParse.default)(_val, key)
            _c && _result.push(_c);
          })
          result = _result.join(' ');
        } else {
          if (StyleFn.cssHelp.defaultVal[k]) {
            var _val = Object.assign({}, StyleFn.cssHelp.defaultVal[k], v);
          }
          var _c = (StyleFn.cssParse[k] || StyleFn.cssParse.default)(_val, k)
          _c ? result = _c : null;
        }
      }
      return result;
    },
    /**
     * 获取指定空间下的css规则对象
     * @param  {String} namespace css规则空间
     * @return {Object}
     */
    getStyleObjByNamespace: function(namespace) {
      var result = {};
      var obj = this.getCssObjByNamespace(namespace);
      if (obj) {
        for (var k in obj) {
          if (caches.hasChange(k, namespace)) {
            result[k] = this.parseStyleObj(k, obj[k]);
            caches.removeChange(k, namespace);
            caches.add(k, namespace, result[k]);
          } else {
            result[k] = caches.get(k, namespace);
          }
        }
      }
      //return result.join(';\n') + ';\n';
      return result;
    },

    getStyleByFilter: function(namespace, name, parent, origin){
      var styleObj = this.getStyleObjByNamespace(namespace);
        if(origin){
          return {name: origin, rule: styleObj[origin]};
        }
        else if(parent){
          return {name: parent, rule: styleObj[parent]};
        }else{
          return {name: name, rule: styleObj[name]};
        }
    },

    /**
     * 获取指定空间的css规则
     * @param  {String} namespace 空间
     * @return {String}
     */
    getCssByNamespace: function(namespace) {
      var val, cssString = namespace + ' {\n';
      cssString += this.getCssByNamespaceWithoutSelector(namespace);
      cssString += '}\n';
      return cssString;
    },
    /**
     * 获取指定空间的css规则，不包含选择器
     * @param {String} namespace
     * @return {String}
     */
    getCssByNamespaceWithoutSelector: function(namespace){
      var cssString = '';
      if(caches.hasChange(null, namespace)){
        val = this.getStyleObjByNamespace(namespace);
      }else{
        val = caches.get(null,namespace);
      }
      if(val){
        for(var i in val){
          cssString += i + ': ' + val[i] + ';\n';
        }
      }
      return cssString;
    }
  }
  win.StyleFn = StyleFn;

})(window)
