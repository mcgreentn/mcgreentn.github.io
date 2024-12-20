class AStarTree {

    constructor(x, y, goal_x, goal_y, map) {
        this.root = new Node(null, x, y, 0, goal_x, goal_y);
        this.queue = [];
        this.goal_x = goal_x;
        this.goal_y = goal_y;
        this.map = map;
        this.visited = []
    }

    buildTree() {
        let found = false;
        this.root.estimate = this.root.calcHeuristic();

        this.queue.push(this.root)
        let current = this.root;
        while (!found && this.queue.length > 0 && this.queue.length < 1000) {
            current = this.queue[0];
            this.visited.push(current);
            this.queue.shift();
            if (current.x == this.goal_x && current.y == this.goal_y) {
                found = true;
            } else {
                this.generateChildren(current);
            }
            this.reprioritize(this.queue);
        }

        let path = this.generatePath(current);

        return path;


    }

    generatePath(node) {
        let current = node;
        let path = []

        path.push(current);
        while (current.parent != null) {
            current = current.parent;
            path.push(current);
        }
        return path.reverse();
    }

    reprioritize(array) {
        array.sort(
            function (a, b) {
                return a.f - b.f;
            }
        );
    }
    generateChildren(node) {
        const x = node.x;
        const y = node.y;
        if (y + 1 < this.map.length && this.map[y + 1][x] != "X") {
            let child = new Node(node, x, y + 1, node.cost + 1, this.goal_x, this.goal_y)
            if (!this.findNode(this.queue, node) && !this.findNode(this.visited, node)) {
                child.calcHeuristic();
                this.queue.push(child);
                // console.log("y+1 queued");
            }
        }
        if (y - 1 >= 0 && this.map[y - 1][x] != "X") {
            let child = new Node(node, x, y - 1, node.cost + 1, this.goal_x, this.goal_y)
            if (!this.findNode(this.queue, node) && !this.findNode(this.visited, node)) {
                child.calcHeuristic();
                this.queue.push(child);
                // console.log("y-1 queued");
            }
        }
        if (x + 1 < this.map[0].length && this.map[y][x + 1] != "X") {
            let child = new Node(node, x + 1, y, node.cost + 1, this.goal_x, this.goal_y)
            if (!this.findNode(this.queue, node) && !this.findNode(this.visited, node)) {
                child.calcHeuristic();
                this.queue.push(child);
                // console.log("x+1 queued");
            }
        }
        if (x - 1 >= 0 && this.map[y][x - 1] != "X") {
            let child = new Node(node, x - 1, y, node.cost + 1, this.goal_x, this.goal_y)
            if (!this.findNode(this.queue, node) && !this.findNode(this.visited, node)) {
                child.calcHeuristic();
                this.queue.push(child);
                // console.log("x-1 queued");
            }
        }
    }

    findNode(array, node) {
        array.forEach(element => {
            if (node.checkEquals(element)) {
                return true;
            }
        });
        return false;
    }

}