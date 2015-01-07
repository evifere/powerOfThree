$(document).ready(function(){
// Initiate the router
PoT.AppRouter.Instance = new PoT.AppRouter;
// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();

});