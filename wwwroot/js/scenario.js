const legalConceptUri = 'api/legalconcepts';
const scenariosUri = 'api/scenarios';

var scenarioList = null;


// function that runs all necessary initial retrieval.
function init() {
    // Get the first id scenerio from db.
    getScenarioList();
    createRelationButtons();
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

function createRelationButtons() {
    // TODO: Create and get relation information from a relation table?

    // Id, value array. To be replaced with actual table data.
    const relationData = [
        { name: ' If Else ', text: 'If ..... Else ....' },
        { name: ' If Then ', text: 'If ..... Then ....' }
    ];

    // Get relation btn div id.
    var relationBtnDiv = document.getElementById('relationBtns');

    $.each(relationData, function (index, value) {
        // Create button element.
        var button = document.createElement('button');

        button.type = 'button';

        // Id will be the relationName + 'Btn'.
        // Ex.Selected IfElse => The button id is 'IfElseBtn'.
        // It is case senstive and also will take in spaces.
        button.id = value.name + 'Btn';

        // Add text to be displayed on button.
        button.innerHTML = value.name;

        // Add onClick event to add the selected relation to analysis text area at the cursor.
        button.addEventListener('click', function (event) {
            // Get current position of cursor at analysis text area.
            // If no cursor, it will append at the end of the textArea's text.
            var analysisTxtBox = document.getElementById('analysisTextArea');
            let curPos = analysisTxtBox.selectionStart;

            // Get current text in analysisTextArea.
            var analysisTextAreaValue = $('#analysisTextArea').val();

            // Insert text at cursor position.
            $('#analysisTextArea').val(
                analysisTextAreaValue.slice(0, curPos) + value.text + analysisTextAreaValue.slice(curPos));

            // Restore cursor position to end of analysis text area after clicking on button.
            analysisTextArea.focus();
        });

        // Append the  button to annotation div.
        relationBtnDiv.appendChild(button);
    });
}


function saveFile() {

    // Get the data from each element on the form.
    var selectText_Tags = selectedAnnotation;
    var Username = document.getElementById('userDisplay');
    var scenarioID = document.getElementById('scenarioSelect');
    var issues = document.getElementById('issues');
    var sections = document.getElementById('selectedSections');
    var relatedCourtCase = document.getElementById('relatedCourtCase');
    var courtCaseNum = document.getElementById('courtCase_Num');
    var analysis = document.getElementById('analysisTextArea');
    var conclusion = document.getElementById('conclusion');

    // This variable stores all the data.
    var data =
        '\r User: ' + Username.value + ' \r\n ' +
        'Scenario Id: ' + scenarioID.value + ' \r\n ' +
        'Selected Text & tag: ' + JSON.stringify(selectText_Tags) + ' \r\n ' +
        'Issues: ' + issues.value + ' \r\n ' +
        'sections: ' + sections.value + ' \r\n '+
        'Related Court Case: ' + relatedCourtCase.value + ' \r\n ' +
        'Court case page/paragraph num: ' + courtCaseNum.value + ' \r\n ' +
        'Analysis : ' + analysis.value + ' \r\n ' +
        'Conclustion: ' + conclusion.value + ' \r\n '
        ;
  
    console.log(data)
    var currentdate = new Date();
    var date = currentdate.getDate() + "_" + (currentdate.getMonth() + 1) +"_"+
        currentdate.getHours() + currentdate.getMinutes();
    var filename = 'Annotated_'+scenarioID.value+'_'+date+'.txt'

    
    let blob = new Blob([data]);
    let url = URL.createObjectURL(blob);
    let file = document.createElement(`a`);
    file.download = filename;
    file.href = url;
    document.body.appendChild(file);
    file.click();
    file.remove();
    URL.revokeObjectURL(url);
 
}




  function displayUser() {
        var inputTest = localStorage['username'];
        /*alert('Inserted Data ' + localStorage['username']);*/
        document.getElementById('userDisplay').innerHTML = inputTest;
    }
