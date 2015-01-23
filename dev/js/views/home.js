(function(win, doc, PoT){

  /**
   * HomeView
   * @type Backbone.View
   */
  PoT.Views.HomeView = Backbone.View.extend({

    el: '#PoTContainer',

    initialize: function() {},

    render:function(){

    this.$el.append('<div>Home page</div>');

    return this;
    }
    });

})(window, window.document, window.PoT || (window.PoT = {}));
