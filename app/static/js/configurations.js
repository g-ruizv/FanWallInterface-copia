window.exportGridAsMatrix = function() {
    var gridMatrix = [];
    var items = grid.engine.nodes;

    items.forEach(function(item) {
        var x = item.x;
        var y = item.y;
        var id = item.id;
        var cell = { id: id, x: x, y: y};
        gridMatrix.push(cell);
    });

    console.log('Grid Matrix:', gridMatrix);
    fetch(`/api/v1/fanWall/controllers/${id}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    })
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Response from server:', data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

};