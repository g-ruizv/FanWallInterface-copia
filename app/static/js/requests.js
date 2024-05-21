function addController(id, controllerName) {
    const postData = {
        name: controllerName
    };

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
}

function addMultipleControllers() {
    controllerList = getControllerNamesAndIds();
    console.log(controllerList);
    const postData = { "controllers": [] }
    controllerList.forEach(element => {
        let newController = {"name": element.name, "id": element.id};
        postData.controllers.push(newController);
    });
    fetch(`/api/v1/fanWall/addMultipleControllers`, {
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
}

function createConfiguration(id, configurationName){
    const postData = {
        name: configurationName
    };
    fetch(`/api/v1/fanWall/configurations/${id}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({name: configurationName})
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
}

function saveConfiguration(){
    console.log('Saving configuration...');
    configurationName= document.getElementById('newConfigurationNameInputBox').value;
    id = null;
    const configurationMatrix = exportGridAsMatrix();
    const postData = {
        name: configurationName,
        controllers: configurationMatrix
    };

    fetch(`/api/v1/fanWall/configurations/create_with_controllers`, {
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
}

function updateConfiguration(configurationId){
    console.log('Updating configuration...');
    const configurationMatrix = exportGridAsMatrix();
    const postData = {
        controllers: configurationMatrix
    };

    fetch(`/api/v1/fanWall/configurations/${configurationId}/controllers`, {
        method: 'PATCH',
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
}