(function(win, doc, PoT){

  /**
   * HomeView
   * @type Backbone.View
   */
  PoT.Views.HomeView = Backbone.View.extend({

    el: '#PoTContainer',

    template: tpl('home'),

    events:{
        'click .start_game':'startGame'
    },

    startGame:function(e){
        PoT.AppRouter.Instance.navigate('game/'+ $(e.target).data('difficulty'), true);
    },

    initialize: function() {},

    render:function(){

    this.$el.html(this.template);

    return this;
    }
    });

})(window, window.document, window.PoT || (window.PoT = {}));
