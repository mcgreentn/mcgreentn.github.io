let moreControlsToggle = false;
triggerGeneration();

$(document).ready(function () {

    $('#generate-level').click(async function () {

        triggerGeneration();
    });

    $('#more-controls').click(function() {

        let moreControls = document.getElementById('more-controls');
        if (moreControlsToggle) {
            moreControls.innerHTML = "More Controls";
        } else {
            moreControls.innerHTML = "Less Controls";
        }
        moreControlsToggle = !moreControlsToggle;
    });
})

async function triggerGeneration() {
    let spinner = document.getElementById('dunGenSpinner');
    spinner.style.display = "block";
    let gameScreen = document.getElementById('dungeon-canvas');
    gameScreen.style.display = "none";
    let rangeHeight = document.getElementById('range-height').value;
    let rangeWidth = document.getElementById('range-width').value;
    let rangeOpeness = document.getElementById('range-openess').value;
    let maxGoblins = document.getElementById('range-goblins').value;
    let maxWizards = document.getElementById('range-wizards').value;
    let maxBlobs = document.getElementById('range-blobs').value;
    let maxOgres = document.getElementById('range-ogres').value;
    let maxMinitaurs = document.getElementById('range-minitaurs').value;
    let maxPotions = document.getElementById('range-potions').value;
    let maxTreasures = document.getElementById('range-treasures').value;
    let maxPortals = document.getElementById('range-portals').value;
    map = generate([rangeWidth, rangeHeight, rangeOpeness]);
    map = furnish(map, [maxGoblins, maxWizards, maxBlobs, maxOgres, maxMinitaurs, maxPotions, maxTreasures, maxPortals]);
    // renderMap(map);
    renderDungeon(map);
    await new Promise(resolve => setTimeout(resolve, 250));
    spinner.style.display = "none";
    gameScreen.style.display = "block";
}

function generate(map_limits) {
    dg = new DiggerGenerator();
    dg.generateMap(map_limits[0], map_limits[1], map_limits[2])
    let map = dg.map;
    return map;
}

function furnish(map, element_limits) {
    cf = new ConstrainFurnisher(map);
    cf.GenerateMap(element_limits);
    newMap = cf.Map;
    return newMap;
}


function renderMap(map) {
    container = document.getElementById('ascii-dungeon-canvas');
    let mapString = "";
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            mapString = mapString.concat(map[i][j]);
        }
        mapString = mapString.concat("<br>");
    }
    container.innerHTML = mapString;
    // console.log(mapString);
}

