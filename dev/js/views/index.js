
(function(win, doc, PoT){

    /**
    * PoT constants
    */
   PoT.LEFT_ARROW = 37,PoT.UP_ARROW = 38, PoT.RIGHT_ARROW = 39, PoT.DOWN_ARROW = 40;
   PoT.MOUSE_NO_DIRECTION = 0 ,PoT.MOUSE_UP = -1,PoT.MOUSE_DOWN = 1,PoT.MOUSE_LEFT = -2,PoT.MOUSE_RIGHT = 2 ,PoT.MOUSE_WHEEL_UP = -3, PoT.MOUSE_WHEEL_DOWN = 3;

   PoT.GO_LEFT = -0.02,PoT.GO_UP = -0.01, PoT.GO_RIGHT = -PoT.GO_LEFT, PoT.GO_DOWN = -PoT.GO_UP;
   PoT.MAIN_CUBE_WIDTH = 600;
   PoT.DICE_WIDTH = PoT.MAIN_CUBE_WIDTH/4;
   PoT.DICE_COORD_RATIO = PoT.DICE_WIDTH/2 ;
   PoT.MOUSE_THROTTLE_SENSIVITY = 600;
   PoT.REFRESH_SCENE_THROTTLE_SENSIVITY = 150;

   PoT.X_AXIS = 'x',PoT.Y_AXIS = 'y',PoT.Z_AXIS = 'z';

   PoT.SCORE_COLOR_BACKGROUND = 0x9cbee2;//0x5c5c5c;
   PoT.SCORE_TEXT_COLOR = 0xd29ce2;//0x5c5c5c;

  /**
   * Root View
   * @type {object}
   */
  PoT.Views.HomeIndex = Backbone.View.extend({

    el: '#PoTContainer',

    lastX:0,
    lastY:0,
    lastTouch:0,

    events: {
        'mousemove':'filterProcessDiceMove',
        'touchend canvas':'processTouchEnd',
        'touchstart canvas':'processTouchStart',
        'mousewheel canvas':'processMouseWheel',//other browser
        'DOMMouseScroll canvas':'processMouseWheel' // FF mousewheel event
    },

    processMouseWheel:function(e){
        var zDirection = PoT.MOUSE_NO_DIRECTION;
        e = window.event || e;

        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

        if (delta < 0) {
            zDirection = PoT.MOUSE_WHEEL_DOWN;
        } else {
            zDirection = PoT.MOUSE_WHEEL_UP;
        }

        this.applyDiceDirection(zDirection);
    },

    filterProcessDiceMove: _.throttle(
        function(e) {
            this.processDiceMove(e);
            },
        PoT.MOUSE_THROTTLE_SENSIVITY,
        {leading: false}
        )
    ,
    processTouchStart:function(e){
        //save x1,y1 position
        this.lastTouch = e.originalEvent.touches[0];
    },

    processTouchEnd:function(e){
        //save x2,y2 position
        var currentTouch = e.originalEvent.changedTouches[0];
        var Xdelta = currentTouch.clientX - this.lastTouch.clientX;
        var Ydelta = currentTouch.clientY - this.lastTouch.clientY;
        var directorCoeff = Ydelta/Xdelta;

        if(Math.abs(directorCoeff) >= 0.5 && Math.abs(directorCoeff) < 1){//moving on z axis
            if(Ydelta > 0){
                this.applyDiceDirection(PoT.MOUSE_WHEEL_DOWN);
            }else {
                 this.applyDiceDirection(PoT.MOUSE_WHEEL_UP);
            }
        }
        else{//moving on x or y axis
            this.processDiceMove(e.originalEvent.changedTouches[0]);
        }
    },

    processDiceMove:function(e){
        var xDirection = yDirection = PoT.MOUSE_NO_DIRECTION;

        if (e.pageY < this.lastY) {
            yDirection = PoT.MOUSE_UP;
        } else {
            yDirection = PoT.MOUSE_DOWN;
        }

        if (e.pageX < this.lastX) {
            xDirection = PoT.MOUSE_LEFT;
        } else {
            xDirection = PoT.MOUSE_RIGHT;
        }

        //determine the main important direction
        var xWeight = Math.abs(this.lastX - e.pageX);
        var yWeight = Math.abs(this.lastY - e.pageY);

        this.lastY = e.pageY;
        this.lastX = e.pageX;

        //DO NOTHING can't determine main direction
        if(xWeight === yWeight){
           return true;
        }

        //apply x direction
        if(xWeight > yWeight){
          this.applyDiceDirection(xDirection);
        }
        else {// apply y direction
         this.applyDiceDirection(yDirection);
        }


    },
    applyDiceDirection:function (mainDirection){

        switch(mainDirection)
        {
            case PoT.MOUSE_WHEEL_UP:
                console.log('MOUSE_WHEEL_UP');
                this.moveDice('z',-1);
            break;

            case PoT.MOUSE_WHEEL_DOWN:
                console.log('MOUSE_WHEEL_DOWN');
                this.moveDice('z',1);
            break;

            case PoT.MOUSE_UP:
                console.log('MOUSE_UP');
                this.moveDice('y',1);
            break;

            case PoT.MOUSE_DOWN:
                console.log('MOUSE_DOWN');
                this.moveDice('y',-1);
            break;

            case PoT.MOUSE_LEFT:
                console.log('MOUSE_LEFT');
                this.moveDice('x',-1);
            break;

            case PoT.MOUSE_RIGHT:
                console.log('MOUSE_RIGHT');
                this.moveDice('x',1);
            break;

        default:
            console.log('Unknown mainDirection',mainDirection);
            break;
        }
    },

    processKeyEvent: function(e){
    var rotationParams = {x:0,y:0};

    switch(e.keyCode)
        {
            case PoT.LEFT_ARROW:
                rotationParams.y = PoT.GO_LEFT;
            break;

            case PoT.UP_ARROW:
                rotationParams.x = PoT.GO_UP;
            break;

            case PoT.RIGHT_ARROW:
                rotationParams.y = PoT.GO_RIGHT;
            break;

            case PoT.DOWN_ARROW:
                rotationParams.x = PoT.GO_DOWN;
            break;

        default:
            console.log('Unknown key code',e);
            break;
        }


     this.processRotation(rotationParams);
    },

    initialize: function() {

        //add a key listener for processing the rotation of the main cube
        $(window).on("keydown", this.processKeyEvent.bind(this));

        //define a camera
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        this.camera.position.z = 1000;

        //define the scene
        this.scene = new THREE.Scene();

        this.geometry = new THREE.BoxGeometry( PoT.MAIN_CUBE_WIDTH, PoT.MAIN_CUBE_WIDTH, PoT.MAIN_CUBE_WIDTH );
        this.material = new THREE.MeshNormalMaterial();

        //define the main cube
        this.mainCube = new THREE.Mesh( this.geometry, this.material );

        //define the box surrounding the main cube
        this.mainBox = new THREE.BoxHelper( this.mainCube );
        this.mainBox.material.color.set( 0x00ffff );

        this.scene.add( this.mainBox );

        //draw the box from the main cube
        this.initBox();

        //init the dice matrix
        this.dices = new PoT.Collections.Dices();
        this.dices.on('add', this.addDice, this);

        this.dices.initWithRandomDice(_.random(2,4));

        //add an axis helper for debug
        //this.axisHelper = new THREE.AxisHelper( 300 );
        //this.scene.add( this.axisHelper );

        //add score zone
        this.initScoreTab();

        //bind the refresh score value on collection add
        this.dices.on('add', this.refreshScoreValue, this);

        //choose the proper renderer
        if (window.WebGLRenderingContext) {
            this.renderer = new THREE.WebGLRenderer();
            } else {
            this.renderer = new THREE.CanvasRenderer();
            };

        //defines the renderer size
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        //render the scene with the chosen camera
        this.renderScene();
    },

    diceCoord:function (c)
    {
        return  c * PoT.DICE_WIDTH + PoT.DICE_COORD_RATIO;
    },

    render: function() {
      this.$el[0].appendChild(this.renderer.domElement);
      return this;
    },

    initBox: function(){
        this.mainCube.rotation.x = 0;
        this.mainCube.rotation.y = -0.50;
        this.mainBox = new THREE.Box3().setFromObject(this.mainCube);
    },

    addDice:function(model)
    {
        this.geometry = new THREE.BoxGeometry( PoT.DICE_WIDTH , PoT.DICE_WIDTH, PoT.DICE_WIDTH);
        this.material = new THREE.MeshBasicMaterial({map:this.getFaceTexture(model.get('value'))});

        var dice = new THREE.Mesh( this.geometry, this.material );

        dice.rotation.x = 0;
        dice.rotation.y = -0.50;

        dice.position.set(this.diceCoord(model.get('x')),
            this.diceCoord(model.get('y')),
            this.diceCoord(model.get('z'))
        );

        model.set('mesh',dice);

        model.on('change:x', this.refreshDicePosition, this);
        model.on('change:y', this.refreshDicePosition, this);
        model.on('change:z', this.refreshDicePosition, this);
        model.on('change:value', this.refreshDiceValue, this);
        model.on('change:value',this.refreshScoreValue,this);
        model.on('remove', this.removeDiceFromScene, this);

        this.scene.add( dice);

        return true;
    },
    removeDiceFromScene:function(model)
    {
        var dice = model.get('mesh');

        dice.material.dispose();
        dice.geometry.dispose();

        this.scene.remove(dice);
    },
    moveDice:function(axis,operation){
        var _self = this;

        for(i=0;i < 4;++i){// process 4 times the moving in order to reach the furthe spot for each dice
            this.dices.forEach (function(model, index,dices){
                //skip if model has been removed from a previous iteration
                if(_.isUndefined(model)){
                    return true;
                }

                if(Math.abs(model.get(axis) + operation)  < 3){
                    var newSpotCoords = model.pick(PoT.X_AXIS,PoT.Y_AXIS,PoT.Z_AXIS);

                    newSpotCoords[axis] += operation;

                    newposition = _self.dices.findWhere(newSpotCoords);

                    //if new position is not occupied move the dice
                    if(_.isUndefined(newposition)){
                        model.set(axis,model.get(axis) + operation);
                    }
                    else{//we have a collision merge the dice if they have the same value

                        if(newposition.get('value') === model.get('value')){
                            newposition.set('value',newposition.get('value') + model.get('value'));
                            model.destroy();
                        }
                        else
                            return true;
                    }
                }
            });
        }//end for loop

        //if we can't add a new dice we loose.
        if(this.dices.addRandomDice() === false){
            return this.processGameOver();
        }

    },
    processGameOver:function(){
        this.dices.off();

        this.dices.forEach (function(model, index){
        model.off();
        });

        this.stopListening();

        $(window).off();

        this.$el.off();
        alert('You Loose T.T : Your actual score is ' + this.getTotalScore());

        window.location.reload();
        return false;
    },
    refreshDicePosition:function(model){
        var dice = model.get('mesh');

        dice.position.set(this.diceCoord(model.get('x')),
            this.diceCoord(model.get('y')),
            this.diceCoord(model.get('z'))
        );

    },

    renderScene:function () {

    requestAnimationFrame(this.renderScene.bind(this));

    this.renderer.render( this.scene, this.camera );
    },

    refreshDiceValue:function(model){
        var dice = model.get('mesh');

        dice.material.dispose();

        dice.material = new THREE.MeshBasicMaterial({map:this.getFaceTexture(model.get('value'))});
    },

    refreshScoreValue:function(){
        this.scorePlane.material = new THREE.MeshBasicMaterial( {color: PoT.SCORE_COLOR_BACKGROUND, side: THREE.DoubleSide,map:this.getScoreTexture(this.getTotalScore())} );
    },
    /**
     * getTotalScore return the power of three sum of each dice
     * @return int
     */
    getTotalScore:function()
    {
        return this.dices.reduce(function(sum, dice){return sum + Math.pow(dice.get('value'),3);}, 0);
    },

    getFaceTexture:function(faceValue)
    {
        var numberToDisplay = Math.pow(faceValue,3).toString();
        //create image
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = 150;
        canvas.height = 150;
        ctx.font = 'Bold 40px Arial';
        ctx.textAlign = 'center';

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'red';
        ctx.strokeText(numberToDisplay, canvas.width/2, canvas.height/2);

        // canvas contents will be used for a texture
        var texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;
        return texture;
    },
    initScoreTab:function(scoreValue)
    {
    var geometry = new THREE.PlaneBufferGeometry( 512, 512, 1 );
    var material = new THREE.MeshBasicMaterial( {color: PoT.SCORE_COLOR_BACKGROUND, side: THREE.DoubleSide,map:this.getScoreTexture(this.getTotalScore())} );
    this.scorePlane = new THREE.Mesh( geometry, material );
    this.scorePlane.position.set(1000,-100,0);

    this.scene.add(this.scorePlane);
    },
    getScoreTexture:function(scoreValue){
        //create image
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = 150;
        canvas.height = 150;
        ctx.font = 'Bold 16px Arial';
        ctx.textAlign = 'center';

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = PoT.SCORE_TEXT_COLOR;
        ctx.strokeText('Score : ' + scoreValue, canvas.width/2, canvas.height/2);

        // canvas contents will be used for a texture
        var texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;

        return texture;
    },
    processRotation: function(rotationParams){
        var _self = this;

        this.mainCube.rotation.x += rotationParams.x;
        this.mainCube.rotation.y += rotationParams.y;
        //this.axisHelper.rotation.x += rotationParams.x;
        //this.axisHelper.rotation.y += rotationParams.y;

        this.dices.forEach (function(model, index){
            var dice = model.get('mesh');

            dice.rotation.x += rotationParams.x;
            dice.rotation.y += rotationParams.y;
        });

        this.mainBox = new THREE.Box3().setFromObject(this.mainCube);

    }

  });


})(window, window.document, window.PoT || (window.PoT = {}));
