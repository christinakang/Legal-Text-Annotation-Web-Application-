const legalConceptUri = 'api/legalconcepts';
const scenariosUri = 'api/scenarios';

var scenarioList = null;

// An example annotation we'll add/remove via JavaScript
var myAnnotation = {
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    'id': 'https://www.example.com/recogito-js-example/foo',
    'type': 'Annotation',
    'body': [{
        'type': 'TextualBody',
        'value': 'This annotation was added via JS.'
    }],
    'target': {
        'selector': [{
            'type': 'TextQuoteSelector',
            'exact': 'that ingenious hero'
        }, {
            'type': 'TextPositionSelector',
            'start': 38,
            'end': 57
        }]
    }
};

(function () {
    // Intialize Recogito
    var r = Recogito.init({
        content: 'content', // Element id or DOM node to attach to
        locale: 'auto',
        allowEmpty: true,
        widgets: [
            { widget: 'COMMENT' },
            { widget: 'TAG', vocabulary: ['Place', 'Person', 'Event', 'Organization', 'Animal'] }
        ],
        relationVocabulary: ['isRelated', 'isPartOf', 'isSameAs ']
    });

    r.loadAnnotations('annotations.w3c.json')
        .then(() => console.log('loaded'));

    r.on('selectAnnotation', function (a) {
        console.log('selected', a);
    });

    r.on('createAnnotation', function (a) {
        console.log('created', a);
    });

    r.on('updateAnnotation', function (annotation, previous) {
        console.log('updated', previous, 'with', annotation);
    });

    r.on('cancelSelected', function (annotation) {
        console.log('cancel', annotation);
    });

    // Wire the Add/Update/Remove buttons
    document.getElementById('add-annotation').addEventListener('click', function () {
        r.addAnnotation(myAnnotation);
    });

    document.getElementById('update-annotation').addEventListener('click', function () {
        r.addAnnotation(Object.assign({}, myAnnotation, {
            'body': [{
                'type': 'TextualBody',
                'value': 'This annotation was added via JS, and has been updated now.'
            }],
            'target': {
                'selector': [{
                    'type': 'TextQuoteSelector',
                    'exact': 'ingenious hero who'
                }, {
                    'type': 'TextPositionSelector',
                    'start': 43,
                    'end': 61
                }]
            }
        }));
    });

    document.getElementById('remove-annotation').addEventListener('click', function () {
        r.removeAnnotation(myAnnotation);
    });

    document.getElementById('select-annotation').addEventListener('click', function () {
        r.selectAnnotation('#d7197c87-b45d-4217-9c4f-27573030448f');
    });

    // Switch annotation mode (annotation/relationships)
    var annotationMode = 'ANNOTATION'; // or 'RELATIONS'

    var toggleModeBtn = document.getElementById('toggle-mode');
    toggleModeBtn.addEventListener('click', function () {
        if (annotationMode === 'ANNOTATION') {
            toggleModeBtn.innerHTML = 'MODE: RELATIONS';
            annotationMode = 'RELATIONS';
        } else {
            toggleModeBtn.innerHTML = 'MODE: ANNOTATION';
            annotationMode = 'ANNOTATION';
        }

        r.setMode(annotationMode);
    });
})();

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

//// function to get selected text.
//function getSelectedText() {
//    if (window.getSelection) {
//        txt = window.getSelection();
//    } else if (window.document.getSelection) {
//        txt = window.document.getSelection();
//    } else if (window.document.selection) {
//        txt = window.document.selection.createRange().text;
//    }
//    return txt;
//}

//// function to do something with selected text.
//function doSomethingWithSelectedText() {
//    var selectedText = getSelectedText();
//    if (selectedText) {
//        // Do something.
//    }
//}


