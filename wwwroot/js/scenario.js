const legalConceptUri = 'api/legalconcepts';
const scenariosUri = 'api/scenarios';

var scenarioList = null;

// function that runs all necessary initial retrieval.
function init() {
    // Get the first id scenerio from db.
    getScenarioList();
}

// The the list of scenarios available in the database.
function getScenarioList() {
    // call db to get all scenarios.
    fetch(scenariosUri)
        .then(response => response.json())
        .then(data => {
            scenarioList = data;
            var scenarioSelect = document.getElementById("scenarioSelect");

            $.each(data, function (index, value) {
                scenarioSelect.innerHTML +=
                    ('<option value="' + value.id + '">' + value.id + '</option>\n');
            });
        })
        .catch(error => console.error('Unable to get scenarios', error));
}

// get scenario based on id.
function getScenario() {
    const scenarioSelect = document.getElementById('scenarioSelect');

    let selectedId = scenarioSelect.value;

    if (selectedId == 0) {
        var element = document.getElementById("ScenarioText");
        element.innerHTML = null;
        return;
    }

    $.each(scenarioList, function (index, value) {
        if (value.id == selectedId) {
            changeScenarioText(value);
        }
    });
}

// Change the scenario text based on retrieved scenario text from db.
function changeScenarioText(scenario) {
    var scenarioText = document.getElementById("ScenarioText");
    scenarioText.innerHTML = scenario.text;
}

// Default add scenario logic.
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