// Scenario list constant.
const scenarioList = [
    { id: 1, text: "On 1 November, Ahmad who lives next door to Hussain called on Hussain and offer to sell his IBM computer for RM2,000 . On 3 November, Hussain wrote and posted a letter to Ahmad accepting the offer. The letter was not addressed properly. Hence Ahmad received the letter of acceptance on 8 November instead of on 5 November. On the evening of 6 November, Ahmad telephoned Hussain and said 'I revoke my offer to you'" },
    { id: 2, text: "'Cathy's son, Dave, aged 21, was studying for a diploma in computer science at a University in Kuala Lumpur. He lived in a student residence. It was a city council legislative requirement that it was illegal to smoke in student residence, offices, shops, or any enclosed place where someone else is residing, studying or working within the campus. Dave gave up smoking due to this requirement.However, Cathy was worried that under the pressure of preparing for the examination Dave would start smoking again, and so she promised to pay Dave RM500 if he did not smoke at all until he had completed the course.She also promised to buy him a car if he passed the examinations.Cathy run an online bookstore, and asked Dave to maintain and update the website from time to time.She was pleased with the result, and said she would give him RM1, 000 'for all his hard work'. Dave passed his examinations, obtained his diploma and moved to live in Johor Bahru where there was no legal requirement on banning of smoking in public enclosed areas.He has not started to smoke again after he left Kuala Lumpur.Cathy has not made either of the promised payments, or bought the car." },
    { id: 3, text: "Alan needed money quickly. He owned an original 1886 edition of Kidnapped by Robert Louis Stevenson, a book which he advertised in the newspaper for sale for $1000. Cate saw the advertisement.She telephoned Alan, saying that she would buy the book for $1000. Alan, however, replied that he had reconsidered the matter and that he could not sell the book for less than $2000.Cate replied that she would give him $1500. Alan replied that he would only sell the book for $2000 but that he would keep his offer open for seven days.He also said that Cate could fax her acceptance to him if she wanted.The next day Alan sold the book to his friend David because David loved the book so much and because he paid $7000 for it. Two days later Cate decided to purchase the book for Alan's price of $2000.She posted her acceptance to Alan.The next day David told Cate that he had bought a copy of Kidnapped from Alan for $7, 000. Cate rang Alan to confirm that she had accepted his offer.Later that day Alan received Cate's acceptance." },
    {
        id: 4, text: "Ellie’s Montblanc pen with her name engraved on it was stolen. She puts an advertisement on her personal blog advertising a reward of RM1,000 to anyone who finds it. Frank, who has not seen the advertisement, discovers the pen in a library locker and takes it home. His course mate, Galvin, on seeing the pen, recognizes it as the one for which the reward has been offered, and shows Frank the advertisement in Ellie’s blog. Frank returns the pen to Ellie, but she refuses to pay RM 1,000, saying that the offer has been withdrawn. Frank knows that Galvin has been keen to buy his vintage Vespa scooter.On Sunday he tells Galvin that he has decided to sell at RM 5, 000.Galvin says that he is very interested but would like to think about it.Frank says ‘I will assume that you want it, unless you tell me otherwise by Friday’.On Thursday, Galvin meets Hassan who tells him that Frank has just agreed to sell the scooter to Jaya for RM6, 000.Galvin immediately texted Frank accepting his offer.Later that day, however, Galvin changes his mind and calls on Frank to tell him to ignore the text message.Frank tells him that his deal with Jaya has fallen through, and he is still keen to sell it to Galvin." }
];

// Store the courtCasePageNumber button Ids.
var courtCasePageNumberIds = [];

// Store related section buttons Ids.
var relatedSectionBtnIds = [];

var currentCourtCaseCount = 1;

// function that runs all necessary initial retrieval.
function init() {
    // Get the first id scenerio from db.
    getScenarioList();
    createRelationButtons();
    displayUser();
    getLegalConcepts();
    createReasonButtons();
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
    var selectText_Tags = highlitedObject;
    var Username = document.getElementById('userDisplay');
    var scenarioID = document.getElementById('scenarioSelect');
    var issues = document.getElementById('issues');
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
        "Sections": selectedSectionOptions,
        "RelatedCourtCase_pageNumList": relatedCourtCasePageNumbers,
        "Analysis": analysis.value,
        "Conclusion": conclusion.value,
        "Original_Objects": highlitedObject
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