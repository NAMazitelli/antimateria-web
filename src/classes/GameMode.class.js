import { EnemyParent } from './Enemy.class.js';

export class GameMode {
    constructor(props){
    	this.playingHorde = false;
    	this.enemies = [];
    	this.enemiesSize = 5;
    	this.towers = [];
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
