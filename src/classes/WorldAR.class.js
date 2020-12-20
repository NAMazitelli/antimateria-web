import { MapControls } from '../utils/OrbitControls.js';
import { RGBELoader } from '../utils/RGBELoader.js';

export class WorldAR{
    constructor(){
        this.scene = new THREE.Scene();
       
        // ISOMETRIC CAMERA
        let aspect = window.innerWidth / window.innerHeight
        let d = 600
        this.camera = new THREE.PerspectiveCamera();

        this.camera.position.z = 0;
        this.camera.position.y = 0;
        this.camera.position.x = 0;

        this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha:true, logarithmicDepthBuffer: true } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.renderer.domElement.id = 'MainCanvas';

        // controls
        /*this.controls = new MapControls( this.camera, this.renderer.domElement );

        this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        this.controls.dampingFactor = 0.05;

        this.controls.screenSpacePanning = false;

        this.controls.minDistance = 1000;
        this.controls.maxDistance = 3000;

        this.controls.maxPolarAngle = Math.PI / 2;*/

        // LIGHTS
        const dirLight = new THREE.DirectionalLight( 0xffffff, 1);
        dirLight.position.set( 300, 300, 300 ).normalize();
        this.scene.add( dirLight );

      /*  const pointLight = new THREE.PointLight( 0xffffff, 1 );
        pointLight.position.set( 300, 1000, 300 );
        pointLight.color.setHSL( 1, 1, 1 );
        this.scene.add( pointLight );*/
        //this.iluminarConFoto('./hdr/fondo.png',false);

        document.body.appendChild( this.renderer.domElement );
    }
    
    iluminarConFoto(archivo, conFondoVisible){
        var pmremGenerator = new THREE.PMREMGenerator( this.renderer );
        pmremGenerator.compileEquirectangularShader();

        new THREE.TextureLoader().load( archivo, ( texture ) => {
            var iluminacion = pmremGenerator.fromEquirectangular( texture );
            this.scene.environment = iluminacion.texture;
            if(conFondoVisible){
                this.scene.background = iluminacion.texture;
            }
            texture.dispose();
            pmremGenerator.dispose();
        });
    }

    HDRIIllumination(file){
        var pmremGenerator = new THREE.PMREMGenerator( this.renderer );
        pmremGenerator.compileEquirectangularShader();
        new RGBELoader()
        .setDataType( THREE.UnsignedByteType )
        .load( file, (texture)=>{
            var envMap = pmremGenerator.fromEquirectangular( texture ).texture;
        //    this.scene.environment = envMap;
      //      this.scene.background = envMap;
            texture.dispose();
            pmremGenerator.dispose();
        } );
    }
    addToScene(mesh) {
        window.gameMode.marker.add(mesh)
    }
    RemoveFromScene(mesh) {
        window.gameMode.marker.remove(mesh)
    }
    render(){
        //this.controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

        this.renderer.render( this.scene, this.camera );
    }
}
