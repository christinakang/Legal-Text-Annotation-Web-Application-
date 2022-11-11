window.addEventListener('DOMContentLoaded', function (e) {
    // Get file input
    const fileInput = document.querySelector('#usersFileData');
    const output = document.querySelector('#output');
    var data = [];

    // Event listeners
    fileInput.addEventListener('change', handleFiles);

    // change event handler
    function handleFiles(event) {
        // Check for the various File API support.
        if (window.FileReader) {
            // get first user selected file
            const file = event.target.files[0];
            // if FileReader are supported.
            getFileData(file);
        } else {
            alert('FileReader are not supported in this browser.');
        }
    }

    // Get file content data based on file extenation and type
    function getFileData(fileToRead) {
        const fileType = fileToRead.type.split('.').pop();
        switch (fileType) {
            case 'text/plain':
                getAsText(fileToRead);
                break;
            case 'ms-excel':
                getAsCSV(fileToRead);
                break;
            default:
                alert(`Not support this file`);
                break;
        }
    }

    // Read text file data
    function getAsText(fileToRead) {
        // init file reader object
        const reader = new FileReader();
        // reade text file
        reader.readAsText(fileToRead, 'UTF-8');
        reader.onload = function (e) {
            const txt = e.target.result;
            drawData(txt);
        };
        reader.onerror = errorHandler;
    }

    // Read CSV sheet file data
    function getAsCSV(fileToRead) {
        // init file reader object
        const reader = new FileReader();
        // reade text file
        reader.readAsText(fileToRead, 'UTF-8');
        reader.onload = function (e) {
            const csv = e.target.result;
            drawData(csv);
        };
        reader.onerror = errorHandler;
    }

    // Error handler
    function errorHandler(e) {
        if (e.target.error.name == 'NotReadableError') {
            alert(`Can't read this file`);
        }
    }

    // Display file content
    function drawData(data) {
        data_json = JSON.parse(data);
        console.log(data_json);


        scenarioID = data_json.ScenarioID;
        //console.log(data_json.ScenarioID);
        $.each(scenarioList, function (index, value) {
            if (value.id == scenarioID) {
                changeScenarioText(value);
            }
        });
        document.getElementById("scenarioSelect").value = scenarioID;


        //add tags and relations
        object = data_json.Original_Objects;
        //console.log('object');
        //console.log(object);
        selectedAnnotation.push(object);
        highlitedObject.push(object);
        updateHilight(selectedAnnotation);

        issues = data_json.Issues;
        document.getElementById("issues").value = issues;

        //$('#selectedSections').selectpicker('val', sections_selec);

        courtCase = data_json.RelatedCourtCase_pageNum;
        //console.log(courtCase);
        var tmp = JSON.stringify(courtCase).split('[');
        //console.log(tmp);

        document.getElementById("relatedCourtCase").value = tmp[0].replace('"','');
        var num = tmp[1].replace('[','');
        num = num.replace(']','');
        num = num.replace('"','');
        document.getElementById("courtCase_Num").value = num;

        generateCourtCasePageNumberBtn();

        anlysis = data_json.Analysis;
        document.getElementById("analysisTextArea").value = anlysis;

        conclusion = data_json.Conclusion;
        document.getElementById("conclusion").value = conclusion;

    }
});
/*
//if your csv file contains the column names as the first line
function processDataAsObj(csv){
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];

    //first line of csv
    var keys = allTextLines.shift().split(',');

    while (allTextLines.length) {
        var arr = allTextLines.shift().split(',');
        var obj = {};
        for(var i = 0; i < keys.length; i++){
            obj[keys[i]] = arr[i];
    }
        lines.push(obj);
    }
        console.log(lines);
    drawOutputAsObj(lines);
}
*/

// Change the scenario text based on retrieved scenario text from db.
function changeScenarioText(scenario) {
    var scenarioText = document.getElementById("ScenarioText");
    scenarioText.innerHTML = scenario.text;
}


