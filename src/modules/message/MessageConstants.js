export const messageTypes = {
    ERROR: "ERROR",
    INFO: "INFO"
}


export const ErrorGeneral = {
    type: messageTypes.ERROR,
    title: "Something went wrong",
    message: "Something went wrong. Please reload the page and try again.",
    body: null,
    nextButton: {
        text: null,
        isVisible: false,
        nextPage: null
    },
    hasCancleButton: true
}

export const ErrorNotSupported = {
    type: messageTypes.ERROR,
    title: "Browser is not supported",
    message: "Your browser is not supported. Please try to use an other browser",
    body: null,
    nextButton: {
        text: null,
        isVisible: false,
        nextPage: null
    },
    hasCancleButton: false
}