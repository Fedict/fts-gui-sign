import React from "react"
import { CardContainer } from "./CardContainer"

/**
 * Card with cancel button and a spinner
 * @param {object} props 
 * @param {node} [props.title] - title of the card
 * @param {node} [props.children] - content that is displayed in the card
 * @param {boolean} [props.hasCancelButton] - represents if the cancel button is visible
 * @param {node} [props.cancelButtonText] - text on the cancel button
 * @param {function} [props.onClickCancel] - onClick function of the cancel button
 */
export const CardLoading = (
    {
        title,
        hasCancelButton,
        cancelButtonText,
        onClickCancel,
        children
    }
) => {
    return (
        <CardContainer
            title={title}
            hasCancelButton={hasCancelButton}
            cancelButtonText={cancelButtonText}
            onClickCancel={onClickCancel} >
            <div className="text-center">
                {children}
                <div className="spinner-border text-primary " role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </CardContainer>
    )
}