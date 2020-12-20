
export class GameState {
	constructor(props) {
		this.gold = props.gold;
		this.lives = props.lives ;
		this.enemies_killed = 0;
		this.time_between_hordes = props.time_between_hordes;
		this.time_left = props.time_between_hordes;
		this.hordes_left = 20;
		this.counting = false;
		this.tower_settings = props.tower_settings;
		this.horde_level = 1;
	}

	update() {

		if (!this.counting) {
			this.counting = true;
			setTimeout(() => {this.countDown()}, 1000);
		}

		if(this.time_left < 0) {
			window.gameMode.spawnHorde();
		}

		if (this.hordes_left == 0) {
			this.lives = 0
		}
	}
	
	resetTimer() {
		this.time_left = this.time_between_hordes;
	}

	countDown() {
		this.time_left -= 1;
		this.counting = false;
	}

	restLife() {
		this.lives -= 1
	}

	addKill() {
		this.enemies_killed += 1;
	}
}