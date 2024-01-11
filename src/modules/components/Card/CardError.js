import React from "react"
import { CardContainer } from "./CardContainer"
import {injectIntl} from "react-intl";
import {faqURLs} from "../../../const";

/**
 * Card with buttons and a error message (based on bootstrap class "alert alert-danger")
 * @param {object} props 
 * @param {node} [props.title] - title of the card
 * @param {node} [props.children] - content that is displayed in the card
 * @param {boolean} [props.hasCancelButton] - represents if the cancel button is visible
 * @param {node} [props.cancelButtonText] - text on the cancel button
 * @param {function} [props.onClickCancel] - onClick function of the cancel button
 * @param {boolean} [props.hasNextButton] - represents if the next button is visible
 * @param {node} [props.nextButtonText] - text on the next button
 * @param {function} [props.onClickNext] - onClick function of the next button
 * @param {boolean} [props.nextButtonIsDisabled] - represents if the next button is Disabled
 * @param {node} [props.text] - text in the error alert
 */
export const CardError = injectIntl((
    {
        title,
        children,
        hasCancelButton,
        cancelButtonText,
        onClickCancel,
        hasNextButton,
        nextButtonText,
        onClickNext,
        nextButtonIsDisabled,
        text,
        predButtonText,
        onClickPred,
        intl
    }
) => {
    const faqGeneric = { id: "error.faq.generic", defaultMessage: "Help, I get the message ‘{error}’."}

    if(cancelButtonText && cancelButtonText.id){
        cancelButtonText = intl.formatMessage(cancelButtonText)
    }
    if(nextButtonText && nextButtonText.id){
        nextButtonText = intl.formatMessage(nextButtonText);
    }
    if(predButtonText && predButtonText.id){
        predButtonText = intl.formatMessage(predButtonText);
    }
    if(title && title.id){
        title = intl.formatMessage(title);
    }

    let textToDisplay, linkText, linkURL
    if (text) {
        textToDisplay = text.id?intl.formatMessage(text):text
        if (text.link) {
            linkText = text.linkDefaultMessage
            if (linkText) {
                linkText = intl.formatMessage( { id: text.id+".linkText", defaultMessage: linkText} )
            } else {
                linkText = intl.formatMessage( faqGeneric, { error: textToDisplay } )
            }
            linkURL = intl.formatMessage( faqURLs ) + text.link
        }
    }

    return (
        <CardContainer
            title={title}
            hasCancelButton={hasCancelButton}
            cancelButtonText={cancelButtonText}
            onClickCancel={onClickCancel}
            hasNextButton={hasNextButton}
            nextButtonText={nextButtonText}
            onClickNext={onClickNext}
            nextButtonIsDisabled={nextButtonIsDisabled}
            predButtonText = {predButtonText}
            onClickPred = {onClickPred}
        >
            <div className="text-center">
                <div className="alert alert-danger" role="alert" >
                    <p>{textToDisplay}</p>
                    {linkText && <a href={linkURL}>{linkText}</a>}
                </div>
                {children}
            </div>
        </CardContainer>
    )
})