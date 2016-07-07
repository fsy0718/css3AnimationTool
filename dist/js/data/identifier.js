define(function(){
  var shortId = function(){
    return 'fsy_' + Date.now()
  }
  var Identifier = function(){
    this.identifiers = {};
    this.indexs = {};
  };

  Identifier.prototype = {
    hasIdentifier: function(id){
      return this.identifiers[id] !== undefined;
    },
    addIdentifier: function(id, type) {
      if (!this.hasIdentifier(id)) {
        var _i = shortId();
        this.identifiers[id] = _i;
        this.indexs[_i] = {
          identifier: id,
          index: _i,
          type: type
        }
        return this.indexs[_i];
      }
      return null;
    },
    updateIdentifier: function(index, identifier) {
      if (this.hasIdentifier(identifier)) {
        return null;
      }
      //获取旧的信息
      var oldInfo = this.getItemByIndex(index);
      if (oldInfo) {
        delete this.identifiers[oldInfo.identifier]
        this.identifiers[identifier] = index;
        oldInfo.identifier = identifier;
        return oldInfo;
      } else {
        return null;
      }
    },
    getItemByIdentifier: function(identifier) {
      var index = this.identifiers[identifier]
      if (index) {
        return this.getItemByIndex(index);
      }
    },
    getItemByIndex: function(index) {
      return this.indexs[index];
    },
    delItem: function(index){
        var indexInfo = this.indexs[index];
        if(indexInfo){
            var identifier = indexInfo.identifier;
            indexInfo = null;
            delete this.indexs[index];
            delete this.identifiers[identifier];
            return true;
        }
        return false;
    }
  }

  return Identifier;
})
