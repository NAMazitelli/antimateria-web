import { EnemyParent } from './Enemy.class.js';
import {ContextAR} from '../utils/ContextAR.js';

export class GameModeAR {
    constructor(props){
    	this.playingHorde = false;
    	this.enemies = [];
    	this.enemiesSize = 5;
    	this.towers = [];
        this.contextAR = new ContextAR(window.world);
        this.marker = this.contextAR.crearMarcador('src/images/pattern-marker (1).patt', "main");
        this.horde_level = 1;

    }

    spawnHorde() {
    	if (!this.playingHorde) {
    		this.playingHorde = true;
    		window.gameState.resetTimer();
    		for (let index = 0; index < this.enemiesSize; index++) {
    			let enemy = new EnemyParent();
    			setTimeout(() => {enemy.spawn()}, index * 1500);
    			this.enemies.push(enemy);
    		}
    		this.playingHorde = false;
    		window.gameState.hordes_left -= 1
            window.gameState.horde_level += 1
    	}
    }
}
