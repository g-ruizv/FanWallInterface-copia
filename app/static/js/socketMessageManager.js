function addControllerSocket(id, controllerName) {
    const message = createMessage(MessageType.CONTROLLER_INFORMATION, {
        id: id,
        name: controllerName
    });
    socket.emit('fanControl', message);
    console.log('Sending message:', message);
}

function getAllControllers() {
    const getControllers = createMessage(MessageType.CONTROLLER_INFORMATION,'get');
    socket.emit('fanControl', getControllers);
}

function setControllerSpeed(speed,id) {
    const message = createMessage(MessageType.COMMAND, {
        id: id,
        speed: speed
    });
    socket.emit('fanControl', message);
    console.log('Sending message:', message);
    
}