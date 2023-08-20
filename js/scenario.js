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
      {'id': 1, 'primary': 'Acceptance, [4.052]–[4.063]', 'secondaryies': 'absolute and unqualified, [4.054]', 'tertiaryies': ['case example, [4.055]'], 'combine_concept': ['<br>{Acceptance :absolute and unqualified :case example }<br>']}
,
{'id': 2, 'primary': 'Acceptance, [4.052]–[4.063]', 'secondaryies': 'acceptor’s advantages, [4.119]', 'tertiaryies': [], 'combine_concept': ['<br>{Acceptance :acceptor’s advantages }<br>']}
,
{'id': 3, 'primary': 'Acceptance, [4.052]–[4.063]', 'secondaryies': 'characteristics, [4.053]', 'tertiaryies': [], 'combine_concept': ['<br>{Acceptance :characteristics }<br>']}
,
{'id': 4, 'primary': 'Acceptance, [4.052]–[4.063]', 'secondaryies': 'communication of, [4.069]–[4.086]', 'tertiaryies': ['completion, [4.077]', 'conditions unfulfilled despite, [4.075]', 'deeming, [4.071]', 'effective, determination, [4.077]', 'English law, [4.069], [4.070], [4.073]', 'general rule, [4.069]', 'Malaysia, [4.070]', 'means, [4.072]', 'omission, acceptance by, [4.072], [4.074]', 'silence, by, [4.073], [4.076]', 'timing, [4.078]', 'unilateral proposals, [4.075]', 'case, [4.079]', 'case analysis, [4.080], [4.081]'], 'combine_concept': ['<br>{Acceptance :communication of :completion }<br>', '<br>{Acceptance :communication of :conditions unfulfilled despite }<br>', '<br>{Acceptance :communication of :deeming }<br>', '<br>{Acceptance :communication of :effective determination }<br>', '<br>{Acceptance :communication of :English law   }<br>', '<br>{Acceptance :communication of :general rule }<br>', '<br>{Acceptance :communication of :Malaysia }<br>', '<br>{Acceptance :communication of :means }<br>', '<br>{Acceptance :communication of :omission acceptance by  }<br>', '<br>{Acceptance :communication of :silence by  }<br>', '<br>{Acceptance :communication of :timing }<br>', '<br>{Acceptance :communication of :unilateral proposals }<br>', '<br>{Acceptance :communication of :case }<br>', '<br>{Acceptance :communication of :case analysis  }<br>']}
,
{'id': 5, 'primary': 'Acceptance, [4.052]–[4.063]', 'secondaryies': 'Contracts Act 1950 s 2(b), [4.052]', 'tertiaryies': [], 'combine_concept': ['<br>{Acceptance :Contracts Act 1950 s 2(b) }<br>']}
,
{'id': 6, 'primary': 'Acceptance, [4.052]–[4.063]', 'secondaryies': 'examples of analysis of existence, [4.006], [4.007]', 'tertiaryies': [], 'combine_concept': ['<br>{Acceptance :examples of analysis of existence  }<br>']}
,
{'id': 7, 'primary': 'Acceptance, [4.052]–[4.063]', 'secondaryies': 'mala fide, [4.098]', 'tertiaryies': [], 'combine_concept': ['<br>{Acceptance :mala fide }<br>']}
,
{'id': 8, 'primary': 'Acceptance, [4.052]–[4.063]', 'secondaryies': 'motive, [4.051]', 'tertiaryies': [], 'combine_concept': ['<br>{Acceptance :motive }<br>']}
,
{'id': 9, 'primary': 'Acceptance, [4.052]–[4.063]', 'secondaryies': 'necessity, [4.052]', 'tertiaryies': [], 'combine_concept': ['<br>{Acceptance :necessity }<br>']}
,
{'id': 10, 'primary': 'Acceptance, [4.052]–[4.063]', 'secondaryies': 'omission, by, [4.072], [4.074]', 'tertiaryies': [], 'combine_concept': ['<br>{Acceptance :omission by  }<br>']}
,
{'id': 11, 'primary': 'Acceptance, [4.052]–[4.063]', 'secondaryies': 'oral contract case example, [4.057]', 'tertiaryies': ['evidence, importance, [4.058]'], 'combine_concept': ['<br>{Acceptance :oral contract case example :evidence importance }<br>']}
,
{'id': 12, 'primary': 'Acceptance, [4.052]–[4.063]', 'secondaryies': 'postal acceptance, problems, [4.062], [4.063], [4.082]', 'tertiaryies': ['case example, [4.078]', 'Contracts Act 1950 s 4(2), [4.080]–[4.082]', 'facts and evidence, [4.083]', 'limitation of rule, [4.086]', 'origins of rule, [4.084], [4.085]', 'case analysis, [4.080], [4.081]'], 'combine_concept': ['<br>{Acceptance :postal acceptance problems   :case example }<br>', '<br>{Acceptance :postal acceptance problems   :Contracts Act 1950 s 4(2) }<br>', '<br>{Acceptance :postal acceptance problems   :facts and evidence }<br>', '<br>{Acceptance :postal acceptance problems   :limitation of rule }<br>', '<br>{Acceptance :postal acceptance problems   :origins of rule  }<br>', '<br>{Acceptance :postal acceptance problems   :case analysis  }<br>']}
,
{'id': 13, 'primary': 'Acceptance, [4.052]–[4.063]', 'secondaryies': 'prescribed means, [4.061]', 'tertiaryies': ['postal acceptance, problems, [4.062], [4.063]', 'redundancy, [4.060]'], 'combine_concept': ['<br>{Acceptance :prescribed means :postal acceptance problems  }<br>', '<br>{Acceptance :prescribed means :redundancy }<br>']}
,
{'id': 14, 'primary': 'Acceptance, [4.052]–[4.063]', 'secondaryies': 'proposal conditions, [4.054]', 'tertiaryies': [], 'combine_concept': ['<br>{Acceptance :proposal conditions }<br>']}
,
{'id': 15, 'primary': 'Acceptance, [4.052]–[4.063]', 'secondaryies': 'proposal revoked before, [4.087]', 'tertiaryies': ['case example, [4.088]'], 'combine_concept': ['<br>{Acceptance :proposal revoked before :case example }<br>']}
,
{'id': 16, 'primary': 'Acceptance, [4.052]–[4.063]', 'secondaryies': 'reform', 'tertiaryies': ['necessity, [4.124]', 'reason, [4.125]'], 'combine_concept': ['<br>{Acceptance :reform:necessity }<br>', '<br>{Acceptance :reform:reason }<br>']}
,
{'id': 17, 'primary': 'Acceptance, [4.052]–[4.063]', 'secondaryies': 'requirement to make business and economic sense, [4.043]–[4.045]', 'tertiaryies': ['case example, [4.043]', 'effect of not making sense, [4.045]', 'principle, [4.044]'], 'combine_concept': ['<br>{Acceptance :requirement to make business and economic sense :case example }<br>', '<br>{Acceptance :requirement to make business and economic sense :effect of not making sense }<br>', '<br>{Acceptance :requirement to make business and economic sense :principle }<br>']}
,
{'id': 18, 'primary': 'Acceptance, [4.052]–[4.063]', 'secondaryies': 'revocation, [4.117]', 'tertiaryies': ['acceptor’s advantages, [4.119]', 'communication, [4.118]', 'Contracts Act 1950 s 3, [4.121]', 'environment for judicial creativity, [4.122]', 'general rule, [4.099]', 'postal acceptance, [4.120]', 'timing, [4.117], [4.118], [4.120]'], 'combine_concept': ['<br>{Acceptance :revocation :acceptor’s advantages }<br>', '<br>{Acceptance :revocation :communication }<br>', '<br>{Acceptance :revocation :Contracts Act 1950 s 3 }<br>', '<br>{Acceptance :revocation :environment for judicial creativity }<br>', '<br>{Acceptance :revocation :general rule }<br>', '<br>{Acceptance :revocation :postal acceptance }<br>', '<br>{Acceptance :revocation :timing   }<br>']}
,
{'id': 19, 'primary': 'Acceptance, [4.052]–[4.063]', 'secondaryies': 'rules, [4.059]', 'tertiaryies': ['redundancy of prescribed acceptance method, [4.060]'], 'combine_concept': ['<br>{Acceptance :rules :redundancy of prescribed acceptance method }<br>']}
,
{'id': 20, 'primary': 'Acceptance, [4.052]–[4.063]', 'secondaryies': 'subject to contract, [4.065]', 'tertiaryies': ['case examples, [4.066], [4.068]', 'types of contract inapplicable, [4.067]', 'use, [4.064]'], 'combine_concept': ['<br>{Acceptance :subject to contract :case examples  }<br>', '<br>{Acceptance :subject to contract :types of contract inapplicable }<br>', '<br>{Acceptance :subject to contract :use }<br>']}
,
{'id': 21, 'primary': 'Advertisements, [4.029]–[4.032]', 'secondaryies': 'case applying principles, [4.032]', 'tertiaryies': [], 'combine_concept': ['<br>{Advertisements :case applying principles }<br>']}
,
{'id': 22, 'primary': 'Advertisements, [4.029]–[4.032]', 'secondaryies': 'case illustrating rule, [4.030]', 'tertiaryies': [], 'combine_concept': ['<br>{Advertisements :case illustrating rule }<br>']}
,
{'id': 23, 'primary': 'Advertisements, [4.029]–[4.032]', 'secondaryies': 'circulars and catalogues, whether offers or, [4.031]', 'tertiaryies': [], 'combine_concept': ['<br>{Advertisements :circulars and catalogues whether offers or }<br>']}
,
{'id': 24, 'primary': 'Advertisements, [4.029]–[4.032]', 'secondaryies': 'invitations to treat, as, [4.029]', 'tertiaryies': [], 'combine_concept': ['<br>{Advertisements :invitations to treat as }<br>']}
,
{'id': 25, 'primary': 'Advertisements, [4.029]–[4.032]', 'secondaryies': 'purpose, [4.029]', 'tertiaryies': [], 'combine_concept': ['<br>{Advertisements :purpose }<br>']}
,
{'id': 26, 'primary': 'Agreements', 'secondaryies': 'memoranda of understanding as enforceable agreement, [7.032]', 'tertiaryies': [], 'combine_concept': ['<br>{Agreements:memoranda of understanding as enforceable agreement }<br>']}
,
{'id': 27, 'primary': 'Agreements', 'secondaryies': 'void for lack of consideration, [5.010]–[5.013]', 'tertiaryies': [], 'combine_concept': ['<br>{Agreements:void for lack of consideration }<br>']}
,
{'id': 28, 'primary': 'Auctions, [4.033]–[4.036]', 'secondaryies': 'definition, [4.033]', 'tertiaryies': [], 'combine_concept': ['<br>{Auctions :definition }<br>']}
,
{'id': 29, 'primary': 'Auctions, [4.033]–[4.036]', 'secondaryies': 'invitation to treat or proposal, whether, [4.035]', 'tertiaryies': [], 'combine_concept': ['<br>{Auctions :invitation to treat or proposal whether }<br>']}
,
{'id': 30, 'primary': 'Auctions, [4.033]–[4.036]', 'secondaryies': 'Payne v Cave, [4.035], [4.036]', 'tertiaryies': [], 'combine_concept': ['<br>{Auctions :Payne v Cave  }<br>']}
,
{'id': 31, 'primary': 'Auctions, [4.033]–[4.036]', 'secondaryies': 'sale by, definition, [4.034]', 'tertiaryies': [], 'combine_concept': ['<br>{Auctions :sale by definition }<br>']}
,
{'id': 32, 'primary': 'Capacity, [7.035], [7.036], [7.055]', 'secondaryies': 'unsound mind, persons of, [7.045]', 'tertiaryies': ['caution, critical thought and evaluation, [7.048]', 'sound mind, [7.045]–[7.047]', 'unsound mind contracting during lucidity, [7.049], [7.050]'], 'combine_concept': ['<br>{Capacity   :unsound mind persons of :caution critical thought and evaluation }<br>', '<br>{Capacity   :unsound mind persons of :sound mind }<br>', '<br>{Capacity   :unsound mind persons of :unsound mind contracting during lucidity  }<br>']}
,
{'id': 33, 'primary': 'Common law', 'secondaryies': 'past consideration, [5.031]–[5.034]', 'tertiaryies': [], 'combine_concept': ['<br>{Common law:past consideration }<br>']}
,
{'id': 34, 'primary': 'Common law', 'secondaryies': 'proposal termination, [4.112]–[4.116]', 'tertiaryies': [], 'combine_concept': ['<br>{Common law:proposal termination }<br>']}
,
{'id': 35, 'primary': 'Consideration. See also Promissory estoppel', 'secondaryies': 'agreement made without is void, [5.010]–[5.013]', 'tertiaryies': ['case examples, [5.012], [5.013]'], 'combine_concept': ['<br>{Consideration. See also Promissory estoppel:agreement made without is void :case examples  }<br>']}
,
{'id': 36, 'primary': 'Consideration. See also Promissory estoppel', 'secondaryies': 'basic element of contract, as, [5.010]', 'tertiaryies': [], 'combine_concept': ['<br>{Consideration. See also Promissory estoppel:basic element of contract as }<br>']}
,
{'id': 37, 'primary': 'Consideration sufficiency, [5.051]–[5.052]', 'secondaryies': 'forbearance to sue, [5.058]', 'tertiaryies': ['abstinence, [5.059]', 'case examples, [5.058], [5.060]', 'proof required, [5.061]'], 'combine_concept': ['<br>{Consideration sufficiency :forbearance to sue :abstinence }<br>', '<br>{Consideration sufficiency :forbearance to sue :case examples  }<br>', '<br>{Consideration sufficiency :forbearance to sue :proof required }<br>']}
,
{'id': 38, 'primary': 'Consideration sufficiency, [5.051]–[5.052]', 'secondaryies': 'inadequate consideration and consent, [5.048], [5.049]', 'tertiaryies': [], 'combine_concept': ['<br>{Consideration sufficiency :inadequate consideration and consent  }<br>']}
,
{'id': 39, 'primary': 'Consideration sufficiency, [5.051]–[5.052]', 'secondaryies': 'inadequate consideration', 'tertiaryies': ['immaterial, [5.045], [5.049]', 'case examples, [5.044], [5.047]'], 'combine_concept': ['<br>{Consideration sufficiency :inadequate consideration:immaterial  }<br>', '<br>{Consideration sufficiency :inadequate consideration:case examples  }<br>']}
,
{'id': 40, 'primary': 'Consideration sufficiency, [5.051]–[5.052]', 'secondaryies': 'natural love and affection', 'tertiaryies': ['case example, [5.057]', 'conditions for validity, [5.054]', 'Contracts Act 1950, [5.053], [5.055]', 'good consideration in Malaysia, [5.053]', 'near relations only, [5.056]'], 'combine_concept': ['<br>{Consideration sufficiency :natural love and affection:case example }<br>', '<br>{Consideration sufficiency :natural love and affection:conditions for validity }<br>', '<br>{Consideration sufficiency :natural love and affection:Contracts Act 1950  }<br>', '<br>{Consideration sufficiency :natural love and affection:good consideration in Malaysia }<br>', '<br>{Consideration sufficiency :natural love and affection:near relations only }<br>']}
,
{'id': 41, 'primary': 'Consideration sufficiency, [5.051]–[5.052]', 'secondaryies': 'part payment of debt', 'tertiaryies': ['common law invalidity, [5.069]', 'Malaysia, in', 'case example, [5.072]', 'Contracts Act 1950, [5.070]–[5.072]', 'promisee forgoing debt without return, [5.071]', 'statutory waiver, [5.070]'], 'combine_concept': ['<br>{Consideration sufficiency :part payment of debt:common law invalidity }<br>', '<br>{Consideration sufficiency :part payment of debt:Malaysia in}<br>', '<br>{Consideration sufficiency :part payment of debt:case example }<br>', '<br>{Consideration sufficiency :part payment of debt:Contracts Act 1950 }<br>', '<br>{Consideration sufficiency :part payment of debt:promisee forgoing debt without return }<br>', '<br>{Consideration sufficiency :part payment of debt:statutory waiver }<br>']}
,
{'id': 42, 'primary': 'Consideration sufficiency, [5.051]–[5.052]', 'secondaryies': 'performance of existing duty, [5.062]', 'tertiaryies': ['contractual duty to promisor, [5.065]', 'existing contractual duty to third party, [5.068]', '“practical benefit”, [5.067]', 'public duties, [5.063]', 'case examples, [5.065], [5.066]', 'case examples, [5.063], [5.064]'], 'combine_concept': ['<br>{Consideration sufficiency :performance of existing duty :contractual duty to promisor }<br>', '<br>{Consideration sufficiency :performance of existing duty :existing contractual duty to third party }<br>', '<br>{Consideration sufficiency :performance of existing duty :“practical benefit” }<br>', '<br>{Consideration sufficiency :performance of existing duty :public duties }<br>', '<br>{Consideration sufficiency :performance of existing duty :case examples  }<br>', '<br>{Consideration sufficiency :performance of existing duty :case examples  }<br>']}
,
{'id': 43, 'primary': 'Consideration sufficiency, [5.051]–[5.052]', 'secondaryies': 'requirement, [5.043]', 'tertiaryies': [], 'combine_concept': ['<br>{Consideration sufficiency :requirement }<br>']}
,
{'id': 44, 'primary': 'Consideration sufficiency, [5.051]–[5.052]', 'secondaryies': '“sufficiency” and “adequacy” of consideration, distinguished, [5.050]', 'tertiaryies': [], 'combine_concept': ['<br>{Consideration sufficiency :“sufficiency” and “adequacy” of consideration distinguished }<br>']}
,
{'id': 45, 'primary': 'Consideration sufficiency, [5.051]–[5.052]', 'secondaryies': 'value of consideration, [5.046]', 'tertiaryies': ['inadequacy immaterial, [5.044], [5.045], [5.047], [5.049]'], 'combine_concept': ['<br>{Consideration sufficiency :value of consideration :inadequacy immaterial    }<br>']}
,
{'id': 46, 'primary': 'Contract of service, [16.017], [16.018]', 'secondaryies': 'bargaining power and, [3.058]', 'tertiaryies': [], 'combine_concept': ['<br>{Contract of service  :bargaining power and }<br>']}
,
{'id': 47, 'primary': 'Contract of service, [16.017], [16.018]', 'secondaryies': 'contract for service, distinguishing, [16.019]', 'tertiaryies': [], 'combine_concept': ['<br>{Contract of service  :contract for service distinguishing }<br>']}
,
{'id': 48, 'primary': 'Contract of service, [16.017], [16.018]', 'secondaryies': 'definition, [16.016]', 'tertiaryies': [], 'combine_concept': ['<br>{Contract of service  :definition }<br>']}
,
{'id': 49, 'primary': 'Contract of service, [16.017], [16.018]', 'secondaryies': 'judicial comment, [16.019]', 'tertiaryies': [], 'combine_concept': ['<br>{Contract of service  :judicial comment }<br>']}
,
{'id': 50, 'primary': 'Contract of service, [16.017], [16.018]', 'secondaryies': 'minors, [7.042]', 'tertiaryies': [], 'combine_concept': ['<br>{Contract of service  :minors }<br>']}
,
{'id': 51, 'primary': 'Contract of service, [16.017], [16.018]', 'secondaryies': 'probationer. See Probationer', 'tertiaryies': [], 'combine_concept': ['<br>{Contract of service  :probationer. See Probationer}<br>']}
,
{'id': 52, 'primary': 'Contract of service, [16.017], [16.018]', 'secondaryies': 'termination. See Termination of contract of employment', 'tertiaryies': [], 'combine_concept': ['<br>{Contract of service  :termination. See Termination of contract of employment}<br>']}
,
{'id': 53, 'primary': 'Contract of service, [16.017], [16.018]', 'secondaryies': 'terms and conditions. See Employment terms and conditions', 'tertiaryies': [], 'combine_concept': ['<br>{Contract of service  :terms and conditions. See Employment terms and conditions}<br>']}
,
{'id': 54, 'primary': 'Contract of service, [16.017], [16.018]', 'secondaryies': 'tests for, [16.020], [16.034]', 'tertiaryies': ['mixed or multiple test, [16.030]–[16.038]', 'organisation or integration test, [16.025]–[16.029]', 'traditional or control test, [16.021]–[16.024]'], 'combine_concept': ['<br>{Contract of service  :tests for  :mixed or multiple test }<br>', '<br>{Contract of service  :tests for  :organisation or integration test }<br>', '<br>{Contract of service  :tests for  :traditional or control test }<br>']}
,
{'id': 55, 'primary': 'Contract of service, [16.017], [16.018]', 'secondaryies': 'wrongful termination, damages for, [13.009]', 'tertiaryies': [], 'combine_concept': ['<br>{Contract of service  :wrongful termination damages for }<br>']}
,
{'id': 56, 'primary': 'Contracts. See also Agreements', 'secondaryies': 'acceptance subject to contract, [4.064]–[4.068]', 'tertiaryies': [], 'combine_concept': ['<br>{Contracts. See also Agreements:acceptance subject to contract }<br>']}
,
{'id': 57, 'primary': 'Contracts. See also Agreements', 'secondaryies': 'agreement made without consideration is void, [5.010]–[5.013]', 'tertiaryies': [], 'combine_concept': ['<br>{Contracts. See also Agreements:agreement made without consideration is void }<br>']}
,
{'id': 58, 'primary': 'Contracts. See also Agreements', 'secondaryies': 'commercial contract interpretation, [4.011]', 'tertiaryies': [], 'combine_concept': ['<br>{Contracts. See also Agreements:commercial contract interpretation }<br>']}
,
{'id': 59, 'primary': 'Contracts. See also Agreements', 'secondaryies': 'failure, [4.012]', 'tertiaryies': [], 'combine_concept': ['<br>{Contracts. See also Agreements:failure }<br>']}
,
{'id': 60, 'primary': 'Contracts Act 1950', 'secondaryies': '1800s-era principles, [4.123]', 'tertiaryies': [], 'combine_concept': ['<br>{Contracts Act 1950:1800s-era principles }<br>']}
,
{'id': 61, 'primary': 'Contracts Act 1950', 'secondaryies': 'agreement made without consideration is void, [5.010]–[5.013]', 'tertiaryies': [], 'combine_concept': ['<br>{Contracts Act 1950:agreement made without consideration is void }<br>']}
,
{'id': 62, 'primary': 'Contracts Act 1950', 'secondaryies': 'reforming, [4.126], [4.127]', 'tertiaryies': [], 'combine_concept': ['<br>{Contracts Act 1950:reforming  }<br>']}
,
{'id': 63, 'primary': 'Contracts Act 1950', 'secondaryies': 's 26, [5.010]–[5.013]', 'tertiaryies': [], 'combine_concept': ['<br>{Contracts Act 1950:s 26 }<br>']}
,
{'id': 64, 'primary': 'Contribution. See also Subrogation', 'secondaryies': 'definition, [23.130], [23.131], [24.045]', 'tertiaryies': [], 'combine_concept': ['<br>{Contribution. See also Subrogation:definition   }<br>']}
,
{'id': 65, 'primary': 'Counter offers', 'secondaryies': 'case examples, [4.114], [4.115]', 'tertiaryies': [], 'combine_concept': ['<br>{Counter offers:case examples  }<br>']}
,
{'id': 66, 'primary': 'Counter offers', 'secondaryies': 'modification of initial proposal by proposee, [4.112], [4.113]', 'tertiaryies': [], 'combine_concept': ['<br>{Counter offers:modification of initial proposal by proposee  }<br>']}
,
{'id': 67, 'primary': 'Counter offers', 'secondaryies': 'negotiations, common in, [4.116]', 'tertiaryies': [], 'combine_concept': ['<br>{Counter offers:negotiations common in }<br>']}
,
{'id': 68, 'primary': 'Counter offers', 'secondaryies': 'revocation, not, [4.112]', 'tertiaryies': [], 'combine_concept': ['<br>{Counter offers:revocation not }<br>']}
,
{'id': 69, 'primary': 'Duty of care. See also Negligence', 'secondaryies': 'currently, [15.018]–[15.020]', 'tertiaryies': ['Caparo Industries plc v Dickman, [15.019]', 'subsequent cases, [15.020]'], 'combine_concept': ['<br>{Duty of care. See also Negligence:currently :Caparo Industries plc v Dickman }<br>', '<br>{Duty of care. See also Negligence:currently :subsequent cases }<br>']}
,
{'id': 70, 'primary': 'Duty of care. See also Negligence', 'secondaryies': 'developments, [15.013]–[15.017]', 'tertiaryies': ['Australian approach, [15.017]', 'categories, analysis/creation, [15.013]', 'contractor/subcontractor and employer, [15.015]', 'two-stage test, [15.03], [15.014], [15.016], [15.017]'], 'combine_concept': ['<br>{Duty of care. See also Negligence:developments :Australian approach }<br>', '<br>{Duty of care. See also Negligence:developments :categories analysis/creation }<br>', '<br>{Duty of care. See also Negligence:developments :contractor/subcontractor and employer }<br>', '<br>{Duty of care. See also Negligence:developments :two-stage test    }<br>']}
,
{'id': 71, 'primary': 'Duty of care. See also Negligence', 'secondaryies': 'Donoghue v Stevenson, [15.010], [15.021]', 'tertiaryies': [], 'combine_concept': ['<br>{Duty of care. See also Negligence:Donoghue v Stevenson  }<br>']}
,
{'id': 72, 'primary': 'Duty of care. See also Negligence', 'secondaryies': 'Malaysia, [15.035]', 'tertiaryies': [], 'combine_concept': ['<br>{Duty of care. See also Negligence:Malaysia }<br>']}
,
{'id': 73, 'primary': 'Duty of care. See also Negligence', 'secondaryies': 'omission, [15.048]–[15.051]', 'tertiaryies': ['control of land or dangerous things, [15.056], [15.057]', 'definition, [15.048]', 'example, [15.050]'], 'combine_concept': ['<br>{Duty of care. See also Negligence:omission :control of land or dangerous things  }<br>', '<br>{Duty of care. See also Negligence:omission :definition }<br>', '<br>{Duty of care. See also Negligence:omission :example }<br>']}
,
{'id': 74, 'primary': 'Employment terms and conditions, [16.002], [16.005]', 'secondaryies': 'border-straddling estate, [16.015]', 'tertiaryies': [], 'combine_concept': ['<br>{Employment terms and conditions  :border-straddling estate }<br>']}
,
{'id': 75, 'primary': 'Employment terms and conditions, [16.002], [16.005]', 'secondaryies': 'exemption or exclusion by Minister, [16.014]', 'tertiaryies': [], 'combine_concept': ['<br>{Employment terms and conditions  :exemption or exclusion by Minister }<br>']}
,
{'id': 76, 'primary': 'Employment terms and conditions, [16.002], [16.005]', 'secondaryies': 'financial crises, [16.012]–[16.013]', 'tertiaryies': [], 'combine_concept': ['<br>{Employment terms and conditions  :financial crises }<br>']}
,
{'id': 77, 'primary': 'Employment terms and conditions, [16.002], [16.005]', 'secondaryies': 'Industrial Court, [16.010], [16.011], [16.013]', 'tertiaryies': [], 'combine_concept': ['<br>{Employment terms and conditions  :Industrial Court   }<br>']}
,
{'id': 78, 'primary': 'Employment terms and conditions, [16.002], [16.005]', 'secondaryies': 'less favourable terms prohibited, [16.005], [16.006]', 'tertiaryies': [], 'combine_concept': ['<br>{Employment terms and conditions  :less favourable terms prohibited  }<br>']}
,
{'id': 79, 'primary': 'Employment terms and conditions, [16.002], [16.005]', 'secondaryies': 'more favourable terms permitted, [16.007]', 'tertiaryies': [], 'combine_concept': ['<br>{Employment terms and conditions  :more favourable terms permitted }<br>']}
,
{'id': 80, 'primary': 'Employment terms and conditions, [16.002], [16.005]', 'secondaryies': 'other than statutory provisions, [16.009]', 'tertiaryies': [], 'combine_concept': ['<br>{Employment terms and conditions  :other than statutory provisions }<br>']}
,
{'id': 81, 'primary': 'Employment terms and conditions, [16.002], [16.005]', 'secondaryies': 'validity, [16.039]', 'tertiaryies': ['express prohibition, [16.0365', 'example, [16.040]'], 'combine_concept': ['<br>{Employment terms and conditions  :validity :express prohibition [16.0365}<br>', '<br>{Employment terms and conditions  :validity :example }<br>']}
,
{'id': 82, 'primary': 'English law. See also United Kingdom', 'secondaryies': 'acceptance communication, [4.069], [4.070], [4.073]', 'tertiaryies': [], 'combine_concept': ['<br>{English law. See also United Kingdom:acceptance communication   }<br>']}
,
{'id': 83, 'primary': 'English law. See also United Kingdom', 'secondaryies': 'agency, influence in Malaysia, [14.002]–[14.004]', 'tertiaryies': [], 'combine_concept': ['<br>{English law. See also United Kingdom:agency influence in Malaysia }<br>']}
,
{'id': 84, 'primary': 'English law. See also United Kingdom', 'secondaryies': 'reception in Malaysia, [14.002]', 'tertiaryies': [], 'combine_concept': ['<br>{English law. See also United Kingdom:reception in Malaysia }<br>']}
,
{'id': 85, 'primary': 'Estoppel', 'secondaryies': 'agency creation, [14.032], [14.033]', 'tertiaryies': [], 'combine_concept': ['<br>{Estoppel:agency creation  }<br>']}
,
{'id': 86, 'primary': 'Formation of contract', 'secondaryies': 'information request, [4.020]–[4.022]', 'tertiaryies': [], 'combine_concept': ['<br>{Formation of contract:information request }<br>']}
,
{'id': 87, 'primary': 'Formation of contract', 'secondaryies': 'overview, [4.001]–[4.013], [4.123]–[4.127]', 'tertiaryies': [], 'combine_concept': ['<br>{Formation of contract:overview  }<br>']}
,
{'id': 88, 'primary': 'Insurance and doctrine of proximate cause', 'secondaryies': 'takaful, [24.050]–[24.052]', 'tertiaryies': ['operator not liable for uncovered/excluded peril, [24.053]–[24.054]'], 'combine_concept': ['<br>{Insurance and doctrine of proximate cause:takaful :operator not liable for uncovered/excluded peril }<br>']}
,
{'id': 89, 'primary': 'Insurance form unacceptable to Muslims', 'secondaryies': 'gharar (danger or uncertainty), [24.003], [24.004]', 'tertiaryies': [], 'combine_concept': ['<br>{Insurance form unacceptable to Muslims:gharar (danger or uncertainty)  }<br>']}
,
{'id': 90, 'primary': 'Insurance form unacceptable to Muslims', 'secondaryies': 'maisir (gambling), [24.005], [24.006]', 'tertiaryies': [], 'combine_concept': ['<br>{Insurance form unacceptable to Muslims:maisir (gambling)  }<br>']}
,
{'id': 91, 'primary': 'Intention to create legal relationship', 'secondaryies': 'commercial agreements, [7.022]–[7.034]', 'tertiaryies': ['case example (UK), [7.026], [7.027]', 'industry, relevance, [7.031]'], 'combine_concept': ['<br>{Intention to create legal relationship:commercial agreements :case example (UK)  }<br>', '<br>{Intention to create legal relationship:commercial agreements :industry relevance }<br>']}
,
{'id': 92, 'primary': 'Invitation to treat, [4.023]–[4.027]', 'secondaryies': 'common categories, [4.028]', 'tertiaryies': ['advertisements, [4.029]–[4.032]', 'auctions, [4.033]–[4.036]', 'options, [4.039]–[4.042]', 'tenders, [4.037], [4.038]'], 'combine_concept': ['<br>{Invitation to treat :common categories :advertisements }<br>', '<br>{Invitation to treat :common categories :auctions }<br>', '<br>{Invitation to treat :common categories :options }<br>', '<br>{Invitation to treat :common categories :tenders  }<br>']}
,
{'id': 93, 'primary': 'Invitation to treat, [4.023]–[4.027]', 'secondaryies': 'definition, [4.024]', 'tertiaryies': ['Contracts Act 1950 not providing, [4.023]'], 'combine_concept': ['<br>{Invitation to treat :definition :Contracts Act 1950 not providing }<br>']}
,
{'id': 94, 'primary': 'Invitation to treat, [4.023]–[4.027]', 'secondaryies': 'presumption and challenge, [4.026]', 'tertiaryies': ['case example, [4.027]'], 'combine_concept': ['<br>{Invitation to treat :presumption and challenge :case example }<br>']}
,
{'id': 95, 'primary': 'Invitation to treat, [4.023]–[4.027]', 'secondaryies': 'reasons for making, [4.025]', 'tertiaryies': [], 'combine_concept': ['<br>{Invitation to treat :reasons for making }<br>']}
,
{'id': 96, 'primary': 'Invitation to treat, [4.023]–[4.027]', 'secondaryies': 'statement as, [4.019], [4.024]', 'tertiaryies': [], 'combine_concept': ['<br>{Invitation to treat :statement as  }<br>']}
,
{'id': 97, 'primary': 'Islamic Financial Services Act 2013', 'secondaryies': 'permissible takaful interest, [24.013]–[24.017]', 'tertiaryies': [], 'combine_concept': ['<br>{Islamic Financial Services Act 2013:permissible takaful interest }<br>']}
,
{'id': 98, 'primary': 'Law of agency', 'secondaryies': 'agency relationship, [14.005], [14.006]', 'tertiaryies': ['contracts, [14.007]', 'Latin maxim, [14.008]'], 'combine_concept': ['<br>{Law of agency:agency relationship  :contracts }<br>', '<br>{Law of agency:agency relationship  :Latin maxim }<br>']}
,
{'id': 99, 'primary': 'Law of agency', 'secondaryies': 'agent, definition, [14.005]', 'tertiaryies': [], 'combine_concept': ['<br>{Law of agency:agent definition }<br>']}
,
{'id': 100, 'primary': 'Law of agency', 'secondaryies': 'English law in Malaysia, influence, [14.002]–[14.004]', 'tertiaryies': ['Civil Law Act 1956 (Mal) ss 3 and 5, [14.002], [14.004]', 'cut-off dates, [14.003]'], 'combine_concept': ['<br>{Law of agency:English law in Malaysia influence :Civil Law Act 1956 (Mal) ss 3 and 5  }<br>', '<br>{Law of agency:English law in Malaysia influence :cut-off dates }<br>']}
,
{'id': 101, 'primary': 'Law of agency', 'secondaryies': 'estate agency, [14.041]', 'tertiaryies': [], 'combine_concept': ['<br>{Law of agency:estate agency }<br>']}
,
{'id': 102, 'primary': 'Law of agency', 'secondaryies': 'governing law, [14.001]', 'tertiaryies': [], 'combine_concept': ['<br>{Law of agency:governing law }<br>']}
,
{'id': 103, 'primary': 'Law of agency', 'secondaryies': 'principal, definition, [14.005]', 'tertiaryies': [], 'combine_concept': ['<br>{Law of agency:principal definition }<br>']}
,
{'id': 104, 'primary': 'Law of agency', 'secondaryies': 'privity of contract and, [14.009], [14.010]', 'tertiaryies': [], 'combine_concept': ['<br>{Law of agency:privity of contract and  }<br>']}
,
{'id': 105, 'primary': 'Law of agency', 'secondaryies': 'termination of agency, [14.039]', 'tertiaryies': [], 'combine_concept': ['<br>{Law of agency:termination of agency }<br>']}
,
{'id': 106, 'primary': 'Mental disorder', 'secondaryies': 'capacity to contract of persons of unsound mind, [7.045]', 'tertiaryies': ['caution, critical thought and evaluation, [7.048]', 'sound mind, [7.045]–[7.047]', 'unsound mind contracting during lucidity, [7.049], [7.050]'], 'combine_concept': ['<br>{Mental disorder:capacity to contract of persons of unsound mind :caution critical thought and evaluation }<br>', '<br>{Mental disorder:capacity to contract of persons of unsound mind :sound mind }<br>', '<br>{Mental disorder:capacity to contract of persons of unsound mind :unsound mind contracting during lucidity  }<br>']}
,
{'id': 107, 'primary': 'Negligence', 'secondaryies': 'definition, [15.005]', 'tertiaryies': [], 'combine_concept': ['<br>{Negligence:definition }<br>']}
,
{'id': 108, 'primary': 'Negligence', 'secondaryies': 'Donoghue v Stevenson, [15.006], [15.008]', 'tertiaryies': [], 'combine_concept': ['<br>{Negligence:Donoghue v Stevenson  }<br>']}
,
{'id': 109, 'primary': 'Negligence', 'secondaryies': 'elements, [15.005]–[15.008]', 'tertiaryies': [], 'combine_concept': ['<br>{Negligence:elements }<br>']}
,
{'id': 110, 'primary': 'Negligence', 'secondaryies': 'English law, [15.006]', 'tertiaryies': [], 'combine_concept': ['<br>{Negligence:English law }<br>']}
,
{'id': 111, 'primary': 'Negligence', 'secondaryies': 'establishing, [15.007]', 'tertiaryies': [], 'combine_concept': ['<br>{Negligence:establishing }<br>']}
,
{'id': 112, 'primary': 'Negligence', 'secondaryies': 'history, [15.006]', 'tertiaryies': [], 'combine_concept': ['<br>{Negligence:history }<br>']}
,
{'id': 113, 'primary': 'Notice', 'secondaryies': 'proposal revocation, [4.091]–[4.101]', 'tertiaryies': [], 'combine_concept': ['<br>{Notice:proposal revocation }<br>']}
,
{'id': 114, 'primary': 'Options', 'secondaryies': 'invitations to treat, as, [4.039]', 'tertiaryies': [], 'combine_concept': ['<br>{Options:invitations to treat as }<br>']}
,
{'id': 115, 'primary': 'Options', 'secondaryies': 'Low Kar Yit v Mohamed Isa, [4.040]–[4.042]', 'tertiaryies': [], 'combine_concept': ['<br>{Options:Low Kar Yit v Mohamed Isa }<br>']}
,
{'id': 116, 'primary': 'Oral contracts', 'secondaryies': 'acceptance case example, [4.057]', 'tertiaryies': ['evidence, importance, [4.058]'], 'combine_concept': ['<br>{Oral contracts:acceptance case example :evidence importance }<br>']}
,
{'id': 117, 'primary': 'Past consideration', 'secondaryies': 'common law, [5.031]', 'tertiaryies': [], 'combine_concept': ['<br>{Past consideration:common law }<br>']}
,
{'id': 118, 'primary': 'Privity of contract', 'secondaryies': 'agency and, [14.009], [14.010]', 'tertiaryies': [], 'combine_concept': ['<br>{Privity of contract:agency and  }<br>']}
,
{'id': 119, 'primary': 'Promissory estoppel. See also Consideration', 'secondaryies': 'High Trees case, [6.005]–[6.009]', 'tertiaryies': [], 'combine_concept': ['<br>{Promissory estoppel. See also Consideration:High Trees case }<br>']}
,
{'id': 120, 'primary': 'Proposal', 'secondaryies': 'communication of, [4.046]–[4.051]', 'tertiaryies': ['acceptance motive, [4.051]', 'case example, [4.049]', 'effect, [4.048]', 'knowledge of proposee required, [4.047], [4.050]', 'means of communication, [4.046]'], 'combine_concept': ['<br>{Proposal:communication of :acceptance motive }<br>', '<br>{Proposal:communication of :case example }<br>', '<br>{Proposal:communication of :effect }<br>', '<br>{Proposal:communication of :knowledge of proposee required  }<br>', '<br>{Proposal:communication of :means of communication }<br>']}
,
{'id': 121, 'primary': 'Proposal', 'secondaryies': 'examples of analysis of existence, [4.006], [4.007]', 'tertiaryies': [], 'combine_concept': ['<br>{Proposal:examples of analysis of existence  }<br>']}
,
{'id': 122, 'primary': 'Proposal', 'secondaryies': 'requirement to make business and economic sense, [4.043]–[4.045]', 'tertiaryies': ['case example, [4.043]', 'effect of not making sense, [4.045]', 'principle, [4.044]'], 'combine_concept': ['<br>{Proposal:requirement to make business and economic sense :case example }<br>', '<br>{Proposal:requirement to make business and economic sense :effect of not making sense }<br>', '<br>{Proposal:requirement to make business and economic sense :principle }<br>']}
,
{'id': 123, 'primary': 'Proposal', 'secondaryies': 'test for, objective, [4.008]', 'tertiaryies': ['case examples, [4.009], [4.010]'], 'combine_concept': ['<br>{Proposal:test for objective :case examples  }<br>']}
,
{'id': 124, 'primary': 'Proposal revocation, [4.087]', 'secondaryies': 'common law, [4.093], [4.097]', 'tertiaryies': ['English cases, [4.094], [4.095]'], 'combine_concept': ['<br>{Proposal revocation :common law  :English cases  }<br>']}
,
{'id': 125, 'primary': 'Proposal revocation, [4.087]', 'secondaryies': 'communication, [4.091], [4.099], [4.100]', 'tertiaryies': ['third party, by, [4.096]'], 'combine_concept': ['<br>{Proposal revocation :communication   :third party by }<br>']}
,
{'id': 126, 'primary': 'Pure economic loss', 'secondaryies': 'duty of care, [15.036]–[15.047]', 'tertiaryies': ['connection with damage type, [15.046]', 'contractual matrix, [15.047]', 'defective structures and products, [15.043]', 'English courts’ caution, [15.042]', 'negligent misstatements, [15.041]', 'proximity, [15.045]', 'special relationship between parties, [15.040]', 'criteria, [15.039]'], 'combine_concept': ['<br>{Pure economic loss:duty of care :connection with damage type }<br>', '<br>{Pure economic loss:duty of care :contractual matrix }<br>', '<br>{Pure economic loss:duty of care :defective structures and products }<br>', '<br>{Pure economic loss:duty of care :English courts’ caution }<br>', '<br>{Pure economic loss:duty of care :negligent misstatements }<br>', '<br>{Pure economic loss:duty of care :proximity }<br>', '<br>{Pure economic loss:duty of care :special relationship between parties }<br>', '<br>{Pure economic loss:duty of care :criteria }<br>']}
,
{'id': 127, 'primary': 'Pure economic loss', 'secondaryies': 'history, [15.036], [15.037]', 'tertiaryies': [], 'combine_concept': ['<br>{Pure economic loss:history  }<br>']}
,
{'id': 128, 'primary': 'Ratification', 'secondaryies': 'definition, [14.022]', 'tertiaryies': [], 'combine_concept': ['<br>{Ratification:definition }<br>']}
,
{'id': 129, 'primary': 'Shariah Advisory Council (SAC)', 'secondaryies': 'permissible takaful interest resolution before Islamic Financial Services Act 2013, [24.012]', 'tertiaryies': [], 'combine_concept': ['<br>{Shariah Advisory Council (SAC):permissible takaful interest resolution before Islamic Financial Services Act 2013 }<br>']}
,
{'id': 130, 'primary': 'Sound mind', 'secondaryies': 'Contracts Act 1950, under, [7.045], [7.046]', 'tertiaryies': [], 'combine_concept': ['<br>{Sound mind:Contracts Act 1950 under  }<br>']}
,
{'id': 131, 'primary': 'Sound mind', 'secondaryies': 'definition, [7.045]', 'tertiaryies': [], 'combine_concept': ['<br>{Sound mind:definition }<br>']}
,
{'id': 132, 'primary': 'Sound mind', 'secondaryies': 'evidence requirement, [7.047]', 'tertiaryies': [], 'combine_concept': ['<br>{Sound mind:evidence requirement }<br>']}
,
{'id': 133, 'primary': 'Subrogation. See also Contribution', 'secondaryies': 'definition, [23.120]–[23.122], [24.040]', 'tertiaryies': [], 'combine_concept': ['<br>{Subrogation. See also Contribution:definition  }<br>']}
,
{'id': 134, 'primary': 'Subrogation. See also Contribution', 'secondaryies': 'takaful, [24.040]–[24.044]', 'tertiaryies': [], 'combine_concept': ['<br>{Subrogation. See also Contribution:takaful }<br>']}
,
{'id': 135, 'primary': 'Takaful', 'secondaryies': 'principle, [24.019]–[24.022]', 'tertiaryies': [], 'combine_concept': ['<br>{Takaful:principle }<br>']}
,
{'id': 136, 'primary': 'Terms of contract', 'secondaryies': 'determination by court, [4.005]', 'tertiaryies': [], 'combine_concept': ['<br>{Terms of contract:determination by court }<br>']}
,
{'id': 137, 'primary': 'Torts', 'secondaryies': 'function of the law of tort, [15.004]', 'tertiaryies': [], 'combine_concept': ['<br>{Torts:function of the law of tort }<br>']}
,
{'id': 138, 'primary': 'Trade unions', 'secondaryies': 'Director-General of Trade Union, discretion of, [17.032]–[17.033]', 'tertiaryies': [], 'combine_concept': ['<br>{Trade unions:Director-General of Trade Union discretion of }<br>']}
,
{'id': 139, 'primary': 'United Kingdom. See also English law', 'secondaryies': 'promissory estoppel limits stretched, [6.018]–[6.023]', 'tertiaryies': [], 'combine_concept': ['<br>{United Kingdom. See also English law:promissory estoppel limits stretched }<br>']}
,
{'id': 140, 'primary': 'United Kingdom. See also English law', 'secondaryies': 'proposal revocation at common law, [4.094], [4.095]', 'tertiaryies': [], 'combine_concept': ['<br>{United Kingdom. See also English law:proposal revocation at common law  }<br>']}
,
{'id': 141, 'primary': 'Unsound mind', 'secondaryies': 'capacity to contract of persons of unsound mind, [7.045]', 'tertiaryies': ['caution, critical thought and evaluation, [7.048]', 'sound mind, [7.045]–[7.047]', 'unsound mind contracting during lucidity, [7.049], [7.050]'], 'combine_concept': ['<br>{Unsound mind:capacity to contract of persons of unsound mind :caution critical thought and evaluation }<br>', '<br>{Unsound mind:capacity to contract of persons of unsound mind :sound mind }<br>', '<br>{Unsound mind:capacity to contract of persons of unsound mind :unsound mind contracting during lucidity  }<br>']}
,
{'id': 142, 'primary': 'Words and phrases', 'secondaryies': 'agent, [14.005]', 'tertiaryies': [], 'combine_concept': ['<br>{Words and phrases:agent }<br>']}
,
{'id': 143, 'primary': 'Words and phrases', 'secondaryies': 'auction, [4.033]', 'tertiaryies': [], 'combine_concept': ['<br>{Words and phrases:auction }<br>']}
,
{'id': 144, 'primary': 'Words and phrases', 'secondaryies': 'consideration, [5.004]–[5.009]', 'tertiaryies': [], 'combine_concept': ['<br>{Words and phrases:consideration }<br>']}
,
{'id': 145, 'primary': 'Words and phrases', 'secondaryies': 'contribution, [23.130], [23.131], [24.045]', 'tertiaryies': [], 'combine_concept': ['<br>{Words and phrases:contribution   }<br>']}
,
{'id': 146, 'primary': 'Words and phrases', 'secondaryies': 'invitation to treat, [4.024]', 'tertiaryies': [], 'combine_concept': ['<br>{Words and phrases:invitation to treat }<br>']}
,
{'id': 147, 'primary': 'Words and phrases', 'secondaryies': 'negligence, [15.005]', 'tertiaryies': [], 'combine_concept': ['<br>{Words and phrases:negligence }<br>']}
,
{'id': 148, 'primary': 'Words and phrases', 'secondaryies': 'principal, [14.005]', 'tertiaryies': [], 'combine_concept': ['<br>{Words and phrases:principal }<br>']}
,
{'id': 149, 'primary': 'Words and phrases', 'secondaryies': 'ratification, [14.022]', 'tertiaryies': [], 'combine_concept': ['<br>{Words and phrases:ratification }<br>']}
,
{'id': 150, 'primary': 'Words and phrases', 'secondaryies': 'sale by auction, [4.034]', 'tertiaryies': [], 'combine_concept': ['<br>{Words and phrases:sale by auction }<br>']}
,
{'id': 151, 'primary': 'Words and phrases', 'secondaryies': 'sound mind, [7.045]', 'tertiaryies': [], 'combine_concept': ['<br>{Words and phrases:sound mind }<br>']}
,
{'id': 152, 'primary': 'Words and phrases', 'secondaryies': 'subrogation, [23.120]–[23.122], [24.040]', 'tertiaryies': [], 'combine_concept': ['<br>{Words and phrases:subrogation  }<br>']}

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
                '<td>' + value.primary + '</td>\n' +
                '<td>' + value.secondaryies + '</td>\n' +
                '<td>' + value.tertiaryies + '</td>\n' +
                '<td>' + value.combine_concept + '</td>\n' +
                '</tr>');
    });
}