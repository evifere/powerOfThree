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

  initWithRandomDice:function(nbOfDice){

    for(d = 0;d < nbOfDice;d++){
        var randomDice = new PoT.Models.Dice({
            x:_.random(-2,1),
            y:_.random(-2,1),
            z:_.random(-2,1),
            value:_.random(1,2)
        });

    //do not add a new dice on an occupied spot
    if(!this.isSpotOccupied(randomDice)){
        this.add(randomDice);
        }
    else
        {//retry
        this.addRandomDice(nbOfDice);
        }
    }
  },
  addRandomDice:function(){
    this.initWithRandomDice(1);
  },
  isSpotOccupied:function(model){
    var newSpotCoords = model.pick(PoT.X_AXIS,PoT.Y_AXIS,PoT.Z_AXIS);

    return !_.isUndefined(this.findWhere(newSpotCoords));
  }
});

})(window, window.document, window.PoT || (window.PoT = {}));