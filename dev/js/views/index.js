
(function(win, doc, PoT){


   PoT.LEFT_ARROW = 37,PoT.UP_ARROW = 38, PoT.RIGHT_ARROW = 39, PoT.DOWN_ARROW = 40;
   PoT.GO_LEFT = -0.02,PoT.GO_UP = -0.01, PoT.GO_RIGHT = -PoT.GO_LEFT, PoT.GO_DOWN = -PoT.GO_UP;
   
  /**
   * Root View
   * @type {object}
   */
  PoT.Views.HomeIndex = Backbone.View.extend({

    el: '#PoTContainer',

    /*template: tpl('home'),*/

    events: {
    },

    processKeyEvent: function(e){
    var rotationParams = {x:0,y:0};

    console.log(e.keyCode);
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

        $(window).on("keydown", this.processKeyEvent.bind(this));

        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        this.camera.position.z = 1000;

        this.scene = new THREE.Scene();

        this.geometry = new THREE.BoxGeometry( 600, 600, 600 );
        this.material = new THREE.MeshNormalMaterial();

        this.mainCube = new THREE.Mesh( this.geometry, this.material );

        this.mainBox = new THREE.BoxHelper( this.mainCube );
        this.mainBox.material.color.set( 0x00ffff );

        this.scene.add( this.mainBox );
        //this.scene.add( this.mainCube );

        if (window.WebGLRenderingContext) {
            this.renderer = new THREE.WebGLRenderer();
            } else {
            this.renderer = new THREE.CanvasRenderer();
            };

        this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.renderer.render( this.scene, this.camera );

    },

    render: function() {
      this.$el[0].appendChild(this.renderer.domElement);
      return this;
    },

    animate: function(rotationParams){

        // note: three.js includes requestAnimationFrame shim
       // requestAnimationFrame( this.animate.bind(this) );

        this.mainCube.rotation.x += rotationParams.x; //0.01;
        this.mainCube.rotation.y += rotationParams.y; // 0.02;
        //this.mainBox.rotation.x += rotationParams.x; //0.01;
        //this.mainBox.rotation.y += rotationParams.y; // 0.02;
        this.mainBox = new THREE.Box3().setFromObject(this.mainCube);
        console.log(this.mainCube.rotation.x,this.mainCube.rotation.y,this.mainCube.rotation.z);
        console.log(this.mainCube);
        
               // console.log(this.mainBox.rotation.x,this.mainBox.rotation.y,this.mainBox.rotation.z);

        this.renderer.render( this.scene, this.camera );
    }

  });


})(window, window.document, window.PoT || (window.PoT = {}));
