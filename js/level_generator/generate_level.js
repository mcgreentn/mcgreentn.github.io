$(document).ready(function() {

	$('#generateLevel').click(function() {
        let rangeHeight = document.getElementById('range-height');
        let rangeWidth = document.getElementById('range-width');
        let rangeOpeness = document.getElementById('range-openess');
        map = generate([rangeWidth.value, rangeHeight.value, rangeOpeness.value], []);
        // renderMap(map);
        renderDungeon(map);
    })
})


function generate(map_limits, element_limits) {
    dg = new DiggerGenerator();
    dg.generateMap(map_limits[0], map_limits[1], map_limits[2])
    let map = dg.map;
    return map;
}


function renderMap(map) {
    container = document.getElementById('ascii-dungeon-canvas');
    let mapString = "";
    for(let i = 0; i < map.length; i++) {
        for(let j = 0; j < map[i].length; j++) {
            mapString = mapString.concat(map[i][j]);
        }
        mapString = mapString.concat("<br>");
    }
    container.innerHTML = mapString;
    console.log(mapString);
}

