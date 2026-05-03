var mqttClient = new Paho.MQTT.Client('broker.emqx.io', 8084, 'web-client-' + Math.random().toString(16).substr(2, 8));

mqttClient.onConnectionLost = function (responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log('Connection lost: ' + responseObject.errorMessage);
    }
};

mqttClient.onMessageArrived = function (message) {
    // Update status on message arrival
    document.getElementById('status').innerText = message.payloadString;
};

var options = {
    useSSL: true,
    timeout: 3,
    onSuccess: onConnect,
    onFailure: onConnectionLost,
}

mqttClient.connect(options);

function onConnect() {
    console.log('Connected to HiveMQ broker');
    mqttClient.subscribe('fanWall/wall/control');
    mqttClient.subscribe('fanWall/wall/status');
    mqttClient.subscribe('fanWall/wall/id');
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log('Connection lost: ' + responseObject.errorMessage);
    }
}

