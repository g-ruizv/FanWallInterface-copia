function addControllerSocket(id, controllerName) {
    const message = createMessage(MessageType.CONTROLLER_INFORMATION, {
        id: id,
        name: controllerName
    });
    socket.emit('fanControl', message);
    console.log('Sending message:', message);
}

function getAllControllers() {
    var command = 'get';
    // Crea el mensaje para solicitar la identificación de las placas
    const getControllers = createMessage(MessageType.CONTROLLER_INFORMATION, command);
    socket.emit('fanControl', getControllers);
    console.log("Solicitando IDs a la red...");
}

function startProcedure() {
    var command = 'start';
    const startProcedure = createMessage(MessageType.ACTIVATE, command);
    socket.emit('fanControl', startProcedure);
}

function stopProcedure() {
    var command = 'stop';
    const stopProcedure = createMessage(MessageType.ACTIVATE, command);
    socket.emit('fanControl', stopProcedure);
}

function setControllerSpeed(speed, id) {
    // Actualizar el número en la interfaz
    var label = document.getElementById(`val-${id}`);
    if (label) label.innerText = speed;

    // Enviar el comando al servidor
    const message = createMessage(MessageType.COMMAND, {
        id: id,
        speed: speed
    });
    socket.emit('fanControl', message);
}