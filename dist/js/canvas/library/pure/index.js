define(['tpl/library.pure', 'library/event'],  function(tplPure, event) {
  var views = {
    reg: /(?!_)(\d+)/,
    get: function(val, $context) {
      if (!this[val]) {
        var s = this.parseViews(val);
        this[val] = '<div class="views">' + s + '</div>';
      }
      return this[val]
    },
    parseViews: function(val) {
      var _val = val.match(this.reg);
      var result = '<div class="pure-u-g">';
      if (_val && _val.length) {
        _val.forEach(function(_v, idx) {
          result += '<div class="ui-sortable pure-grids pure-u-' + _v + '-24"></div>';
        });
      }
      result += '<div>';
      return result;
    }
  };

  var i = 0;

  var addCss3Key = function(item){
    if(!item.data('@__css3_key__@')){
      item.data('@__css3_key__@', 'true');
      var items = item.find('.J__contextmenu-item');
      items.each(function(index, dom){
        var iden = event.getIdentifier();
        event.addIdentifierCache(iden.index, 'identifier', iden.identifier);
        $(this).addClass(iden.identifier).data('@__css3_iden__@', iden.index);
      });

    }
  }
  var initEvent = function($pure, $el) {
    var $grids = $pure.find('.library-grid-content .css3_tool_item_demo');
    var $items = $pure.find('.library-box-content .css3_tool_item_demo');
    var self = this;
    $grids.draggable({
      connectToSortable: '#canvas',
      helper: 'clone',
      handle: '.drag',
      start: function(e, ui) {
      },
      drag: function(e, ui) {
        ui.helper.width(400);
      },
      stop: function(e, ui) {
        $('#canvas .pure-grids').sortable({
          opacity: .35,
          connectWith: '.pure-grids',
          start: function(_e, _ui) {
            console.log(1);
          },
          stop: function(_e, _ui){
            addCss3Key(_ui.item);
          }
        });
      }
    });
    $items.draggable({
      connectToSortable: '.pure-grids',
      helper: 'clone',
      handle: '.drag',
      drag: function(e, ui) {
        ui.helper.width(400);
      }
    });
    $('#canvas, #canvas .pure-grids').sortable({
      connectWith: '.pure-grids',
      opacity: .35,
      handle: '.drag',
      stop: function(e, t) {
        //为当前元素添加惟一标识符
        addCss3Key(t.item);
      },
    })
  };

  var pure = {
    init: function($pure, $el, opts) {
      this.initEvent($pure, $el, opts);
    },
    tpl: function(opts) {
      opts = opts || {};
      return tplPure();
    },
    initEvent: function($pure, $el) {
      initEvent.apply(this, arguments);
    }
  };
  return pure;
})