function updateHilight(object){

    object.forEach(item => {
      for (let i = 0; i < Object.keys(item).length; i++) {
        annotation = item[i];
        console.log(annotation);
          if (annotation.motivation == null && annotation.motivation != 'linking') {
            //console.log('no linking');
            selectedAnnotation.push({selectedText: annotation.target.selector[0].exact, selectedTag: annotation.body[0].value });
            // On created annotation add a button with selected text for IRAC Analysis processing.
            var selectedAnnotationText = '{' + annotation.target.selector[0].exact + '[' + annotation.body[0].value + ']}';

            var annotationBtnDiv = document.getElementById('annotationBtns');

            // Create button element.
            var button = document.createElement('button');

            button.type = 'button';
            button.className = 'btn btn-outline-info';

            // Id will be the selectedAnnotationText + 'Btn'.
            // Ex.Selected legal => The button id is 'legalBtn'.
            // It is case senstive and also will take in spaces.
            button.id = selectedAnnotationText + 'Btn';

            // Save to a list of existing annotation buttons.
            annotationBtnIds.push(button.id);

            // Add text to be displayed on button.
            button.innerHTML = selectedAnnotationText;

            // Add onClick event to add the selected annotation to analysis text area at the cursor.
            button.addEventListener('click', function (event) {
                console.log(button.innerHTML);

                // Get current position of cursor at analysis text area.
                // If no cursor, it will append at the end of the textArea's text.
                var analysisTxtBox = document.getElementById('analysisTextArea');
                let curPos = analysisTxtBox.selectionStart;

                // Get current text in analysisTextArea.
                var analysisTextAreaValue = $('#analysisTextArea').val();

                // Insert text at cursor position.
                $('#analysisTextArea').val(
                    analysisTextAreaValue.slice(0, curPos) + selectedAnnotationText + analysisTextAreaValue.slice(curPos));

                // Restore cursor position to end of analysis text area after clicking on button.
                analysisTextArea.focus();
            });

            // Append the  button to annotation div.
            annotationBtnDiv.appendChild(button);

        }
        else {
            //capture relation tagging
            //console.log('linking');
            //console.log(item[i]);
            var relation = annotation.body[0].value;
            var target1 = annotation.target[0].id;
            var target2 = annotation.target[1].id;

            var object1 = item.find(obj => obj.id === target1);
            word1 = object1.target.selector[0].exact + '[' + object1.body[0].value + '] ';

            var object2 = item.find(obj => obj.id === target2);
            word2 = object2.target.selector[0].exact + '[' + object1.body[0].value + ']  ';

            var finalRelation = ' { (' + word1 + ')' + ' (' + relation + ') ' + '(' + word2 + ') } '

            //console.log(finalRelation);

            var annotationBtnDiv = document.getElementById('annotationBtnsRelations');

            // Create button element.
            var button = document.createElement('button');

            button.type = 'button';
            button.className = 'btn btn-outline-success';

            // Id will be the selectedAnnotationText + 'Btn'.
            // Ex.Selected legal => The button id is 'legalBtn'.
            // It is case senstive and also will take in spaces.
            button.id = finalRelation + 'Btn';

            // Save to a list of existing annotation buttons.
            annotationBtnIds.push(button.id);

            // Add text to be displayed on button.
            button.innerHTML = finalRelation;

            // Add onClick event to add the selected annotation to analysis text area at the cursor.
            button.addEventListener('click', function (event) {
                console.log(button.innerHTML);

                // Get current position of cursor at analysis text area.
                // If no cursor, it will append at the end of the textArea's text.
                var analysisTxtBox = document.getElementById('analysisTextArea');
                let curPos = analysisTxtBox.selectionStart;

                // Get current text in analysisTextArea.
                var analysisTextAreaValue = $('#analysisTextArea').val();

                // Insert text at cursor position.
                $('#analysisTextArea').val(
                    analysisTextAreaValue.slice(0, curPos) + finalRelation + analysisTextAreaValue.slice(curPos));

                // Restore cursor position to end of analysis text area after clicking on button.
                analysisTextArea.focus();
            });

            // Append the  button to annotation div.
            annotationBtnDiv.appendChild(button);
        };
 }
 });
}


function generateCourtCasePageNumberBtn() {
    // If either field is null, do not create button.
    var relatedCourtCaseField = document.getElementById('relatedCourtCase');
    var relatedCourtCaseNumField = document.getElementById('courtCase_Num');

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







