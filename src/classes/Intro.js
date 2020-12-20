import * as THREE from '../utils/three.module.js';

import { FBXLoader } from '../utils/FBXLoader.js';

import { FirstPersonControls } from '../utils/FirstPersonControls.js';
import { ImprovedNoise } from '../utils/ImprovedNoise.js';

export class Intro {
    constructor(props) {
        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
        this.scene = new THREE.Scene();
        this.container = document.getElementById( 'intro-container' );
        this.mesh
        this.renderer
        this.speed = 0.8
        this.offset = 5
        this.worldWidth = 256;
        this.worldDepth = 256;
        this.geometry = new THREE.PlaneBufferGeometry( 7500, 7500, this.worldWidth - 1, this.worldDepth - 1 );
        this.data
        this.texture
        this.clock = new THREE.Clock();
        this.angle = 0
        this.radius = 500
        this.coords = [{x:-1000,z:-1000}, {x:1000, z:-1000}, {x:1000, z:1000}, {x:-1000, z:1000}];
        this.path = [{x:-1000,z:-1000}, {x:1000, z:-1000}, {x:1000, z:1000}, {x:-1000, z:1000}];
        this.ray = {}
        this.helperSphere = new THREE.Object3D()
        this.t = 0
        this.light2 = new THREE.PointLight( 0xff6666, 0.9)
        this.light1 = new THREE.AmbientLight( 0xffffff );

    }

