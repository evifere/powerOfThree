
(function(win, doc, PoT){

    PoT.AppRouter = Backbone.Router.extend({
     routes: {
      '': 'home',
      'game': 'game',
      '*path': 'redirect404' // ALWAYS MUST BE THE LAST ROUTE
        },

        /**
     * Router init
     * @return {void}
     */
    initialize: function() {},

    /**
     * Used before every action
     * @return {void}
     */
    before: function() {},

    /**
     * Used after every action
     * @return {void}
     */
    after: function() {},

    game: function() {
      this.before();

      PoT.Views.Instances.GameView = new PoT.Views.GameView();
      PoT.Views.Instances.GameView.render();

      this.after();
        },

    redirect404:function(){
        console.warn('the requested route is unknown back to home');
        this.home();
        }

    });

})(window, window.document, window.PoT || (window.PoT = {}));