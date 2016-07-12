define(['tpl/library.pure'],function(tplPure){
    var pure = {
        init: function(){
            console.log(1);
        },
        tpl: function(opts){
          opts = opts || {};
          return tplPure();
        }
    };
    return pure;
})
