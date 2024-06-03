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

function importGridFromJSON(configuration) {
    grid.removeAll();
    console.log('Importing grid from JSON:', configuration);
    for (var key in configuration) {
        var cell = configuration[key];
        var itemHtml = '<div class="square-wrapper"><br><br><label class="slider-label" for="' + key + '">' + key + '</label><input type="range" min="0" max="100" value="50" class="slider" id="' + key + '"></div>';
        grid.addWidget(itemHtml, {w: 2, h: 2, x: cell.x,y: cell.y,id:key ,noResize: true});
    }
    
}

function getControllerNamesAndIds(){
    var controllerList=[];
    var items = grid.engine.nodes;
    items.forEach(function(item){
        controllerList.push({"name":item.id, "id": item.id});
    });
    console.log(controllerList);
    return controllerList;
}

let currentConfiguration = {
    id: null,
    name: null
};