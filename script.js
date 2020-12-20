import { World } from './src/classes/World.class.js';
import { Stage } from './src/classes/Stage.class.js';
import { GameMode } from './src/classes/GameMode.class.js';
import { GameState } from './src/classes/GameState.class.js';
import { HUD } from './src/classes/HUD.class.js';
import { 
    HOVERED_TILE_OK, 
    HOVERED_TILE_ERR, 
    CONCRETE_TILE,
    GROUND_TILE,
    GRASS_TILE,
    SELECTED_TILE, 
    PLAYER_SETTINGS,
    TOWER_TYPE_ICE,
    TOWER_TYPE_FIRE,
    TOWER_TYPE_SPEED,
    GAME_MODE_DEFAULT,
    GAME_MODE_AR,
    GAME_MODES,
    WORLD_MODES,
    MAP_MODES,
} from './src/utils/constants.js';
import {loadResources} from './src/utils/loadResources.js';
import {Intro} from './src/classes/Intro.js';
const intro = new Intro();
intro.initIntro()
intro.animate()

/* GAME FUNCTIONS */
function init(mode) {
    const clock = new THREE.Clock();
    var intersects, hoverObj, hoveredTile, hoveredTileObj, activeTileObj, tmpOldColor, tmpOldColorActive;
    var towers = [];
    var raycaster = new THREE.Raycaster(); // create once
    var mouse = new THREE.Vector2(); // create once
    let delta;
    var storeButtons = document.querySelectorAll('.purchase_button');
    document.getElementById('start_game').addEventListener( 'click', () => init(GAME_MODE_DEFAULT))
    document.getElementById('start_game_ar').addEventListener( 'click', () => init(GAME_MODE_AR))
    document.getElementById('start_menu').classList.add("hidden")
    document.getElementById('main_game').classList.remove("hidden")
    window.meshesToObjects = {}
    window.hud = new HUD();
    window.user_game_mode = mode;
    window.allLoaded = allLoaded;
    window.loader = new loadResources();
    window.loader.setup();
}

function allLoaded() {
    var defaultMap = MAP_MODES[window.user_game_mode];
    window.world = new WORLD_MODES[window.user_game_mode];
    window.gameMode = new GAME_MODES[window.user_game_mode];
    window.stage = new Stage(defaultMap);
    window.stage.setup();
    window.gameState = new GameState(PLAYER_SETTINGS);
    window.world.HDRIIllumination('src/images/fondo.hdr')

    window.hud.setUpStore(descriptionButtonClick);

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'click', (e) => handleClick(e), false );
    document.addEventListener( 'touchend', (e) => handleTouch(e), false );
    document.addEventListener( 'touchstart', (event) => { event.preventDefault() })
    document.getElementById('destroy_btn').addEventListener('click', (e) => destroyTower())
    document.getElementById('upgrade_btn').addEventListener('click', (e) => levelUpTower())

    document.getElementById("ui_button_build").addEventListener( 'touchend', (e)  => {
        purchaseButtonClick(window.hud.tower, e)
    });

    let hordebtn = document.getElementById("horde-btn");
    hordebtn.addEventListener( 'click', () => { window.gameMode.spawnHorde(window.gameMode) });
    hordebtn.addEventListener( 'touchend', () => { window.gameMode.spawnHorde(window.gameMode); });

    mainLoop();
}

function mainLoop() {
    delta = clock.getDelta();
    if (window.gameMode.contextAR) { 
        window.gameMode.contextAR.actualizar();
    }

    if (window.gameState.lives > 0) {

        if (window.gameMode.enemies.length > 0) {
            window.gameMode.enemies.forEach(function(value){
                if (value.spawned) { 
                    value.moveToNextPoint()
                //    value.mixer.update( delta );

                }       
            })
        }
        window.hud.update();
        window.gameState.update();

        if (window.gameMode.towers.length > 0) {
            window.gameMode.towers.forEach(function(value){
                value.checkForEnemies()
                if (value.projectiles.length > 0) {
                    value.projectiles.forEach(function(projValue){
                        projValue.move()
                    });
                }
            })
        }
    }
    window.world.render();
    requestAnimationFrame(mainLoop)
}

function handleTouch(e) {
    e.stopPropagation();
    handleClick(e);
}

