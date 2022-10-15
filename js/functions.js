// function to get selected text.  
function getSelectedText() {
    if (window.getSelection) {
        txt = window.getSelection();
    } else if (window.document.getSelection) {
        txt = window.document.getSelection();
    } else if (window.document.selection) {
        txt = window.document.selection.createRange().text;
    }
    return txt;
}

// function to do something with selected text.
function doSomethingWithSelectedText() {
    var selectedText = getSelectedText();
    if (selectedText) {
        // Do something.
    }
}