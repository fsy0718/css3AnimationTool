"use strict";

define(['event','data', 'shortid'],function(event, data, shortid){
  var iden = data.identifier;
  var randomGenerated = function(i){
    if(i){
      if(iden.hasIdentifier(i)){
        return i + shortid.gen();
      }else{
        return i;
      }
    }else{
      return 'css3-tool-iden-' + shortid.gen();
    }
  };

  var getIdentifierName = function(i){
    return randomGenerated(i);
  };
  var getIdentifier = function(i){
    var _n = getIdentifierName(i);
    return iden.addIdentifier(_n);
  };

  var addIdentifierCache = function(){
    return data.setCached.apply(data, arguments);
  }


  var _event = {
    getIdentifier: getIdentifier,
    getIdentifierName: getIdentifierName,
    addIdentifierCache: addIdentifierCache
  };
  return _event;

})