function onDocumentMouseMove( event ) {
    if ( event.target.id != "MainCanvas") {
        return;
    }
    // update the mouse variable
    let worldSceneChildren;
    if (event.changedTouches && event.changedTouches.length > 0) {
        mouse.x = ( event.changedTouches[0].clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.changedTouches[0].clientY / window.innerHeight ) * 2 + 1;

    } else {
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    if (window.user_game_mode == GAME_MODE_AR) {
        worldSceneChildren = window.gameMode.marker.children
    } else { 
        worldSceneChildren = window.world.scene.children
    }

    raycaster.setFromCamera( mouse, window.world.camera );
    
    // check if something near mouse
    let tmpIntersect = raycaster.intersectObjects( worldSceneChildren );

    if (tmpIntersect.length > 0) {
        let intersectedObject = tmpIntersect[0].object;
        // If another tile was hovered before this
        if (hoveredTileObj && !hoveredTileObj.selected) {
            setHoveredTile(hoveredTileObj, false)
        } 
        setHoveredTile(intersectedObject)
    } else {
        if (hoveredTileObj && !hoveredTileObj.selected) {
            setHoveredTile(hoveredTileObj, false)
        }

        hoveredTile, hoveredTileObj = false;

    }
}

function setHoveredTile(intersectedObject, hovered) {
    hoveredTile = intersectedObject;
    let hoveredTileObjCoords = window.meshesToObjects[intersectedObject.uuid];

    if (hoveredTileObjCoords) {
        hoveredTileObj = window.stage.getTile(hoveredTileObjCoords.row, hoveredTileObjCoords.column);
        if (hovered) {
            if (hoveredTileObj.interactive && !hoveredTileObj.selected){
                hoveredTileObj.setMaterial(window.TILE_COLORS[HOVERED_TILE_OK]);

            } else if (!hoveredTileObj.selected){
                hoveredTileObj.setMaterial(window.TILE_COLORS[HOVERED_TILE_ERR]);
            }
        } else {
            hoveredTileObj.setMaterial(hoveredTileObj.color);
        }
    }
}

function handleClick(event) {
    if ( event.target.id != "MainCanvas") {
        return;
    }
    console.log("hola")
    event.stopPropagation();
    onDocumentMouseMove(event);
    if (hoveredTileObj) {
        console.log("2222")

        if(hoveredTileObj.interactive) {
            window.hud.hideBuildingMenu();
            window.hud.hideUpgradeMenu();
            if (hoveredTileObj != activeTileObj) {
                if (activeTileObj) {
                    activeTileObj.setSelected(false)
                    activeTileObj.setMaterial(activeTileObj.color);
                };

                if (hoveredTileObj.building) {
                    window.hud.showUpgradeMenu(hoveredTileObj.building);
                } else {
                    window.hud.showBuildingMenu();
                }

                activeTileObj = hoveredTileObj;
                activeTileObj.setMaterial(window.TILE_COLORS[SELECTED_TILE]);
                activeTileObj.setSelected(true);
            } else {
                activeTileObj.setMaterial(activeTileObj.color);
                activeTileObj.setSelected(false)
                activeTileObj = false;
            }
        } else { 
            if (activeTileObj) {
                activeTileObj.setMaterial(activeTileObj.color);
                activeTileObj.setSelected(false)
                activeTileObj = false;
                window.hud.hideUpgradeMenu();
                window.hud.hideBuildingMenu();
            }
            hoveredTileObj.setSelected(false)
            hoveredTileObj = false;
        }
    }
}

function purchaseButtonClick(tower, e) {
    e.stopPropagation()

    if(activeTileObj && !activeTileObj.building) {
        if (window.gameState.gold >= tower.price) {

            activeTileObj.createTower({
                x: activeTileObj.tileX, 
                y: activeTileObj.tileY, 
                tile: { 
                    column: activeTileObj.column, 
                    row: activeTileObj.row 
                },
                ...tower
            });

            window.gameState.gold -= tower.price;
        }
    }
    window.hud.hideBuildingMenu();
     window.hud.showUpgradeMenu(activeTileObj.building);
}

function descriptionButtonClick(tower, e) {
    e.stopPropagation()
    if(activeTileObj && !activeTileObj.building) {
        window.hud.showDescription({
            x: activeTileObj.tileX, 
            y: activeTileObj.tileY, 
            tile: { 
                column: activeTileObj.column, 
                row: activeTileObj.row 
            },
            ...tower
        });
    }
}

function destroyTower() {
    if (activeTileObj && activeTileObj.building) {
        activeTileObj.setMaterial(activeTileObj.color);
        activeTileObj.setSelected(false)
        activeTileObj.destroyBuilding();
        activeTileObj = false;    
        window.hud.hideBuildingMenu();
     }
}

function levelUpTower() {
    if (activeTileObj && activeTileObj.building) {
        var levelPrice = activeTileObj.building.level * 25;

        if (window.gameState.gold >= levelPrice) {
            activeTileObj.building.levelUp();
            window.gameState.gold -= levelPrice;
            window.hud.showUpgradeMenu(hoveredTileObj.building);
        }
     }
}
/* GAME FUNCTIONS */

//init(GAME_MODE_AR)



/* WEB FUNCTIONS */

