var no_support_title = "Browser is not supported"
var no_support_message = '<div class="alert alert-danger">Your browser is not supported. Please try to use another browser</div>'


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