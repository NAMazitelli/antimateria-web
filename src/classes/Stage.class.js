import { TOWER_TYPE_DEFAULT } from '../utils/constants.js';
import { Tile } from './Tile.class.js';

export class Stage {
    constructor(props){
    	this.tileMapConfig = props.tileMapConfig ? props.tileMapConfig : [];
        this.tileMap =  [];
        this.tileSize = props.tileSize ? props.tileSize : 20;
        this.enemyPath = props.enemyPath ? props.enemyPath : [];
        this.startPoint = props.startPoint ? props.startPoint : {};
        this.endPoint = props.endPoint ? props.endPoint : {};
        this.tileOffsetX = props.tileOffsetX ? props.tileOffsetX : 0;
        this.tileOffsetY = props.tileOffsetY ? props.tileOffsetY : 0;
    }

    setup() {
    	let row;

        for (let irow = 0; irow < this.tileMapConfig.length; irow++) {
        	row = [];
        	let tmConfigRow = this.tileMapConfig[irow];
        	let newTile;
	        for (let i = 0; i < tmConfigRow.length; i++) {
	        	newTile = new Tile({ 
	        		column: i, 
	        		row: irow, 
	        		type: tmConfigRow[i].type, 
	        		size: this.tileSize, 
	        		interactive: tmConfigRow[i].interactive,
                    tileOffsetX: this.tileOffsetX,
                    tileOffsetY: this.tileOffsetY,
	        	})
            	row.push(newTile);
	        	newTile.setup();
            }
            this.tileMap.push(row);

        }
        console.log(this.startPoint)
    }

    getTile(x,y) { 
    	return this.tileMap[x][y]
    }
}
