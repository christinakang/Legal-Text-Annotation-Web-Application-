const legalConceptUri = 'api/legalconcepts';
const scenariosUri = 'api/scenarios';

// function to get scenario based on id.

function getScenario(id) {
    fetch(`${scenariosUri}/${id}`)
        .then(response => response.json())
        .then(data => changeScenarioText(data))
        .catch(error => console.error('Unable to get scenario ${id}', error));
}

function changeScenarioText(data) {
    var element = document.getElementById("ScenarioText");
    element.innerHTML = data.text;
}

function addScenario() {
    const addNameTextbox = document.getElementById('add-name');

    const item = {
        isComplete: false,
        name: addNameTextbox.value.trim()
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}

// function to get selected text.
function getSelectedText() {
    if (window.getSelection) {
        txt = window.getSelection();
    } else if (window.document.getSelection) {
        txt = window.document.getSelection();
    } else if (window.document.selection) {
        txt = window.document.selection.createRange().text;
    }
    return txt;
}

// function to do something with selected text.
function doSomethingWithSelectedText() {
    var selectedText = getSelectedText();
    if (selectedText) {
        // Do something.
    }
}