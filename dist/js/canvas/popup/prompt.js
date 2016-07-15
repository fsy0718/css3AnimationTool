"use strict";

define(['./popup'],function(popup){
      // 自定义提示框 {{{
  var _prompt = {
    hasInited: false,
    infos: [{title: '删除', btn: '删除', className: 'button-error'}],
    getPromptHtml: function(msg, opts){
     var  info = this.infos[opts.type || 0];
     return '<div class="css3_tool_animation_prompt"><i class="fa fa-times close" title="关闭"></i><h3 class="prompt-title pure-text-align-center">' + info.title + '</h3><div class="pure-u-1 prompt-content">' + msg + '</div><div class="pure-u-1 pure-text-align-center"><a href="javascript:;" class="pure-button prompt-ok ' + info.className + '">' + info.btn + '</a></div></div>';
    },
    show: function(msg, opts){
      this.opts = opts || {};
      if(!this.hasInited){
        this.init(msg);
        this.initEvent()
      }else{
        this.$cont.html(msg);
        var info = this.infos[opts.type || 0];
        this.$title.text(info.title);
        this.$btn.text(info.btn);
        this.$btn[0].className = 'pure-button prompt-ok ' + info.className;
        this.$el.show();
      }
      popup.show();
    },
    hide: function(){
      this.$el.hide();
      popup.hide();
    },
    init: function(msg){
      this.hasInited = true;
      var string = this.getPromptHtml(msg, this.opts);
      var $el = $(string).appendTo(popup.$operate);
      this.$el = $el;
      this.$cont = $el.find('prompt-content');
      this.$title = $el.find('.prompt-title');
      this.$btn = $el.find('.prompt-ok');
    },
    promptOkHandler: function(e){
      var before = this.opts.beforePrompt;
      var after = this.opts.afterPrompt;
      var next = true;
      if(_.isFunction(before)){
        var _next = before.call(this, e);
        _next  === false ? next = false : null;
      }
      if(next && _.isFunction(after)){
        var _next = after.call(this, e);
        _next === false ? next = false : null;
      }
      if(next){
        this.hide();
      }
    },
    initEvent: function(){
      var self = this;
      this.$el.on('click', '.prompt-ok', function(e){
        self.promptOkHandler(e);
      });
      this.$el.on('click', '.close', function(e){
        self.hide()
      })
    }

  }
  // }}}
  return _prompt;
})