(function(win, doc, PoT){

  /**
   * HomeView
   * @type Backbone.View
   */
  PoT.Views.HomeView = Backbone.View.extend({

    el: '#PoTContainer',

    template: tpl('home'),

    events:{
        'click #start_game':'startGame'
    },

    startGame:function(){
        PoT.AppRouter.Instance.navigate('game', true);
    },

    initialize: function() {},

    render:function(){

    this.$el.html(this.template);
      //this.$('#start').button();

    return this;
    }
    });

})(window, window.document, window.PoT || (window.PoT = {}));
