function startProcedure() {
    var command = 'start';
    var message = new Paho.MQTT.Message(command);
    message.destinationName = 'fanWall/wall/control';
    mqttClient.send(message);
    //const startProcedure = createMessage(MessageType.COMMAND, command);
    //socket.emit('fanControl', startProcedure);
}


