// function that runs all necessary initial retrieval.
function init() {
    getLegalConcepts();
}

// function to get scenario based on id.
function getLegalConcepts() {
    // remove all table rows except the first(header).
    $("#legalConceptTable").find("tr:not(:first)").remove();

    // get declared legalConcepts.
    // remember to update the same one in scenario.html script.
    const legalConcepts = [
        { id: 1, name: 'LegalConcept1', relatedTopic: 'Topic1', relatedSection: 'Section1', other: 'Other1' },
        { id: 2, name: 'LegalConcept2', relatedTopic: 'Topic2', relatedSection: 'Section2', other: 'Other2' }
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