
(function(win, doc, PoT){


   PoT.LEFT_ARROW = 37,PoT.UP_ARROW = 38, PoT.RIGHT_ARROW = 39, PoT.DOWN_ARROW = 40;

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

        switch(e.keyCode)
        {
            case PoT.LEFT_ARROW:
                //rotationParams.x = -0.01;
                rotationParams.y = -0.02;
            break;

            case PoT.UP_ARROW:
                rotationParams.x = -0.01;
            break;

            case PoT.RIGHT_ARROW:
                rotationParams.y = 0.02;
            break;

            case PoT.DOWN_ARROW:
                rotationParams.x = 0.01;
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
        this.material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

        this.cube = new THREE.Mesh( this.geometry, this.material );
        this.scene.add( this.cube );

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

        this.cube.rotation.x += rotationParams.x; //0.01;
        this.cube.rotation.y += rotationParams.y; // 0.02;

        console.log(this.cube.rotation.x,this.cube.rotation.y,this.cube.rotation.z);

        this.renderer.render( this.scene, this.camera );
    }

  });


})(window, window.document, window.PoT || (window.PoT = {}));
