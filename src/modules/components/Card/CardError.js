import React from "react"
import { CardContainer } from "./CardContainer"
import {injectIntl} from "react-intl";

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
        intl
    }
) => {
    if(cancelButtonText && cancelButtonText.id){
        cancelButtonText = intl.formatMessage(cancelButtonText)
    }
    if(nextButtonText && nextButtonText.id){
        nextButtonText = intl.formatMessage(nextButtonText);
    }
    if(title && title.id){
        title = intl.formatMessage(title);
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
        >
            <div className="text-center">
                <div className="alert alert-danger" role="alert" >
                    {text && text.id?intl.formatMessage(text):text}
                </div>
                {children}
            </div>
        </CardContainer>
    )
})