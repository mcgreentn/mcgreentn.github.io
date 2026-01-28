const DUNGEN_GAME_CONFIG = {
    maxHp: 10,
    startHp: 10,
    chaseRange: 5
};

const DUNGEN_MONSTER_STATS = {
    M: { name: "Goblin", hp: 1, damage: 1 },
    R: { name: "Wizard", hp: 1, damage: 1 },
    b: { name: "Blob", hp: 1, damage: 1 },
    o: { name: "Ogre", hp: 2, damage: 2 },
    m: { name: "Minitaur", hp: 10, damage: 1 }
};

class DunGenGame {
    constructor(map) {
        this.reset(map);
    }

    reset(map) {
        this.rawMap = map;
        this.width = map[0].length;
        this.height = map.length;
        this.baseMap = map.map(row => row.map(cell => (cell === "X" ? "X" : "_")));
        this.items = [];
        this.monsters = [];
        this.portals = [];
        this.exit = null;
        this.player = null;
        this.turn = 0;
        this.treasures = 0;
        this.status = "Press Play to start.";
        this.isRunning = false;

        this.parseMap(map);
        this.updateHUD();
    }

    resetLevel() {
        this.reset(this.rawMap);
        this.render();
    }

    parseMap(map) {
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                const cell = map[y][x];
                if (cell === "H") {
                    this.player = { x, y, hp: DUNGEN_GAME_CONFIG.startHp };
                } else if (cell === "e") {
                    this.exit = { x, y };
                } else if (cell === "P" || cell === "T" || cell === "t") {
                    this.items.push({ type: cell, x, y });
                } else if (cell === "p") {
                    this.portals.push({ x, y });
                } else if (cell in DUNGEN_MONSTER_STATS) {
                    const stats = DUNGEN_MONSTER_STATS[cell];
                    this.monsters.push({
                        type: cell,
                        x,
                        y,
                        hp: stats.hp,
                        damage: stats.damage
                    });
                }
            }
        }
    }

    destroy() {
    }

    start() {
        if (!this.player) return;
        this.isRunning = true;
        this.status = "Running.";
        this.updateHUD();
    }

    pause() {
        this.isRunning = false;
        this.status = "Paused.";
        this.updateHUD();
    }

    attemptMove(dx, dy) {
        if (!this.isRunning || !this.player || this.isOver()) return;
        const nx = this.player.x + dx;
        const ny = this.player.y + dy;
        if (!this.inBounds(nx, ny) || this.isWall(nx, ny)) {
            this.status = "Bumped into a wall.";
            this.updateHUD();
            return;
        }

        const monster = this.getMonsterAt(nx, ny);
        if (monster) {
            monster.hp -= 1;
            this.player.hp = Math.max(0, this.player.hp - monster.damage);
            this.status = `You struck the ${DUNGEN_MONSTER_STATS[monster.type].name}.`;
            if (monster.hp <= 0) {
                this.monsters = this.monsters.filter(m => m !== monster);
                this.status = `Defeated the ${DUNGEN_MONSTER_STATS[monster.type].name}.`;
            }
        } else {
            this.player.x = nx;
            this.player.y = ny;
            this.resolveTile(nx, ny);
        }

        this.turn += 1;
        this.enemyTurn();
        this.checkEndState();
        this.render();
        this.updateHUD();
    }

    resolveTile(x, y) {
        const item = this.getItemAt(x, y);
        if (item) {
            if (item.type === "P") {
                this.player.hp = Math.min(DUNGEN_GAME_CONFIG.maxHp, this.player.hp + 1);
                this.status = "Drank a potion.";
            } else if (item.type === "T") {
                this.treasures += 1;
                this.status = "Found treasure.";
            } else if (item.type === "t") {
                this.player.hp = Math.max(0, this.player.hp - 1);
                this.status = "Hit a trap!";
            }
            this.items = this.items.filter(i => i !== item);
        }

        const portal = this.getPortalAt(x, y);
        if (portal && this.portals.length === 2) {
            const other = this.portals[0].x === portal.x && this.portals[0].y === portal.y
                ? this.portals[1]
                : this.portals[0];
            this.player.x = other.x;
            this.player.y = other.y;
            this.status = "Teleported.";
        }
    }

    enemyTurn() {
        this.monsters.forEach(monster => {
            if (this.isOver()) return;
            const dist = this.manhattan(monster.x, monster.y, this.player.x, this.player.y);

            if (monster.type === "R" && this.hasLineOfSight(monster.x, monster.y, this.player.x, this.player.y)) {
                if (typeof addFireballEffect === "function") {
                    addFireballEffect(monster.x, monster.y, this.player.x, this.player.y);
                }
                this.player.hp = Math.max(0, this.player.hp - monster.damage);
                this.status = "A wizard zapped you.";
                return;
            }

            let move = null;
            if (dist <= DUNGEN_GAME_CONFIG.chaseRange) {
                move = this.stepToward(monster.x, monster.y, this.player.x, this.player.y);
            }
            if (!move) {
                move = this.randomStep(monster.x, monster.y);
            }

            if (move) {
                const nx = monster.x + move.x;
                const ny = monster.y + move.y;
                if (nx === this.player.x && ny === this.player.y) {
                    this.player.hp = Math.max(0, this.player.hp - monster.damage);
                    this.status = "A monster hit you.";
                } else if (!this.getMonsterAt(nx, ny) && !this.isWall(nx, ny)) {
                    monster.x = nx;
                    monster.y = ny;
                }
            }
        });
    }

    checkEndState() {
        if (this.player.hp <= 0) {
            this.status = "Defeated.";
            this.isRunning = false;
        } else if (this.exit && this.player.x === this.exit.x && this.player.y === this.exit.y) {
            this.status = "Escaped the dungeon!";
            this.isRunning = false;
        }
    }

    isOver() {
        return !this.isRunning || this.player.hp <= 0;
    }

    render() {
        renderGame({
            width: this.width,
            height: this.height,
            baseMap: this.baseMap,
            items: [...this.items, ...this.portals.map(p => ({ type: "p", x: p.x, y: p.y }))],
            monsters: this.monsters,
            player: this.player,
            exit: this.exit
        });
    }

    updateHUD() {
        const hpEl = document.getElementById("hud-hp");
        const turnEl = document.getElementById("hud-turns");
        const treasureEl = document.getElementById("hud-treasure");
        const statusEl = document.getElementById("hud-status");

        if (hpEl) hpEl.textContent = this.player ? this.player.hp : "-";
        if (turnEl) turnEl.textContent = this.turn;
        if (treasureEl) treasureEl.textContent = this.treasures;
        if (statusEl) statusEl.textContent = this.status;
    }

    inBounds(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    isWall(x, y) {
        return this.baseMap[y][x] === "X";
    }

    getMonsterAt(x, y) {
        return this.monsters.find(monster => monster.x === x && monster.y === y) || null;
    }

    getItemAt(x, y) {
        return this.items.find(item => item.x === x && item.y === y) || null;
    }

    getPortalAt(x, y) {
        return this.portals.find(portal => portal.x === x && portal.y === y) || null;
    }

    manhattan(ax, ay, bx, by) {
        return Math.abs(ax - bx) + Math.abs(ay - by);
    }

    randomStep(x, y) {
        const candidates = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 }
        ];
        for (let i = candidates.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
        }

        for (const move of candidates) {
            const nx = x + move.x;
            const ny = y + move.y;
            if (this.inBounds(nx, ny) && !this.isWall(nx, ny) && !this.getMonsterAt(nx, ny)) {
                return move;
            }
        }
        return null;
    }

    stepToward(x, y, tx, ty) {
        const options = [
            { x: Math.sign(tx - x), y: 0 },
            { x: 0, y: Math.sign(ty - y) }
        ];
        for (const move of options) {
            const nx = x + move.x;
            const ny = y + move.y;
            if (move.x === 0 && move.y === 0) continue;
            if (this.inBounds(nx, ny) && !this.isWall(nx, ny) && !this.getMonsterAt(nx, ny)) {
                return move;
            }
        }
        return null;
    }

    hasLineOfSight(x, y, tx, ty) {
        if (x !== tx && y !== ty) return false;
        if (x === tx) {
            const step = Math.sign(ty - y);
            for (let cy = y + step; cy !== ty; cy += step) {
                if (this.isWall(x, cy)) return false;
            }
        } else {
            const step = Math.sign(tx - x);
            for (let cx = x + step; cx !== tx; cx += step) {
                if (this.isWall(cx, y)) return false;
            }
        }
        return true;
    }

}

