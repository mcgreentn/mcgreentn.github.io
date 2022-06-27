class Node{

    constructor(parent, x, y, cost, goal_x, goal_y, visited=false) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.children = [];
        this.cost = cost
        this.estimate = this.Heuristic(goal_x, goal_y);
        this.f = this.cost + this.estimate;
        this.visited = visited;
    }

    calcHeuristic() {
        return Math.abs(this.goal_x - this.x) + Math.abs(this.goal_y - this.y);
    }

    equals(other) {

    }

}