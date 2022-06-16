let tiles = []
let sizeX = 20;
let sizeY = 20;

function renderDungeon(map) {
    myGameArea.start(map[0].length, map.length);
    myGameArea.empty();
    loadMap(map);
}

function loadMap(map) {
    for(let i = 0; i < map.length; i++) {
        for(let j = 0; j < map[i].length; j++) {
            // check if empty
            let tile;
            if(map[i][j] == "_") {
                tile = new component(sizeX, sizeY, "images/dunGen/empty.png", j*sizeY, i*sizeX, "image");
                tiles.push(tile);
            } else if(map[i][j] == "X" && i < map.length - 1 && map[i+1][j] == "_") {
                tile = new component(sizeX, sizeY, "images/dunGen/wall.png", j*sizeY, i*sizeX, "image");
                tiles.push(tile);
            }
            else if(map[i][j] == "X" && i < map.length - 1) {
                tile = new component(sizeX, sizeY, "images/dunGen/wall_filler.png", j*sizeY, i*sizeX, "image");
                tiles.push(tile);
            }
            else if(map[i][j] == "X" && i == map.length - 1) {
                tile = new component(sizeX, sizeY, "images/dunGen/wall.png", j*sizeY, i*sizeX, "image");
                tiles.push(tile);
            }
        }
    }
}

var myGameArea = {
    canvas : document.getElementById("game-canvas"),
    start : function(mapLength, mapHeight) {
        this.canvas.width = sizeX * mapLength;
        this.canvas.height = sizeY * mapHeight;
        this.context = this.canvas.getContext("2d");
        this.interval = setInterval(updateGameArea, 50);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    empty: function() {
        tiles = [];
        updateGameArea();
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
      this.image = new Image();
      this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function() {
      ctx = myGameArea.context;
      if (type == "image") {
        ctx.drawImage(this.image,
          this.x,
          this.y,
          this.width, this.height);
      } else {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }
}
function updateGameArea() {
    myGameArea.clear();
    tiles.forEach(tile => {
        tile.update();
    });
}