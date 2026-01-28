let tiles = [];
let sizeX = 20;
let sizeY = 20;
let effects = [];

const DUNGEN_SPRITES = {
    wall: "images/dunGen/wall.png",
    wallFiller: "images/dunGen/wall_filler.png",
    empty: "images/dunGen/empty.png",
    hero: "images/dunGen/hero.png",
    exit: "images/dunGen/exit.png",
    portal: "images/dunGen/portal.png",
    potion: "images/dunGen/potion.png",
    treasure: "images/dunGen/chest.png",
    trap: "images/dunGen/trap.png",
    goblin: "images/dunGen/goblin_armored.png",
    wizard: "images/dunGen/goblin_mage.png",
    blob: "images/dunGen/blob_green.png",
    ogre: "images/dunGen/ogre_poor.png",
    minitaur: "images/dunGen/minitaur.png"
};

function renderDungeon(map) {
    const state = mapToRenderState(map);
    renderGame(state);
}

function mapToRenderState(map) {
    const baseMap = map.map(row => row.map(cell => (cell === "X" ? "X" : "_")));
    const items = [];
    const monsters = [];
    let player = null;
    let exit = null;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const cell = map[y][x];
            if (cell === "H") {
                player = { x, y };
            } else if (cell === "e") {
                exit = { x, y };
            } else if (cell === "P" || cell === "T" || cell === "t" || cell === "p") {
                items.push({ type: cell, x, y });
            } else if (cell === "M" || cell === "R" || cell === "b" || cell === "o" || cell === "m") {
                monsters.push({ type: cell, x, y });
            }
        }
    }

    return {
        width: map[0].length,
        height: map.length,
        baseMap,
        items,
        monsters,
        player,
        exit
    };
}

function renderGame(state) {
    myGameArea.start(state.width, state.height);
    tiles = [];

    for (let y = 0; y < state.baseMap.length; y++) {
        for (let x = 0; x < state.baseMap[y].length; x++) {
            const cell = state.baseMap[y][x];
            let sprite = DUNGEN_SPRITES.empty;
            if (cell === "X") {
                const isTopWall = y < state.baseMap.length - 1 && state.baseMap[y + 1][x] !== "X";
                sprite = isTopWall ? DUNGEN_SPRITES.wall : DUNGEN_SPRITES.wallFiller;
            }
            tiles.push(new component(sizeX, sizeY, sprite, x * sizeY, y * sizeX, "image"));
        }
    }

    if (state.exit) {
        tiles.push(new component(sizeX, sizeY, DUNGEN_SPRITES.exit, state.exit.x * sizeY, state.exit.y * sizeX, "image"));
    }

    if (state.items) {
        state.items.forEach(item => {
            const sprite = item.type === "P"
                ? DUNGEN_SPRITES.potion
                : item.type === "T"
                ? DUNGEN_SPRITES.treasure
                : item.type === "t"
                ? DUNGEN_SPRITES.trap
                : DUNGEN_SPRITES.portal;
            tiles.push(new component(sizeX, sizeY, sprite, item.x * sizeY, item.y * sizeX, "image"));
        });
    }

    if (state.monsters) {
        state.monsters.forEach(monster => {
            const sprite = monster.type === "M"
                ? DUNGEN_SPRITES.goblin
                : monster.type === "R"
                ? DUNGEN_SPRITES.wizard
                : monster.type === "b"
                ? DUNGEN_SPRITES.blob
                : monster.type === "o"
                ? DUNGEN_SPRITES.ogre
                : DUNGEN_SPRITES.minitaur;
            tiles.push(new component(sizeX, sizeY, sprite, monster.x * sizeY, monster.y * sizeX, "image"));
        });
    }

    if (state.player) {
        tiles.push(new component(sizeX, sizeY, DUNGEN_SPRITES.hero, state.player.x * sizeY, state.player.y * sizeX, "image"));
    }

    updateGameArea();
}

var myGameArea = {
    canvas: document.getElementById("game-canvas"),
    start: function (mapLength, mapHeight) {
        this.canvas.width = sizeX * mapLength;
        this.canvas.height = sizeY * mapHeight;
        this.context = this.canvas.getContext("2d");
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.interval = setInterval(updateGameArea, 50);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    empty: function () {
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
    this.update = function () {
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
    drawEffects();
}

function addFireballEffect(startX, startY, targetX, targetY) {
    const now = performance.now();
    effects.push({
        type: "fireball",
        sx: startX,
        sy: startY,
        tx: targetX,
        ty: targetY,
        start: now,
        duration: 240
    });
}

function drawEffects() {
    if (!effects.length) return;
    const now = performance.now();
    effects = effects.filter(effect => now - effect.start <= effect.duration);
    effects.forEach(effect => {
        if (effect.type !== "fireball") return;
        const progress = Math.min(1, (now - effect.start) / effect.duration);
        const sx = effect.sx * sizeY + sizeY / 2;
        const sy = effect.sy * sizeX + sizeX / 2;
        const tx = effect.tx * sizeY + sizeY / 2;
        const ty = effect.ty * sizeX + sizeX / 2;
        const cx = sx + (tx - sx) * progress;
        const cy = sy + (ty - sy) * progress;
        const ctx = myGameArea.context;

        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = "#ff6b3d";
        ctx.beginPath();
        ctx.arc(cx, cy, 4 + 3 * (1 - progress), 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.6;
        ctx.strokeStyle = "#ffb347";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(cx, cy);
        ctx.stroke();
        ctx.restore();
    });
}