    initIntro() {

        this.scene.background = new THREE.Color( 0x080516 );
        this.scene.fog = new THREE.FogExp2( 0x080516, 0.0015 );

        this.data = this.generateHeight( this.worldWidth, this.worldDepth );
        this.camera.position.set( -1000, 500, -1000);
        this.geometry.rotateX( - Math.PI / 2 );

        const vertices = this.geometry.attributes.position.array;

        for ( let i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {

            vertices[ j + 1 ] = this.data[ i ] * 10;

        }



        this.texture = new THREE.CanvasTexture( this.generateTexture( this.data, this.worldWidth, this.worldDepth ) );
        this.texture.wrapS = THREE.ClampToEdgeWrapping;
        this.texture.wrapT = THREE.ClampToEdgeWrapping;

        this.mesh = new THREE.Mesh( this.geometry, new THREE.MeshPhongMaterial( { map: this.texture, 
        } ) );

//       this.light2.add( new THREE.Mesh( new THREE.SphereBufferGeometry( 50, 50, 50 ), new THREE.MeshBasicMaterial( { color: 0xff0000 } ) ) );
        this.light1.add( new THREE.Mesh( new THREE.SphereBufferGeometry( 50, 50, 50 ), new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
        this.light1.position.set(0, -5000, 0)
        this.scene.add( this.light1 );
        this.scene.add( this.light2 );

        this.scene.add( this.mesh );

        this.renderer = new THREE.WebGLRenderer( { antialias: true, logarithmicDepthBuffer: true });
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.container.appendChild( this.renderer.domElement );
    //    this.controls = new FirstPersonControls( this.camera, this.renderer.domElement );
    //    this.controls.movementSpeed = 150;
    //    this.controls.lookSpeed = 0.1;


        //

// model
                const loader = new FBXLoader();
                loader.load( 'src/models/AtomoAnimado.fbx', ( object ) => {
/*
                   let  mixer = new THREE.AnimationMixer( object );
                   console.log(object.animations)
                    const action = mixer.clipAction( object.animations[ 0 ] );
                    action.play();*/
                    object.traverse( function ( child ) {

                        if ( child.isMesh ) {

                            child.castShadow = true;
                            child.receiveShadow = true;
                        child.material =  new THREE.MeshToonMaterial({ color: 0xff0040 } ) 

                        }

                    } );
                    console.log(this)
                    this.object = object;
                    this.object.scale.set(2,2,2)
                    this.scene.add( this.object );
                    this.object.loaded=true

                } );

// model
                loader.load( 'src/models/Titulo.fbx', ( object ) => {
/*
                   let  mixer = new THREE.AnimationMixer( object );
                   console.log(object.animations)
                    const action = mixer.clipAction( object.animations[ 0 ] );
                    action.play();*/
                    object.traverse( function ( child ) {

                        if ( child.isMesh ) {

                            child.castShadow = true;
                            child.receiveShadow = true;

                        }

                    } );
                    console.log(this)
                    this.title = object;
                    
                    this.scene.add( this.title );
                    this.title.loaded=true

                } );

        window.addEventListener( 'resize', this.onWindowResize, false );

    }

    onWindowResize() {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );

     //   this.controls.handleResize();

    }

    generateHeight( width, height ) {

        let seed = Math.PI / 4;
        window.Math.random = function () {

            const x = Math.sin( seed ++ ) * 1000;
            return x - Math.floor( x );

        };

        const size = width * height, data = new Uint8Array( size );
        const perlin = new ImprovedNoise(), z = Math.random() * 100;

        let quality = 1;

        for ( let j = 0; j < 4; j ++ ) {

            for ( let i = 0; i < size; i ++ ) {

                const x = i % width, y = ~ ~ ( i / width );
                data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );

            }

            quality *= 3;

        }

        return data;

    }

    generateTexture( data, width, height ) {

        let context, image, imageData, shade;

        const vector3 = new THREE.Vector3( 0, 0, 0 );

        const sun = new THREE.Vector3( 1, 1, 1 );
        sun.normalize();

        const canvas = document.createElement( 'canvas' );
        canvas.width = width;
        canvas.height = height;

        context = canvas.getContext( '2d' );
        context.fillStyle = '#000';
        context.fillRect( 0, 0, width, height );

        image = context.getImageData( 0, 0, canvas.width, canvas.height );
        imageData = image.data;

        for ( let i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

            vector3.x = data[ j - 2 ] - data[ j + 2 ];
            vector3.y = 2;
            vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
            vector3.normalize();

            shade = vector3.dot( sun );

            imageData[ i ] = ( 0 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
            imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
            imageData[ i + 2 ] = ( 96 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );

        }

        context.putImageData( image, 0, 0 );

        // Scaled 4x

        const canvasScaled = document.createElement( 'canvas' );
        canvasScaled.width = width * 4;
        canvasScaled.height = height * 4;

        context = canvasScaled.getContext( '2d' );
        context.scale( 4, 4 );
        context.drawImage( canvas, 0, 0 );

        image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
        imageData = image.data;

        for ( let i = 0, l = imageData.length; i < l; i += 4 ) {

            const v = ~ ~ ( Math.random() * 5 );

            imageData[ i ] += v;
            imageData[ i + 1 ] += v;
            imageData[ i + 2 ] += v;

        }

        context.putImageData( image, 0, 0 );

        return canvasScaled;

    }

    cameraMovement() {

        this.ray.vector = new THREE.Vector3(this.camera.position.x, -10000, this.camera.position.z );
        this.ray.vector.normalize();
        this.ray.cast = new THREE.Raycaster(this.camera.position,this.ray.vector );
        this.ray.intersect = this.ray.cast.intersectObject(this.mesh, true);

        //console.log('ray', this.ray)
        if(this.ray.intersect && this.ray.intersect[0]) {
            if (this.ray.intersect[0].distance > 300) {
                this.camera.position.y -= this.speed / 2
            } else {
                this.camera.position.y += this.speed / 2
            }
        }
        if (this.nextTile) {
             this.t += 0.00001
              if (this.t < 1) {
                this.camera.quaternion.slerp(this.helperSphere.quaternion, this.t); //t = normalized value 0 to 1
              }

   
            this.light2.position.copy( this.camera.position );
            this.light2.rotation.copy(this.camera.rotation)
            this.light2.updateMatrix();
            
            this.light2.translateY( 1000 );
           if (this.object && this.object.loaded){
                this.object.position.copy( this.camera.position );
                this.object.rotation.x = this.camera.rotation.x;
                this.object.rotation.y = this.camera.rotation.y;
                this.object.rotation.z += 0.001;
                this.object.updateMatrix();
                this.object.translateZ( - 150 );


           }

           if (this.title && this.title.loaded){

                this.title.position.copy( this.camera.position );
                this.title.rotation.copy(this.camera.rotation)
                this.title.updateMatrix();
                this.title.translateZ( -150 );
                this.title.translateY( - 50 );
            }
            this.light2.target = this.camera
            //this.light2.lookAt(this.camera.position)
            if (this.camera.position.x > this.nextTile.x) {
                this.camera.position.x -= this.speed//Math.min( this.speed, this.dX );
           if (this.object && this.object.loaded){

               // this.object.position.x = this.camera.position.x - 100
            }
            }
            
            if (this.camera.position.z > this.nextTile.z) {
                this.camera.position.z -= this.speed//Math.min( this.speed, this.dY );
           if (this.object && this.object.loaded){

              // this.object.position.z = this.camera.position.z - 100
            }

            }

            if (this.camera.position.x < this.nextTile.x) {
                this.camera.position.x += this.speed//Math.min( this.speed, this.dX );
           if (this.object && this.object.loaded){

              //  this.object.position.x = this.camera.position.x + 100
            }
            }
            
            if (this.camera.position.z < this.nextTile.z) {
                this.camera.position.z += this.speed//Math.min( this.speed, this.dY );
                if (this.object && this.object.loaded){

                  //   this.object.position.z = this.camera.position.x + 100
                 }
            }

            if (parseInt(this.camera.position.x) == parseInt(this.nextTile.x) &&
                parseInt(this.camera.position.z) == parseInt(this.nextTile.z)) {

                this.nextTile = false;
            }

        } else {
            if(this.path.length > 0) {
                this.nextTile = this.path.shift();
                this.dX = this.mesh.position.x - this.nextTile.x;
                this.dY = this.mesh.position.z - this.nextTile.z;
                this.helperSphere.position.set(this.nextTile.x, 0, this.nextTile.z); 
                this.isMoving = true;
                this.t = 0
                this.helperSphere.lookAt(this.camera.position)
            } else {
                this.path = [...this.coords]
            }
        }
/*

        if (this.camera.position.x > this.mesh.position.x + this.offset) {
            this.camera.position.x -= this.speed;
        } else {
            this.camera.position.x += this.speed;
        }
        if (this.camera.position.z > this.mesh.position.z + this.offset) {
            this.camera.position.z -= this.speed;
        } else {
            this.camera.position.z += this.speed;
        }
        console.log()*/
       // this.camera.lookAt(this.mesh.position.x, this.mesh.position.y + 100, this.mesh.position.z)
        //this.camera.rotation.y = this.radius * Math.cos( this.angle );  
        //this.camera.rotation.y = this.radius * Math.sin( this.angle );
        this.angle -= 0.000005  ;

    }
    //

    animate() {
        this.cameraMovement()
        this.render();
        requestAnimationFrame( () => {this.animate()} );

    }


    render() {
    //    this.controls.update( this.clock.getDelta() );
        this.renderer.render( this.scene, this.camera );

    }

}