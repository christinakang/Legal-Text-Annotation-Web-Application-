const legalConceptUri = 'api/legalconcepts';
const scenariosUri = 'api/scenarios';

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
                '<td>' + '<button onclick="deleteLegalConcept(' + value.id + ')"> Delete </button>' + '</td>\n' +
                '</tr>');
    });
}

// delete legal concept from database.
function deleteLegalConcept(id) {
    fetch(`${legalConceptUri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getLegalConcepts())
        .catch(error => console.error('Unable to delete legal concept.', error));
}