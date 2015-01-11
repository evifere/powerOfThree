(function(win, doc, PoT){

    win.tpl = function(view) {
      return _.template(doc.getElementById(view + '-viewtpl').innerHTML);
    };

    win.jsonData = function(name) {
      try{
      return doc.querySelector("[data-path='" +name + ".json']").getAttribute('src');
        }
      catch(e){
      console.error(e);
      console.log('Error on loading jsonData '+name+".json");
      }
    };

    PoT.Models = {};
    PoT.Models.Instances = {};
    PoT.Collections = {};
    PoT.Collections.Instances = {};
    PoT.Views = {};
    PoT.Views.Instances = {};
    PoT.AppRouter = {};
    PoT.AppRouter.Instance = {};
    PoT.Events = {};
    PoT.version = "0.0.5";



})(window, window.document, window.PoT || (window.PoT = {}));