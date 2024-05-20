socket = io.connect('http://' + document.domain + ':' + location.port);
socket.on('connect', function() {
    console.log('Connected to server');
    socket.emit('my event', {data: 'I\'m connected!'});
});
socket.on('message', function(message) {
    // Handle incoming messages
    console.log('Received message:', message);
});

socket.on('fanId', function(data) {
    var id = data.id;
    console.log('Received ID:', id);

    // Handle ID received, similar to MQTT logic
    if (!controllerIds.includes(id)) {
        controllerIds.push(id);
        console.log(controllerIds);
        updateSliders();
    }
});

