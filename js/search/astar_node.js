class Node{
    constructor(parent, x, y, cost, goal_x, goal_y) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.children = [];
        this.cost = cost
        this.estimate = this.Heuristic(goal_x, goal_y);
        this.f = this.cost + this.estimate;
    }

    Heuristic(goal_x, goal_y) {
        return Math.abs(goal_x - x) + Math.abs(goal_y - y);
    }
}