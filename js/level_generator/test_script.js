map = [
    ["X", "X", "X", "X"],
    ["X", "_", "_", "X"],
    ["X", "_", "X", "X"],
    ["X", "_", "_", "X"],
    ["X", "_", "_", "X"],
    ["X", "_", "_", "X"],
    ["X", "_", "_", "X"],
    ["X", "_", "_", "X"],
    ["X", "X", "_", "X"],
    ["X", "X", "X", "X"]
];

searchTree = new AStarTree(2, 1, 2, 8, map);
path = searchTree.buildTree();
console.log("here");
path.forEach(element => {
    console.log("(" + element.x + ", " + element.y + ")");
});