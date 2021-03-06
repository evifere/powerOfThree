
(function(win, doc, PoT){

    PoT.AppRouter = Backbone.Router.extend({
     routes: {
      '': 'home',
      'game/:difficulty': 'game',
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
    before: function() {
        /*if(_.isUndefined(PoT.Views.Instances.HomeView)){
            this.home();
        }*/
    },

    /**
     * Used after every action
     * @return {void}
     */
    after: function() {},

    home: function() {
      this.before();

      PoT.Views.Instances.HomeView = new PoT.Views.HomeView();
      PoT.Views.Instances.HomeView.render();

      this.after();
        },
    game: function(difficulty) {
      this.before();

      PoT.Views.Instances.GameView = new PoT.Views.GameView({'difficulty':difficulty});
      PoT.Views.Instances.GameView.render();

      this.after();
        },

    redirect404:function(){
        console.warn('the requested route is unknown back to home');
        this.home();
        }

    });

})(window, window.document, window.PoT || (window.PoT = {}));