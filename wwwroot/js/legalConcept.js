const legalConceptUri = 'api/legalconcepts';

// function that runs all necessary initial retrieval.

function init() {
    getLegalConcepts();
}

// function to get scenario based on id.
function getLegalConcepts() {
    // remove all table rows except the first(header).
    $("#legalConceptTable").find("tr:not(:first)").remove();

    // call db to get all legal concepts.
    fetch(legalConceptUri)
        .then(response => response.json())
        .then(data => legalConcepts = displayLegalConcepts(data))
        .catch(error => console.error('Unable to get legal concepts', error));
}

// assign legal concept rows of data to legal concepts table html.
function displayLegalConcepts(legalConcepts) {
    var table = document.getElementById("legalConceptTable");

    $.each(legalConcepts, function (index, value) {
        table.innerHTML +=
            ('<tr>\n' +
                '<td>' + value.name + '</td>\n' +
                '<td>' + value.relatedTopic + '</td>\n' +
                '<td>' + value.relatedSection + '</td>\n' +
                '<td>' + value.other + '</td>\n' +
                '<td>' +
                '<button onclick="getLegalConcept(' + value.id + ')"data-toggle="modal" data-target="#updateLegalConceptModal">Update <i class="fas fa-pen"></i></button>\n' +
                '<button onclick="deleteLegalConcept(' + value.id + ')">Delete <i class="fas fa-trash"></i></button></button>\n' +
                '</td>\n' +
                '</tr>');
    });
}

// Function to add new legal concept.
function addLegalConcept() {
    const nameInput = document.getElementById('nameInput');
    const relatedTopicInput = document.getElementById('relatedTopicInput');
    const relatedSectionInput = document.getElementById('relatedSectionInput');
    const otherInput = document.getElementById('otherInput');

    const legalConceptObj = {
        name: nameInput.value.trim(),
        relatedTopic: relatedTopicInput.value.trim(),
        relatedSection: relatedSectionInput.value.trim(),
        other: otherInput.value.trim(),
    };

    fetch(legalConceptUri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(legalConceptObj)
    })
        .then(response => response.json())
        .then(() => {
            getLegalConcepts();

            // Reset input fields.

            nameInput.value = null;
            relatedTopicInput.value = null;
            relatedSectionInput.value = null;
            otherInput.value = null;
        })
        .catch(error => console.error('Unable to create legal concept.', error));
}

// Get target legal concept and assign to update inputs.
function getLegalConcept(id) {
    fetch(`${legalConceptUri}/${id}`)
        .then(response => response.json())
        .then(data => changeUpdateInputs(data))
        .catch(error => console.error('Unable to get scenario ${id}', error));
}

// Change update inputs to retrieved legal concept parameters.
function changeUpdateInputs(legalConcept) {
    // Get html element reference.
    var idInput = document.getElementById("idInputUpdate");
    var nameInput = document.getElementById("nameInputUpdate");
    var relatedTopicInput = document.getElementById("relatedTopicInputUpdate");
    var relatedSectionInput = document.getElementById("relatedSectionInputUpdate");
    var otherInput = document.getElementById("otherInputUpdate");

    // Assign legalConcept information to html inputs.
    idInput.value = legalConcept.id;
    nameInput.value = legalConcept.name;
    relatedTopicInput.value = legalConcept.relatedTopic;
    relatedSectionInput.value = legalConcept.relatedSection;
    otherInput.value = legalConcept.other;
}

// Update target legal concept.
function updateLegalConcept() {
    var idInputUpdate = document.getElementById("idInputUpdate");
    var nameInputUpdate = document.getElementById("nameInputUpdate");
    var relatedTopicInputUpdate = document.getElementById("relatedTopicInputUpdate");
    var relatedSectionInputUpdate = document.getElementById("relatedSectionInputUpdate");
    var otherInputUpdate = document.getElementById("otherInputUpdate");

    var id = parseInt(idInputUpdate.value, 10);

    const legalConceptObj = {
        id: id,
        name: nameInputUpdate.value.trim(),
        relatedTopic: relatedTopicInputUpdate.value.trim(),
        relatedSection: relatedSectionInputUpdate.value.trim(),
        other: otherInputUpdate.value.trim(),
    };

    fetch(`${legalConceptUri}/${id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(legalConceptObj)
    })
        .then(() => {
            getLegalConcepts();

            // Reset input fields.

            idInputUpdate.value = null;
            nameInputUpdate.value = null;
            relatedTopicInputUpdate.value = null;
            relatedSectionInputUpdate.value = null;
            otherInputUpdate.value = null;
        })
        .catch(error => console.error('Unable to update legalConcept.', error));
}

// delete legal concept from database.
function deleteLegalConcept(id) {
    fetch(`${legalConceptUri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => {
            getLegalConcepts();
        })
        .catch(error => console.error('Unable to delete legal concept.', error));
}