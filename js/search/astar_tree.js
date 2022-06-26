class AStarTree {

    constructor(x, y, goal_x, goal_y) {
        this.root = new Node(null, x, y);
        this.queue = [];
        this.goal_x = goal_x;
        this.goal_y = goal_y;
    }

    BuildTree() {
        let found = false;
        while(!found && this.queue.length > 0) {
            
        }
    }

}