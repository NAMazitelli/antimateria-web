import * as THREE from './three.module.js';

import { FBXLoader } from './FBXLoader.js';

export class loadResources {
    constructor(props){
    	this.loadManager = new THREE.LoadingManager();
		this.frameID = null;
		this.percentComplete = 0;
		this.updateAmount = 5;

    }

    setup() {
    	const thisObj = this;
		this.loadManager.onStart = () => {
		  // onStart may be called multiple times
		  // don't run the animation more than once
		  if ( thisObj.frameID !== null ) return;
		  thisObj.animateBar(thisObj);
		};


		this.loadManager.onLoad = ( ) => {
		  	window.hud.loadingElem.classList.add( 'hidden' );

		  // reset the bar in case we need to use it again
		  thisObj.percentComplete = 0;
		  window.hud.progress.style.width = 0;
		  cancelAnimationFrame( thisObj.animateBar );
	 	  window.allLoaded()

		  // do any other on load things
		};

    	this.fbxloader = new FBXLoader(this.loadManager);
		this.textureloader = new THREE.TextureLoader(this.loadManager);

		window.meshes = {}
		this.loadModel('src/models/SM_HexTile.fbx', "TILEAR")
		this.loadModel('src/models/SM_HexTile.fbx', "TILE")
		this.loadModel('src/models/Tower_Ice.fbx', "TOWER_TYPE_ICE")
		this.loadModel('src/models/Tower_Fire.fbx', "TOWER_TYPE_FIRE")
		this.loadModel('src/models/Tower_Light.fbx', "TOWER_TYPE_SPEED")
		this.loadModel('src/models/Enemy2.fbx', "ENEMY", (object) => { 	
		let mixer = new THREE.AnimationMixer( object );
		let action = mixer.clipAction( object.animations[0] );
		action.reset();
		action.play();
			window.meshes.ENEMY_FBX = object
				object.traverse( function ( child ) {
    	        if ( child.isMesh ) {
    	            window.meshes.ENEMY = child;
					child.castShadow = true;
					child.receiveShadow = true;
    	        }
    	    });
		});


		const diffuseColor = new THREE.Color().setHSL( 1, 1, 1 )
		const specularShininess = Math.pow(1 , 1 * 10 );
		const specularColor = new THREE.Color( 1, 1, 1 );

		window.TILE_COLORS = {
			//GRASS_TILE: new THREE.MeshPhongMaterial({ color: 0x32a852 } ),
			//GROUND_TILE: new THREE.MeshPhongMaterial({ color: 0xb0b0b0 } ),
			GRASS_TILE: new THREE.MeshPhongMaterial({ 
				map: this.textureloader.load('src/models/TextureGrass.png'),
				//color:diffuseColor ,
				//specular: specularColor,
				reflectivity: 1,
				shininess: 0.2
			} ),
			GROUND_TILE: new THREE.MeshPhongMaterial({ 
				map: this.textureloader.load('src/models/textura 1.png'),
				color:diffuseColor,
				specular: specularColor,
				reflectivity: 1,
				shininess: 0
			} ),
			CONCRETE_TILE: new THREE.MeshPhongMaterial({ 
				map: this.textureloader.load('src/models/TextureRock.png'),
				color:diffuseColor,
				specular: specularColor,
				reflectivity: 1,
				shininess: 0
			} ),
			EMPTY_TILE: new THREE.MeshBasicMaterial({ color: 0x000000 } ),
			HOVERED_TILE_OK: new THREE.MeshBasicMaterial({ color: 0x4444ff } ),
			HOVERED_TILE_ERR: new THREE.MeshBasicMaterial({ color: 0xff0000 } ),
			SELECTED_TILE: new THREE.MeshBasicMaterial({ color: 0x64644 } ),
		};
/*		window.hdri = this.textureloader.load('src/images/fondo.hdr', (tx) => {
		
			//window.scene.background = tx
		    this.skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
         	this.skybox = new THREE.Mesh( tx);
         	this.scene.add(this.skybox);
		});

*/
    }

	animateBar(objBar) {

	  	objBar.percentComplete += objBar.updateAmount;

	    // if the bar fills up, just reset it.
	    // you could also change the color here
	    if ( objBar.percentComplete >= 100 ) {
	    	objBar.percentComplete = 5;
	    }
	    if (window.hud) { 
	    	window.hud.progress.style.width = objBar.percentComplete + '%' 
	    };
		objBar.frameID = requestAnimationFrame( () => objBar.animateBar(objBar) )
	}

	loadModel(model, index, callback = false) {
		this.fbxloader.load(model, 
			(object) => {
				if (callback) { 
					callback(object) 
				} else {
					object.traverse( function ( child ) {
		    	        if ( child.isMesh ) {
		    	            window.meshes[index] = child;
							child.castShadow = true;
							child.receiveShadow = true;
		    	        }
		    	    });
				}
			},
			this.loadManager.onProgress,
			this.loadManager.onError			
		);

	}
}
