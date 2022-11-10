// Scenario list constant.
const scenarioList = [
    { id: 1, text: "On 1 November, Ahmad who lives next door to Hussain called on Hussain and offer to sell his IBM computer for RM2,000 . On 3 November, Hussain wrote and posted a letter to Ahmad accepting the offer. The letter was not addressed properly. Hence Ahmad received the letter of acceptance on 8 November instead of on 5 November. On the evening of 6 November, Ahmad telephoned Hussain and said 'I revoke my offer to you'" },
    { id: 2, text: "'Cathy's son, Dave, aged 21, was studying for a diploma in computer science at a University in Kuala Lumpur. He lived in a student residence. It was a city council legislative requirement that it was illegal to smoke in student residence, offices, shops, or any enclosed place where someone else is residing, studying or working within the campus. Dave gave up smoking due to this requirement.However, Cathy was worried that under the pressure of preparing for the examination Dave would start smoking again, and so she promised to pay Dave RM500 if he did not smoke at all until he had completed the course.She also promised to buy him a car if he passed the examinations.Cathy run an online bookstore, and asked Dave to maintain and update the website from time to time.She was pleased with the result, and said she would give him RM1, 000 'for all his hard work'. Dave passed his examinations, obtained his diploma and moved to live in Johor Bahru where there was no legal requirement on banning of smoking in public enclosed areas.He has not started to smoke again after he left Kuala Lumpur.Cathy has not made either of the promised payments, or bought the car." },
];

// Store the single courtCasePageNumber button Id.
// Only one can exist at a time.
var courtCasePageNumberId = null;

// Store related section buttons Ids.
var relatedSectionBtnIds = [];

// function that runs all necessary initial retrieval.
function init() {
    // Get the first id scenerio from db.
    getScenarioList();
    createRelationButtons();
    displayUser();
    getLegalConcepts();
}

// The the list of scenarios available in the database.
function getScenarioList() {
    // get all declared scenarios.
    var scenarioSelect = document.getElementById("scenarioSelect");

    $.each(scenarioList, function (index, value) {
        scenarioSelect.innerHTML +=
            ('<option value="' + value.id + '">' + value.id + '</option>\n');
    });
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

    // Clear all annotations.
    r.clearAnnotations();

    // Clear all annotation buttons and reset the annotation button array.
    removeAllAnnotationBtnIds();
    annotationBtnIds = [];
}

// Change the scenario text based on retrieved scenario text from db.
function changeScenarioText(scenario) {
    var scenarioText = document.getElementById("ScenarioText");
    scenarioText.innerHTML = scenario.text;
}

function createRelationButtons() {
    // Const relation.
    const relationData = [
        { name: ' { IF  ELSE  }', text: '{ IF......ELSE......  } ' },
        { name: ' { IF  THEN }', text: '{ IF ..... THEN .... } ' },
        { name: ' { ONLY IF }', text: '{ ONLY IF......} ' },
        { name: ' { AND }', text: '{AND}' },
        { name: ' { OR }', text: '{OR}' },
        { name: ' { HOWEVER }', text: '{HOWEVER}' },
        { name: ' { NOT }', text: '{NOT}' },

    ];

    // Get relation btn div id.
    var relationBtnDiv = document.getElementById('relationBtns');

    $.each(relationData, function (index, value) {
        // Create button element.
        var button = document.createElement('button');

        button.type = 'button';
        button.className = 'btn btn-outline-info';

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
    var selectText_Tags = highlitedObject;
    var Username = document.getElementById('userDisplay');
    var scenarioID = document.getElementById('scenarioSelect');
    var issues = document.getElementById('issues');
    var relatedCourtCase = document.getElementById('relatedCourtCase');
    var courtCaseNum = document.getElementById('courtCase_Num');
    var analysis = document.getElementById('analysisTextArea');
    var conclusion = document.getElementById('conclusion');
    var selectedSectionOptions = $('#selectedSections').val();

    // This variable stores all the data.
 

    var data_json = {
        "User": Username.innerHTML,
        "ScenarioID": scenarioID.value,
        "Text_Tag": selectText_Tags,
        "Issues": issues.value,
        "Sections": selectedSectionOptions,
        "RelatedCourtCase_pageNum": relatedCourtCase.value + '(' + courtCaseNum.value + ')',
        "Analysis": analysis.value,
        "Conclusion":conclusion.value
        
    };

    var data = JSON.stringify(data_json);

    console.log(data_json);
    var currentdate = new Date();
    var date = currentdate.getDate() + "_" + (currentdate.getMonth() + 1) + "_" +
        currentdate.getHours() + currentdate.getMinutes();
    var filename = 'Annotated_' + scenarioID.value + '_' + date + '.txt'

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
    console.log('User name : ', inputTest)
    document.getElementById('userDisplay').innerHTML = inputTest;
}

// Function to remove all the annotation btn ids from the list.
function removeAllAnnotationBtnIds() {
    $.each(annotationBtnIds, function (index, value) {
        var elem = document.getElementById(value);
        elem.parentNode.removeChild(elem);
    });
}

// Function to generate court case page number button.
// Will replace the existing button if any.
// Cannot create a court case page number button if the two affected fields are null or String empty('').
function generateCourtCasePageNumberBtn() {
    // If either field is null, do not create button.
    var relatedCourtCaseField = document.getElementById('relatedCourtCase');
    if (relatedCourtCaseField.value == null || relatedCourtCaseField.value == '')
        return;

    var relatedCourtCaseNumField = document.getElementById('courtCase_Num');
    if (relatedCourtCaseNumField.value == null || relatedCourtCaseField.value == '')
        return;

    // remove existing court case page number button id if not null.
    if (courtCasePageNumberId != null) {
        var elem = document.getElementById(courtCasePageNumberId);
        elem.parentNode.removeChild(elem);
    }

    // Merge the court case and page number text into one text.
    var mergedCourtCasePageNumberText = '{'+ relatedCourtCaseField.value + '[' + relatedCourtCaseNumField.value + ']'+'}';

    // Get courtCasePageNumberBtns div id.
    var courtCasePageNumberBtnsDiv = document.getElementById('courtCasePageNumberBtns');

    // Create button element.
    var button = document.createElement('button');

    button.type = 'button';
    button.className = 'btn btn-outline-primary';

    // Id will be the relationName + 'Btn'.
    // Ex.Selected IfElse => The button id is 'IfElseBtn'.
    // It is case senstive and also will take in spaces.
    button.id = mergedCourtCasePageNumberText + 'Btn';

    // Add button id to global.
    courtCasePageNumberId = button.id;

    // Add text to be displayed on button.
    button.innerHTML = mergedCourtCasePageNumberText;

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
            analysisTextAreaValue.slice(0, curPos) + mergedCourtCasePageNumberText + analysisTextAreaValue.slice(curPos));

        // Restore cursor position to end of analysis text area after clicking on button.
        analysisTextArea.focus();
    });

    // Append the  button to annotation div.
    courtCasePageNumberBtnsDiv.appendChild(button);
}

