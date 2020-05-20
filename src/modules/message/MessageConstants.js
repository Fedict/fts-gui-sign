import React from 'react'

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
    message: (
        <div>
            <p>Your browser is not supported. Please use one of the following browsers:</p>
            <div class="col col-10 mx-auto" >
                <ul class="text-left">
                    <li>Chrome</li>
                    <li>Edge (based on Chromium)</li>
                    <li>Firefox</li>
                </ul>
            </div>
        </div>),
    body: null,
    nextButton: {
        text: null,
        isVisible: false,
        nextPage: null
    },
    hasCancleButton: false
}