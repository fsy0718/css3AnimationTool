"use strict";

define(['event','data'],function(event, data){
  var iden = data.identifier;
  var randomGenerated = function(i){
    if(i){
      if(iden.hasIdentifier(i)){
        return i + Date.now()
      }else{
        return i;
      }
    }else{
      return 'css3-tool-iden-' + Date.now();
    }

  };

  var getIdentifierName = function(i){
    return randomGenerated(i);
  };
  var getIdentifier = function(i){
    var _n = getIdentifierName(i);
    return iden.addIdentifier(_n);
  };



  var _event = {
    getIdentifier: getIdentifier,
    getIdentifierName: getIdentifierName
  };
  return _event;

})