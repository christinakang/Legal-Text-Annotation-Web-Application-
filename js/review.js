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
       // const lines = data.split(`\r\n`);
        /*let str = '';
        lines.forEach(function (line) {
            str += `${line} <br>`;
        });*/

        //put the read content into the scenario
        /*
        tmp = lines[1].split(':');
        //console.log(tmp);
        scenarioID = tmp[1];
        console.log(scenarioID);
        $.each(scenarioList, function (index, value) {
            if (value.id == scenarioID) {
                changeScenarioText(value);
            }
        });
        
        document.getElementById("scenarioSelect").value = scenarioID;

          

        //update IRAC form
        tmp = lines[3].split(':');
        issues = tmp[1];
        document.getElementById("issues").value = issues;

        tmp = lines[4].split(':');
        sections = tmp[1];
        console.log(sections);
        document.getElementById("selectedSections").value = sections;

        tmp = lines[5].split(':');
        courtCase = tmp[1];
        console.log(courtCase);
        document.getElementById("relatedCourtCase").value = courtCase;

        tmp = lines[6].split(':');
        courtCaseNUM = tmp[1];
        console.log(courtCaseNUM);
        document.getElementById("courtCase_Num").value = courtCaseNUM;

        tmp = lines[7].split(':');
        anlysis = tmp[1];
        document.getElementById("analysisTextArea").value = anlysis;

        tmp = lines[8].split(':');
        conclusion = tmp[1];
        document.getElementById("conclusion").value = conclusion;

        tmp = lines[9].split(':');
        object = tmp[1];
        console.log(object);
        */

        //output.innerHTML = str;

        data_json = JSON.parse(data);
        console.log(data_json);

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





