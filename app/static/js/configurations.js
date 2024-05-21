function exportGridAsMatrix() {
    var gridMatrix = {};
    var items = grid.engine.nodes;

    items.forEach(function(item) {
        var x = item.x;
        var y = item.y;
        var id = item.id;
        var cell = {x: x, y: y};
        gridMatrix[id] = cell;
    });

    console.log('Grid Matrix:', gridMatrix);
    return gridMatrix;
};

function getControllerNamesAndIds(){
    var controllerList=[];
    var items = grid.engine.nodes;
    items.forEach(function(item){
        controllerList.push({"name":item.id, "id": item.id});
    });
    console.log(controllerList);
    return controllerList;
}