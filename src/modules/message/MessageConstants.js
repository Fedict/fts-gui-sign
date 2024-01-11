import React from 'react'
import {defineMessages, FormattedMessage} from "react-intl";

const errorMessages = defineMessages({
    general_error : {
        id : "error.general.title",
        defaultMessage : "Something went wrong"
    },
    general_error_text : {
        id : "error.general.text",
        defaultMessage : "Something went wrong. Please reload the page and try again."
    },
    not_supported_error : {
        id : "error.browser_not_supported.title",
        defaultMessage : "Browser is not supported"
    },
})

/**
 * @constant {object} messageTypes - enum with the possible types of messagetypes
 */
export const messageTypes = {
    ERROR: "ERROR",
    INFO: "INFO"
}

/**
 * @constant {object} ErrorGeneral - object of a default error.
 */
export const ErrorGeneral = {
    type: messageTypes.ERROR,
    title: errorMessages.general_error,
    message: errorMessages.general_error_text,
    body: null,
    nextButton: {
        text: null,
        isVisible: false,
        nextPage: null
    },
    hasCancelButton: true
}

/**
 * @constant {object} ErrorNotSupported - object of a "browser not supported" error.
 */
export const ErrorNotSupported = {
    type: messageTypes.ERROR,
    title: errorMessages.not_supported_error,
    message: (
        <div>
            <p><FormattedMessage id="error.browser_not_supported.text" defaultMessage="Your browser is not supported. Please use one of the following browsers:"/></p>
            <div className="col col-10 mx-auto" >
                <ul className="text-left">
                    <li><FormattedMessage id="error.browser_not_supported.supported.1" defaultMessage="Chrome"/></li>
                    <li><FormattedMessage id="error.browser_not_supported.supported.2" defaultMessage="Edge (based on Chromium)"/></li>
                    <li><FormattedMessage id="error.browser_not_supported.supported.4" defaultMessage="Firefox" /></li>
                    <li><FormattedMessage id="error.browser_not_supported.supported.5" defaultMessage="Opera (based on Chromium)"/></li>
                </ul>
            </div>
            <p><FormattedMessage id="error.browser_not_supported.link" defaultMessage="<a>In which browsers does the signature service work?|https://bosa.belgium.be/en/federal-trust-services-frequently-asked-questions#12</a>"
                            values = {{ a: msg => ( <a href={msg.split('|')[1]}>{msg.split('|')[0]}</a>
                            )}}
                            /></p>
        </div>),
    body: null,
    nextButton: {
        text: null,
        isVisible: false,
        nextPage: null
    },
    hasCancelButton: false
}

/**
 * @constant {object} ErrorNotSupported - object of a "browser not supported" error.
 */
 export const ErrorIE11NotSupported = {
    type: messageTypes.ERROR,
    title: errorMessages.not_supported_error,
    message: (
        <div>
            <p><FormattedMessage id="error.browser_not_supported.IE" defaultMessage="You are still using the web browser Internet Explorer. Please know that Microsoft progressively stopped supporting this web browser. In addition, this signature service can no longer support Internet Explorer. We recommend that you use another browser."/></p>
        </div>),
    body: null,
    nextButton: {
        text: null,
        isVisible: false,
        nextPage: null
    },
    hasCancelButton: false
}