// Scenario list variable.
var sceList= [];

// Store the courtCasePageNumber button Ids.
var courtCasePageNumberIds = [];

// Store related section buttons Ids.
var relatedSectionBtnIds = [];

var currentCourtCaseCount = 1;

// function that runs all necessary initial retrieval.
function init() {
    // Get the first id scenerio from db.
    getSceData();
    //getScenarioList();
    createRelationButtons();
    displayUser();
    getLegalConcepts();
    createReasonButtons();

}

function getSceData(){
     $.getJSON('./data/data.json', function(data) {
       $.each(data, function(i, f) {
          //console.log(f.ID,f.Scenario)
          //console.log("f",f.ID);
          var tmp = f.ID+ ","+f.Scenario;
          //console.log("tmp",tmp);
          sceList.push(f);
     });
     getScenarioList();
   });
   console.log("scelist ",sceList);
}



// The the list of scenarios available in the database.
function getScenarioList() {
    // get all declared scenarios.

    var scenarioSelect = document.getElementById("scenarioSelect");
    console.log(sceList);

    $.each(sceList, function (index, value) {
        //console.log("valud ID ",value.ID);
        scenarioSelect.innerHTML +=
            ('<option value="' + value.ID + '">' + value.ID + '</option>\n');

    });

    //console.log(sceList);
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

    $.each(sceList, function (index, value) {
        if (value.ID == selectedId) {
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
    console.log("scenario var ",scenario.Issue);
    var scenarioText = document.getElementById("ScenarioText");
    scenarioText.innerHTML = scenario.Scenario;

    //update other fileds
    document.getElementById("issues").value = scenario.Issue;
    document.getElementById("decompositions").value = scenario.DecomQ;

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

function createReasonButtons() {
    // Const relation.
    const relationData = [
        { name: ' { LEGALLIZATION}', text: '{LEGALLIZATION}' },
        { name: ' { COMMON_SENSE }', text: '{COMMON_SENSE}' },
        { name: ' { CO-REFERENCE }', text: '{CO-REFERENCE}' },
    ];

    // Get relation btn div id.
    var relationBtnDiv = document.getElementById('reasonBtns');

    $.each(relationData, function (index, value) {
        // Create button element.
        var button = document.createElement('button');

        button.type = 'button';
        button.className = 'btn btn-outline-primary';

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
    var Username = document.getElementById('userDisplay');
    var scenarioID = document.getElementById('scenarioSelect');
    var issues = document.getElementById('issues');
    var decomQues = document.getElementById('decompositions');
    var analysis = document.getElementById('analysisTextArea');
    var conclusion = document.getElementById('conclusion');
    var selectedSectionOptions = $('#selectedSections').val();

    let relatedCourtCasePageNumbers = [];
    // Get list of filled court case and pg number.
    for (let i = 1; i <= currentCourtCaseCount; i++) {
        let relatedCourtCaseId = 'relatedCourtCase_' + i;
        let courtCaseNumId = 'courtCase_Num_' + i;
        let relatedCourtCase = document.getElementById(relatedCourtCaseId);
        let courtCaseNum = document.getElementById(courtCaseNumId);

        relatedCourtCasePageNumbers.push(relatedCourtCase.value + '[' + courtCaseNum.value + ']');
    }

    // This variable stores all the data.

    var data_json = {
        "User": Username.innerHTML,
        "ScenarioID": scenarioID.value,
        "Text_Tags": selectedAnnotation,
        "Selected_Relations": selectedRelations,
        "Issues": issues.value,
        "DecomQues":decomQues.value,
        "Sections": selectedSectionOptions,
        "RelatedCourtCase_pageNumList": relatedCourtCasePageNumbers,
        "Analysis": analysis.value,
        "Conclusion": conclusion.value,
        "Original_Objects": highlightedObject
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
        relatedSectionBtnIds = [];
    }

    // Get courtCasePageNumberBtns div id.
    var relatedSectionBtnsDiv = document.getElementById('relatedSectionBtns');

    let relationSectionArray = $('#selectedSections').val();

    $.each(relationSectionArray, function (index, value) {
        // Create button element.
        var button = document.createElement('button');

        button.type = 'button';
        button.className = 'btn btn-outline-secondary';

        let mergedText = '{' + 'Section ' + value + '}';

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

function addCourtCase() {
    // get view element.
    let courtCaseView = document.getElementById("courtCaseView");

    // Increase court case global count.
    currentCourtCaseCount++;

    let newCourtCaseInput = document.createElement('span');
    newCourtCaseInput.innerHTML =
        ('<div class="row" id="courtCase_' + currentCourtCaseCount + '" style="margin-bottom: 10px;">'
            + '<div class="col-sm-2">'
            + '<label class="col-form-label">#' + currentCourtCaseCount + '</label>'
            + '</div>'
            + '<div class="col-sm-4">'
            + '<input type="text" class="form-control" id="relatedCourtCase_' + currentCourtCaseCount + '">'
            + '</div>'
            + '<div class="col-sm-4">'
            + '<input type="text" class="form-control" id="courtCase_Num_' + currentCourtCaseCount + '">'
            + '</div>'
            + '<div class="col-sm-2">'
            + '</div>'
            + '</div>');
    courtCaseView.appendChild(newCourtCaseInput);
}

function removeCourtCase() {
    // Do not allow remove if currentCourtCaseCount is 1.
    // There must always be one court case available.
    if (currentCourtCaseCount != 1) {
        // Get court case id to remove based on global current court case count.
        let courtCaseId = 'courtCase_' + currentCourtCaseCount;

        // Remove target court case.
        var elem = document.getElementById(courtCaseId);
        elem.parentNode.removeChild(elem);

        // Reduce gloval court case count.
        currentCourtCaseCount--;
    }
}

// Function to generate court case page number button.
// Will replace the existing button if any.
// Cannot create a court case page number button if the two affected fields are null or String empty('').
function generateCourtCasePageNumberBtn() {
    // remove existing court case page number button ids if not null.
    if (courtCasePageNumberIds.length > 0) {
        $.each(courtCasePageNumberIds, function (index, value) {
            var elem = document.getElementById(value);
            elem.parentNode.removeChild(elem);
        });
        courtCasePageNumberIds = [];
    }

    // Loop for the number of currentCourtCaseCount.
    for (let i = 1; i <= currentCourtCaseCount; i++) {
        let relatedCourtCase = 'relatedCourtCase_' + i;
        let courtCaseNum = 'courtCase_Num_' + i;
        // If either field is null, do not create button.
        let relatedCourtCaseField = document.getElementById(relatedCourtCase);
        if (relatedCourtCaseField.value == null || relatedCourtCaseField.value == '')
            return;

        let relatedCourtCaseNumField = document.getElementById(courtCaseNum);
        if (relatedCourtCaseNumField.value == null || relatedCourtCaseField.value == '')
            return;

        // Merge the court case and page number text into one text.
        let mergedCourtCasePageNumberText = '{' + relatedCourtCaseField.value + '[' + relatedCourtCaseNumField.value + ']' + '}';

        // Get courtCasePageNumberBtns div id.
        let courtCasePageNumberBtnsDiv = document.getElementById('courtCasePageNumberBtns');

        // Create button element.
        let button = document.createElement('button');

        button.type = 'button';
        button.className = 'btn btn-outline-primary';

        // Id will be the relationName + 'Btn'.
        // Ex.Selected IfElse => The button id is 'IfElseBtn'.
        // It is case senstive and also will take in spaces.
        button.id = mergedCourtCasePageNumberText + 'Btn';

        // Add button id to global.
        courtCasePageNumberIds.push(button.id);

        // Add text to be displayed on button.
        button.innerHTML = mergedCourtCasePageNumberText;

        // Add onClick event to add the selected relation to analysis text area at the cursor.
        button.addEventListener('click', function (event) {
            // Get current position of cursor at analysis text area.
            // If no cursor, it will append at the end of the textArea's text.
            let analysisTxtBox = document.getElementById('analysisTextArea');
            let curPos = analysisTxtBox.selectionStart;

            // Get current text in analysisTextArea.
            let analysisTextAreaValue = $('#analysisTextArea').val();

            // Insert text at cursor position.
            $('#analysisTextArea').val(
                analysisTextAreaValue.slice(0, curPos) + mergedCourtCasePageNumberText + analysisTextAreaValue.slice(curPos));

            // Restore cursor position to end of analysis text area after clicking on button.
            analysisTextArea.focus();
        });

        // Append the  button to annotation div.
        courtCasePageNumberBtnsDiv.appendChild(button);
    }
}

function getLegalConcepts() {
    // remove all table rows except the first(header).
    $("#legalConceptTable").find("tr:not(:first)").remove();

    // get declared legalConcepts.
    // remember to update the same one in scenario.html script.
    const legalConcepts = [
        { id: 1, name: 'invitation to treat', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 2, name: 'Display of goods for sale', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 3, name: 'Tender documents', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 4, name: 'Price Quotation', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 5, name: 'Auction', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 6, name: 'Advertisements', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 7, name: 'Offeror', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 8, name: 'legal capacity', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 9, name: 'offeree', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 10, name: 'offer', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        {
            id: 11, name: 'promise', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: ''
        },
        { id: 12, name: 'product for money', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 13, name: 'termination of offer', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 14, name: 'Rejection', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 15, name: 'Lapse of time', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 16, name: 'Contingent condition subsequent ', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 17, name: 'Death', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 18, name: 'Revocation', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 19, name: 'Counter- Offer', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 20, name: 'acceptance', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 21, name: 'Cross-offer', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 22, name: 'Mere injuiry ', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 23, name: 'Mode of Acceptance ', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 24, name: 'General Rule', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 25, name: 'By instantaneous communication', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 26, name: 'By conduct', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        {
            id: 27, name: 'Postal Rule', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: ''
        },
        { id: 28, name: 'intension to create legal relations', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 29, name: 'Social and Domestic context', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },

    ];

    displayLegalConcepts(legalConcepts);
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