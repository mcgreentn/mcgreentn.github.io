class AStarTree {

    constructor(x, y, goal_x, goal_y, map) {
        this.root = new Node(null, x, y, 0, goal_x, goal_y, true);
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
        while(!found && this.queue.length > 0) {
            current = this.queue[0];
            this.visited.push(current);
            this.queue.shift();
            if (current.x == this.goal_x && current.y == this.goal_y) {
                found = true;
                console.log("found!")
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
        while(current.parent != null) {
            current = current.parent;
            path.push(current);    
        }
        return path.reverse();
    }

    reprioritize(array) {
        array.sort(
            function(a, b) {
                return a.f - b.f;
            }
        ); 
    }
    generateChildren(node) {
        if (node.y+1 < this.map.length && this.map[node.y+1][node.x] != "X"){
            let child = new Node(node, node.x, node.y+1, this.goal_x, this.goal_y)
            console.log(this.findNode(this.queue, node));
            if (!this.findNode(this.queue, node) && !this.findNode(this.visited, node)) {
                child.calcHeuristic();
                this.queue.push(child);
                // console.log("y+1 queued");
            }
        } 
        if (node.y - 1 >= 0 && this.map[node.y-1][node.x] != "X") {
            let child = new Node(node, node.x, node.y-1, this.goal_x, this.goal_y)
            if (!this.findNode(this.queue, node) && !this.findNode(this.visited, node)) {
                child.calcHeuristic();
                this.queue.push(child);
                // console.log("y-1 queued");
            }
        } 
        if (node.x + 1 < this.map[0].length && this.map[node.y][node.x+1] != "X") {
            let child = new Node(node, node.x+1, node.y, this.goal_x, this.goal_y)
            if (!this.findNode(this.queue, node) && !this.findNode(this.visited, node)) {
                child.calcHeuristic();
                this.queue.push(child);
                // console.log("x+1 queued");
            }
        }
        if (node.x - 1 >= 0 && this.map[node.y][node.x-1] != "X") {
            let child = new Node(node, node.x-1, node.y, this.goal_x, this.goal_y)
            if (!this.findNode(this.queue, node) && !this.findNode(this.visited, node)) {
                child.calcHeuristic();
                this.queue.push(child);
                // console.log("x-1 queued");
            }
        }
    }

    findNode(array, node) {
        array.forEach(element => {
            if (node.equals(element)) {
                return true;
            }
        });
        return false;
    }
    
}