function initDunGenGame(map) {
    if (window.dunGenGame) {
        window.dunGenGame.destroy();
    }
    window.dunGenGame = new DunGenGame(map);
    window.dunGenGame.render();
    window.dunGenGame.updateHUD();
}

document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById("game-play");
    const stepButton = document.getElementById("game-step");
    const resetButton = document.getElementById("game-reset");
    const canvas = document.getElementById("game-canvas");
    const generateTab = document.getElementById("dungen-generate-tab");
    const playTab = document.getElementById("dungen-play-tab");
    const generatePane = document.getElementById("dungen-generate");
    const playPane = document.getElementById("dungen-play");

    const setDunGenTab = (mode) => {
        const isGenerate = mode === "generate";
        if (generateTab) {
            generateTab.classList.toggle("active", isGenerate);
            generateTab.setAttribute("aria-selected", isGenerate ? "true" : "false");
        }
        if (playTab) {
            playTab.classList.toggle("active", !isGenerate);
            playTab.setAttribute("aria-selected", isGenerate ? "false" : "true");
        }
        if (generatePane) {
            generatePane.classList.toggle("show", isGenerate);
            generatePane.classList.toggle("active", isGenerate);
        }
        if (playPane) {
            playPane.classList.toggle("show", !isGenerate);
            playPane.classList.toggle("active", !isGenerate);
        }
    };

    if (playButton) {
        playButton.addEventListener("click", async () => {
            if (!window.dunGenGame) {
                if (window.map) {
                    initDunGenGame(window.map);
                } else if (typeof triggerGeneration === "function") {
                    await triggerGeneration();
                }
            }
            if (window.dunGenGame) {
                window.dunGenGame.start();
            }
            if (canvas) {
                canvas.focus();
            }
        });
    }
    if (generateTab) {
        generateTab.addEventListener("click", () => setDunGenTab("generate"));
    }
    if (playTab) {
        playTab.addEventListener("click", () => setDunGenTab("play"));
    }
    if (stepButton) {
        stepButton.addEventListener("click", () => {
            if (window.dunGenGame) {
                window.dunGenGame.start();
                window.dunGenGame.attemptMove(0, 0);
            }
        });
    }
    if (resetButton) {
        resetButton.addEventListener("click", () => {
            if (window.dunGenGame) {
                window.dunGenGame.resetLevel();
            }
        });
    }
    document.addEventListener("keydown", (event) => {
        if (!window.dunGenGame || !window.dunGenGame.isRunning) return;
        const tag = event.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        let dx = 0;
        let dy = 0;
        if (event.key === "ArrowUp" || event.key === "w") dy = -1;
        if (event.key === "ArrowDown" || event.key === "s") dy = 1;
        if (event.key === "ArrowLeft" || event.key === "a") dx = -1;
        if (event.key === "ArrowRight" || event.key === "d") dx = 1;
        if (dx !== 0 || dy !== 0) {
            event.preventDefault();
            window.dunGenGame.attemptMove(dx, dy);
        }
    });
});
