import { TOWER_TYPE_DEFAULT } from '../utils/constants.js';
import { HOVERED_TILE_OK, SELECTED_TILE, DEFAULT_MATERIAL } from '../utils/constants.js';

export class Projectile {
    constructor(props){
        this.speed = 0.1;
        this.tile = props.tile;
        this.spawnTile = props.spawnTile;
        this.mesh;
        this.damage = props.damage;
        this.parent = props.parent;
    }

    setup() {
        var objGeometry = new THREE.SphereBufferGeometry( 0.5, 0.5, 0.5 );
        this.mesh = new THREE.Mesh(objGeometry, DEFAULT_MATERIAL);
        this.mesh.position.set(this.spawnTile.tileX, 2, this.spawnTile.tileY);
        window.world.addToScene(this.mesh);
    }

    move() {

        if( this.mesh ){
            if (this.mesh.position.x > this.tile.tileX) {
                this.mesh.position.x -= this.speed//Math.min( this.speed, this.dX );
            }
                
            if (this.mesh.position.z > this.tile.tileY) {
                this.mesh.position.z -= this.speed//Math.min( this.speed, this.dY );
            }

            if (this.mesh.position.x < this.tile.tileX) {
                this.mesh.position.x += this.speed//Math.min( this.speed, this.dX );
            }
                
            if (this.mesh.position.z < this.tile.tileY) {
                this.mesh.position.z += this.speed//Math.min( this.speed, this.dY );
            }

            if (parseInt(this.mesh.position.x) == parseInt(this.tile.tileX) &&
                parseInt(this.mesh.position.z) == parseInt(this.tile.tileY)) {
                window.world.RemoveFromScene(this.mesh);
                this.parent.projectiles = this.parent.projectiles.filter(data => data != this);

                if (this.tile.enemies.length > 0){
                    this.tile.enemies[0].hp -= this.damage
                }
            }

        }
    }
}