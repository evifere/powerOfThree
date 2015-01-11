(function(win, doc, PoT){

PoT.Models.Dice = Backbone.Model.extend({

    defaults: {
        x:0,
        y:0,
        z:0,
        value:-1,
        mesh:null
        }
});

PoT.Collections.Dices = Backbone.Collection.extend({
  model: PoT.Models.Dice,

  initWithRandomDice:function(){
    var randomDice = new PoT.Models.Dice({x:_.random(-2,1),y:_.random(-2,1),z:_.random(-2,1)});
    this.add(randomDice);
  }
});

})(window, window.document, window.PoT || (window.PoT = {}));