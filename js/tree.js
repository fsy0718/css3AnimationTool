(function(win){
  var own = Object.hasOwnProperty;
  var hasOwn = function(a,b){
    return own.call(a,b);
  }
  var Tree = function(data,options){
    if(Object.prototype.toString.call(data) !== '[object Object]'){
      this.tree = {};
    }else{
      this.tree = data;
    }
    this.options = options || {};
    this.init(this.options.dom);
    return this;
  };
  Tree.prototype = {
    getShortId: function(){
      return Date.now();
    },
    createTreeItem : function(id,name,dir,type){
      if(!id){
        id = this.getShortId();
      }
      var result =  {
        id: id,
        type: type ? type :  1,
        name: name || '默认文件' + id
      }
      dir && result.type === 1 ? result.dir = dir : null;
      return result;
    },
    createTreeDom: function(){
      var dom = document.createElement('ul');
      dom.className = 'tree tree-' + this.getShortId();
      return dom;
    },
    createTreeItemEle: function(tree){
      var ele = document.createElement('li');
      ele.className = 'tree-item-box';
      ele.dataset.treeId = tree.id;
      ele.innerHTML = '<div class="tree-item"><span>' + tree.name + '</span></div>';
      return ele;
    },
    init: function(dom){
      var treeBox = this.createTreeDom();
      if(!dom){
        dom = document.body;
      }
      dom.appendChild(treeBox);
      this.dom = treeBox;
      this.bindEvent();
      return this;
    },
    getTreeItem: function(id){
      if(!id){
        return null;
      }else{

        var tree = this.tree[id];
        //目录
        if(tree.type === 2){
          if(this.__cacheTree){
            this.__cacheTree = {};
          }
          if(this.__cacheTree[id]){
            return this.__cacheTree[id];
          }else{
            var _tree = {id: id, childs: []};
            for(var i in this.tree){
              if(hasOwn(this.tree, i)){
                var val = this.tree[i];
                if(val.type === 1 && val.dir === id){
                  _tree.childs.push({
                    id: val.id,
                    name: val.name
                  });
                }
              }
            };
            this.__cacheTree = _tree;
            return _tree;
          }
        }else{
          return {
            id: id,
            name: tree.name
          };
        }
      }
    },
    contextmenuHandler: function(e){
      e.preventDefault();
      var target = e.target;
      if(!target.hasClass('tree-item-box')){
        target = target.parents('.tree-item-box');
      }
      var id = target.dataset.treeId;
      var data = this.getTreeItem(id);
      if(data){
        this.options.contextmenuFn.call(this, e, target, data)
      }
    },
    addTreeItem: function(name,dir){
      var tree = this.createTreeItem(null,name,dir,1);
      this.tree[tree.id] = tree;
      if(this.__cacheTree && dir && this.__cacheTree[dir]){
        this.__cacheTree[dir].childs.push({
          id: tree.id,
          name: tree.name
        })
      };
      var $tree = this.createTreeItemEle(tree);
      this.dom.appendChild($tree);
      return tree;
    },
    addTreeDir: function(name){
      var dir = this.createTreeItem(null,name,null,2);
      return dir;
    },
    bindEvent : function(){
      var self = this;
      if(self.options.contextmenuFn){
        this.dom.addEventListener('contextmenu', self.contextmenuHandler.bind(self), false);
      }
    }
  }
  win.Tree = Tree;
})(window)
