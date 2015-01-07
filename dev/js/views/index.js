
(function(win, doc, PoT){


  /**
   * Root View
   * @type {object}
   */
  PoT.Views.HomeIndex = Backbone.View.extend({

    el: '#PoTContainer',

    /*template: tpl('home'),*/

    events: {
    },

    initialize: function() {

        //var PoT.camera, PoT.scene, PoT.renderer,PoT.geometry, PoT.material, PoT.mesh;


        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        this.camera.position.z = 1000;

        this.scene = new THREE.Scene();

        this.geometry = new THREE.BoxGeometry( 200, 200, 200 );
        this.material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.scene.add( this.mesh );

        if (window.WebGLRenderingContext) {
            this.renderer = new THREE.WebGLRenderer();
            } else {
            this.renderer = new THREE.CanvasRenderer();
            };

        this.renderer.setSize( window.innerWidth, window.innerHeight );
    },

    render: function() {
      this.$el[0].appendChild(this.renderer.domElement);
      this.animate();
      return this;
    },

    animate: function(){

        // note: three.js includes requestAnimationFrame shim
        requestAnimationFrame( this.animate.bind(this) );

        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.02;

        this.renderer.render( this.scene, this.camera );
    }

  });


})(window, window.document, window.PoT || (window.PoT = {}));