// Function to generate related sections button.
// Will replace the existing buttons if any.
// Cannot create if there are no selected related sections(disabled by UI).
function generateRelatedSectionsBtn() {
    // remove existing court case page number button id if not null.
    if (relatedSectionBtnIds.length > 0) {
        $.each(relatedSectionBtnIds, function (index, value) {
            var elem = document.getElementById(value);
            elem.parentNode.removeChild(elem);
        });
    }

    // Get courtCasePageNumberBtns div id.
    var relatedSectionBtnsDiv = document.getElementById('relatedSectionBtns');

    let relationSectionArray = $('#selectedSections').val();

    $.each(relationSectionArray, function (index, value) {
        // Create button element.
        var button = document.createElement('button');

        button.type = 'button';
        button.className = 'btn btn-outline-secondary';

        let mergedText = '{'+'Section ' + value + '}';

        // Id will be the relationName + 'Btn'.
        // Ex.Selected IfElse => The button id is 'IfElseBtn'.
        // It is case senstive and also will take in spaces.
        button.id = mergedText + 'Btn';

        // Store related section btn id.
        relatedSectionBtnIds.push(button.id);

        // Add text to be displayed on button.
        button.innerHTML = mergedText;

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
                analysisTextAreaValue.slice(0, curPos) + mergedText + analysisTextAreaValue.slice(curPos));

            // Restore cursor position to end of analysis text area after clicking on button.
            analysisTextArea.focus();
        });

        // Append the  button to annotation div.
        relatedSectionBtnsDiv.appendChild(button);
    });
}

// Function to check if the the generate court case page number(CCPN) button is disabled.
function checkDisabledCCPN() {
    var relatedCourtCaseField = document.getElementById('relatedCourtCase');

    if (relatedCourtCaseField.value == null || relatedCourtCaseField.value == ''
        ) {
        document.getElementById('generateCCPNBtn').disabled = true;
    }
    else {
        document.getElementById('generateCCPNBtn').disabled = false;
    }
}

// Function to check if the the generate related section(RS) button is disabled.
function checkDisabledRS() {
    let selectedSectionOptions = $('#selectedSections').val().toString();
    console.log(selectedSectionOptions);
    if (selectedSectionOptions == '') {
        document.getElementById('generateRSBtn').disabled = true;
    }
    else {
        document.getElementById('generateRSBtn').disabled = false;
    }
}


// function to get scenario based on id.
function getLegalConcepts() {
    // remove all table rows except the first(header).
    $("#legalConceptTable").find("tr:not(:first)").remove();

    // get declared legalConcepts.
    // remember to update the same one in scenario.html script.
    const legalConcepts2 = [
        { id: 1, name: 'Offer Date', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 2, name: 'Communication of Acceptance', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' }
    ];

    displayLegalConcepts(legalConcepts2);
}

// assign legal concept rows of data to legal concepts table html.
function displayLegalConcepts(legalConcepts) {
    var table = document.getElementById("legalConceptTable");

    $.each(legalConcepts, function (index, value) {
        table.innerHTML +=
            ('<tr>\n' +
                '<td>' + value.id + '</td>\n' +
                '<td>' + value.name + '</td>\n' +
                '<td>' + value.relatedTopic + '</td>\n' +
                '<td>' + value.relatedSection + '</td>\n' +
                '<td>' + value.other + '</td>\n' +
                '</tr>');
    });
}