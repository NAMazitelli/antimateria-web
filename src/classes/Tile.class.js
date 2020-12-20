import { TowerParent } from './TowerParent.class.js';
import { TOWER_TYPE_DEFAULT, 
         GRASS_TILE, 
         GROUND_TILE, 
         CONCRETE_TILE,
         GAME_MODE_AR,
         GAME_MODE_DEFAULT } from '../utils/constants.js';

export class Tile {
    constructor(props){
        this.vertices = [];
        this.material;
        this.geometry;
        this.mesh;
        this.shape;
        this.angles;
        this.interactive = props.interactive ? props.interactive : false;
        this.row = props.row;
        this.column = props.column;
        this.type = props.type ? props.type : GRASS_TILE;
        this.size = props.size ? props.size : 20;
        this.debug=false;
        this.color;
        this.building;
        this.enemies = [];
        this.selected = false;
        this.tileOffsetY = props.tileOffsetY ? props.tileOffsetY : 0;
        this.tileOffsetX = props.tileOffsetX ? props.tileOffsetX : 0;
    }

    setup() {

        this.color = window.TILE_COLORS[this.type];
        this.material = window.TILE_COLORS[this.type];


        let ratio = this.size * 2
        this.tileX = (this.column * ratio - this.column * this.size / 2) - this.tileOffsetX;
        this.tileY = this.column % 2 == 0 ? 
                    ((this.row * ratio) + this.size - (this.size/8) - this.row * this.size / 4) - this.tileOffsetY: 
                    ((this.row * ratio) - this.row * this.size / 4) - this.tileOffsetY
        switch (window.user_game_mode) {
            case GAME_MODE_AR: 
                this.mesh = window.meshes.TILEAR.clone();
                this.mesh.material = this.material;
                this.mesh.material.needsUpdate = true;
                this.mesh.scale.set(0.2, 0.2, 0.2)
                this.mesh.position.set(this.tileX, 0, this.tileY );
                break;
            case GAME_MODE_DEFAULT:
                this.mesh = window.meshes.TILE.clone();
                this.mesh.material = this.material;
                this.mesh.material.needsUpdate = true;
                this.mesh.position.set(this.tileX, 0, this.tileY );
                break;
        }
        window.world.addToScene(this.mesh);

        window.meshesToObjects[this.mesh.uuid] = {"row": this.row, "column": this.column}
        if (this.debug) { 
            this.debugMesh.position.set(this.tileX, 0, this.tileY ) 
            window.world.scene.add(this.debugMesh);    
        }
    }

    polygon(x, y, radius, npoints) {
        let angle = (Math.PI * 2) / npoints;
        this.shape = new THREE.Shape();

        for (let a = 0; a <= (Math.PI * 2); a += angle) {
          let sx = x + Math.cos(a) * radius;
          let sy = y + Math.sin(a) * radius;
          this.shape.lineTo(sx, sy);
        }


        if (this.debug) {
            this.drawDebugInfo();
        } 
            
        this.material =  window.TILE_COLORS[this.type];
        this.color = window.TILE_COLORS[this.type];
        this.geometry = new THREE.ShapeGeometry(this.shape);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
  }


  drawDebugInfo() {
    //create image
    var bitmap = document.createElement('canvas');
    var g = bitmap.getContext('2d');
    bitmap.width = this.size;
    bitmap.height = this.size;
    g.font = '12px Arial';
    let text = "c:" + this.column+ " r:" + this.row;


    g.fillStyle= "white";
    g.fillRect(0,0,bitmap.width,bitmap.height);

    g.fillStyle = 'black';
    g.fillText(text, 0, 30);
    g.strokeStyle = 'black';
    g.strokeText(text, 0, 30);
    // canvas contents will be used for a texture
    var texture = new THREE.Texture(bitmap) 

    texture.needsUpdate = true;
    var objGeometry = new THREE.BoxGeometry(this.size, 2, this.size);
    var objMaterial = new THREE.MeshBasicMaterial({ map: texture,  color: window.TILE_COLORS[this.type] } );

    var debugMesh = new THREE.Mesh(objGeometry, objMaterial);
    this.debugMesh = debugMesh
  }

  createTower(props) {
        this.building = new TowerParent({
            ...props, 
            selected: this.selected
        });
        window.gameMode.towers.push(this.building)
        this.building.setup();
  }

  setSelected(setting) { 
    this.selected = setting;
    if (this.building) {
        this.building.setSelected(setting);
    }
  }

  setMaterial(material) {
    this.mesh.material = material;
  }

  destroyBuilding() {
    console.log("destroy", this.building)
    window.gameMode.enemies.splice(window.gameMode.enemies.indexOf(this.building), 1);
    window.world.scene.remove(this.building.mesh);
    this.building = false;
  }
}
