
(function(win, doc, PoT){

    /**
    * PoT constants
    */
   PoT.LEFT_ARROW = 37,PoT.UP_ARROW = 38, PoT.RIGHT_ARROW = 39, PoT.DOWN_ARROW = 40;
   PoT.GO_LEFT = -0.02,PoT.GO_UP = -0.01, PoT.GO_RIGHT = -PoT.GO_LEFT, PoT.GO_DOWN = -PoT.GO_UP;
   PoT.MAIN_CUBE_WIDTH = 600;
   PoT.DICE_WIDTH = PoT.MAIN_CUBE_WIDTH/4;
   PoT.DICE_COORD_RATIO = PoT.DICE_WIDTH/2 ;


  /**
   * Root View
   * @type {object}
   */
  PoT.Views.HomeIndex = Backbone.View.extend({

    el: '#PoTContainer',

    events: {
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


     this.animate(rotationParams);
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
        this.material = new THREE.MeshNormalMaterial();

        var dice = new THREE.Mesh( this.geometry, this.material );

        dice.rotation.x = 0;
        dice.rotation.y = -0.50;

        dice.position.set(this.diceCoord(model.get('x')),
            this.diceCoord(model.get('y')),
            this.diceCoord(model.get('z'))
        );

        model.set('mesh',dice);
        this.scene.add( dice);

        return true;
    },
    animate: function(rotationParams){

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
