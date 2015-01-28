(function(win, doc, PoT){

PoT.Models.Dice = Backbone.Model.extend({

    defaults: {
        x:0,
        y:0,
        z:0,
        value:-1,
        mesh:null
        },


          //overriding set
     validate : function(attributes, options) {

        if(!(this.collection.minCoord <= attributes[PoT.X_AXIS] &&  attributes[PoT.X_AXIS] <= this.collection.maxCoord))
            return 'X Out of range (' + this.collection.minCoord + ',' + this.collection.maxCoord+')';

        if(!(this.collection.minCoord <= attributes[PoT.Y_AXIS] &&  attributes[PoT.Y_AXIS] <= this.collection.maxCoord))
            return 'Y Out of range (' + this.collection.minCoord + ',' + this.collection.maxCoord+')';

        if(!(this.collection.minCoord <= attributes[PoT.Z_AXIS] &&  attributes[PoT.Z_AXIS] <= this.collection.maxCoord))
            return 'Z Out of range (' + this.collection.minCoord + ',' + this.collection.maxCoord+')';

        return '';
     }
});

PoT.Collections.Dices = Backbone.Collection.extend({
  model: PoT.Models.Dice,

  maxDices:0,
  initialize:function(options)
  {
    this.maxDices = options.maxDices;
    this.minCoord = options.minCoord;
    this.maxCoord = options.maxCoord;
  },

  initWithRandomDice:function(nbOfDice){

    for(d = 0;d < nbOfDice;d++){
        var randomDice = new PoT.Models.Dice({
            x:_.random(this.minCoord,this.maxCoord),
            y:_.random(this.minCoord,this.maxCoord),
            z:_.random(this.minCoord,this.maxCoord),
            value:_.random(1,2)
        });

    if(this.length ===  this.maxDices )
        {
        console.log('You loose T.T');
        return false;
        }

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
    return this.initWithRandomDice(1);
  },
  isSpotOccupied:function(model){
    var newSpotCoords = model.pick(PoT.X_AXIS,PoT.Y_AXIS,PoT.Z_AXIS);

    return !_.isUndefined(this.findWhere(newSpotCoords));
  }
});

})(window, window.document, window.PoT || (window.PoT = {}));