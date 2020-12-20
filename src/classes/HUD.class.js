
export class HUD {
	constructor(props) {
		this.purchase_menu = document.getElementById('ui_purchases_menu');
		this.upgrades_menu = document.getElementById('ui_upgrades_menu');
		this.description_menu = document.getElementById('ui_description_menu');
		this.upgrade_tower_name = document.getElementById('upgrade_tower_name');
		this.upgrade_tower_lvl = document.getElementById('upgrade_tower_lvl');
		this.tower;
		this.gold_label = document.getElementById('gold_label');
		this.lives_label = document.getElementById('lives_label');
		//this.hordes_left_label = document.getElementById('hordes_left_label');
		this.time_left_label = document.getElementById('time_left_label');
		this.loadingElem = document.querySelector('#loading-overlay');
		this.loadingbar = document.querySelector('#loading-bar')
		this.progress = this.loadingbar.querySelector('#progress');
	}

	update() {
		this.gold_label.innerHTML = window.gameState.gold;
		this.lives_label.innerHTML = window.gameState.lives;
		//this.hordes_left_label.innerHTML = window.gameState.hordes_left;
		this.time_left_label.innerHTML = window.gameState.time_left;
	}

	setUpStore(purchaseButtonClick) {
		window.gameState.tower_settings.forEach((tower) => {
			let purchase_item_template = document.getElementById('purchase_btn_template').cloneNode();
			purchase_item_template.classList.add(tower.type)
		//	let price_span =  document.createElement('span');
		//	price_span.innerHTML = tower.price + " $";
		//	purchase_item_template.appendChild(price_span);
			purchase_item_template.classList.remove("hidden")
			purchase_item_template.addEventListener('click', function(e) { 
            	purchaseButtonClick(tower, e);
        	});
			this.purchase_menu.getElementsByClassName("purchase_buttons")[0].appendChild(purchase_item_template);
		});
	}
	setUpgrades(building) {
		console.log(building)
		this.upgrade_tower_name.innerHTML = building.name.toUpperCase();
		this.upgrade_tower_lvl.innerHTML = building.level;
	}
	showUpgradeMenu(building) {
		this.setUpgrades(building);
		this.upgrades_menu.classList.remove("hidden");
	}
	hideUpgradeMenu() {
		this.upgrades_menu.classList.add("hidden");
	}
	showBuildingMenu() {
		this.purchase_menu.classList.remove("hidden");
	}

	hideBuildingMenu() {
		this.purchase_menu.classList.add("hidden");
		this.hideDescription()
	}
	
	showDescription(e) {
		this.tower = e;
		this.description_menu.classList.remove("hidden");
	}

	hideDescription() {
		this.description_menu.classList.add("hidden");
	}


}