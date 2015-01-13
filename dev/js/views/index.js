
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

  /**
   * Root View
   * @type {object}
   */
  PoT.Views.HomeIndex = Backbone.View.extend({

    el: '#PoTContainer',

    lastX:0,
    lastY:0,

    events: {
        'mousemove':'filterProcessDiceMove',
        'mousewheel canvas':'processMouseWheel'
    },

    processMouseWheel:function(e){
        var zDirection = PoT.MOUSE_NO_DIRECTION;
        e = window.event || e;

        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

        if (delta < 0) {
            zDirection = PoT.MOUSE_WHEEL_UP;
        } else {
            zDirection = PoT.MOUSE_WHEEL_DOWN;
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
                this.moveDice('z',1);
            break;

            case PoT.MOUSE_WHEEL_DOWN:
                console.log('MOUSE_WHEEL_DOWN');
                this.moveDice('z',-1);
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

        this.dices.initWithRandomDice();

        //add an axis helper for debug
        this.axisHelper = new THREE.AxisHelper( 300 );
        this.scene.add( this.axisHelper );

        //choose the proper renderer
        if (window.WebGLRenderingContext) {
            this.renderer = new THREE.WebGLRenderer();
            } else {
            this.renderer = new THREE.CanvasRenderer();
            };

        //defines the renderer size
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        //render the scene with the chosen camera
        this.renderer.render( this.scene, this.camera );
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

        this.scene.add( dice);

        return true;
    },
    moveDice:function(axis,operation){
        this.dices.forEach (function(model, index){
            if(Math.abs(model.get(axis) + operation)  < 3){
                model.set(axis,model.get(axis) + operation);
            }
        });
    },
    refreshDicePosition:function(model){
        var dice = model.get('mesh');

        dice.position.set(this.diceCoord(model.get('x')),
            this.diceCoord(model.get('y')),
            this.diceCoord(model.get('z'))
        );

        this.renderer.render( this.scene, this.camera );

    },
    getFaceTexture:function(text)
    {
        //create image
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = 150;
        canvas.height = 150;
        ctx.font = 'Bold 40px Arial';
        ctx.textAlign = 'center';

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillText(text, 0, 20);
        ctx.strokeStyle = 'red';
        ctx.strokeText(text, canvas.width/2, canvas.height/2);

        // canvas contents will be used for a texture
        var texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;
        return texture;
    },
    processRotation: function(rotationParams){

        this.mainCube.rotation.x += rotationParams.x;
        this.mainCube.rotation.y += rotationParams.y;
        this.axisHelper.rotation.x += rotationParams.x;
        this.axisHelper.rotation.y += rotationParams.y;

        this.dices.forEach (function(model, index){
            var dice = model.get('mesh');

            dice.rotation.x += rotationParams.x;
            dice.rotation.y += rotationParams.y;
        });

        this.mainBox = new THREE.Box3().setFromObject(this.mainCube);

        this.renderer.render( this.scene, this.camera );
    }

  });


})(window, window.document, window.PoT || (window.PoT = {}));
