var no_support_title = "Browser is not supported"
var no_support_message = '<div class="alert alert-danger">' +
    '<p>Your browser is not supported. Please use one of the following browsers:</p>' +
    '<div class="col col-10 mx-auto" >' +
    '<ul class="text-left">' +
    '<li>Chrome</li>' +
    '<li>Edge (based on Chromium)</li>' +
    '<li>Firefox</li>' +
    '</ul>' +
    '</div>'+
    '</div>'


window.onload = function () {

    const title = document.getElementById("no_support_title")
    const element = document.getElementById("no_support_message")

    if (title) {
        title.innerHTML = no_support_title
    }
    if (element) {
        element.innerHTML = no_support_message
    }

};