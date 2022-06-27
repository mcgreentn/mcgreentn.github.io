class AStarTree {

    constructor(x, y, goal_x, goal_y, map) {
        this.root = new Node(null, x, y, 0, goal_x, goal_y, true);
        this.queue = [];
        this.goal_x = goal_x;
        this.goal_y = goal_y;
        this.map = map;
    }

    buildTree() {
        let found = false;
        this.root.estimate = this.root.calcHeurstic();
        while(!found && this.queue.length > 0) {

        }
    }

    generateChildren(node) {
        children = []
        if (x+1 < this.map.length && this.map[node.x+1][node.y] == "_"){
            child = new Node(node, node.x+1, node.y, this.goal_x, this.goal_y, visited=True)
        } 
        else if (x - 1 >= 0 && this.map[node.x-1][node.y] == "_") {
            child = new Node(node, node.x+1, node.y, this.goal_x, this.goal_y, visited=True)
        } 
        else if (y + 1 < this.map[0].length && this.map[node.x][node.y+1] == "_") {

        }
        else if (y - 1 >= 0 && this.map[node.x][node.y-1] == "_") {

        }
    }
    
}