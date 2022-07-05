class Node{

    constructor(parent, x, y, cost, goal_x, goal_y) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.children = [];
        this.cost = cost;
        this.goal_x = goal_x;
        this.goal_y = goal_y;
        this.estimate = this.calcHeuristic();
        this.f = this.cost + this.estimate;
    }

    calcHeuristic() {
        return Math.abs(this.goal_x - this.x) + Math.abs(this.goal_y - this.y);
    }

    checkEquals(other) {
        if (this.x == other.x && this.y == other.y) {
            return true;
        } else {
            return false;
        }
    }

}