import React from "react"
import { CardContainer } from "../CardContainer/CardContainer"

export const CardLoading = ({ title, hasCancelButton,
    cancelButtonText,
    onClickCancel }) => {
    return (
        <CardContainer
            title={title}
            hasCancelButton={hasCancelButton}
            cancelButtonText={cancelButtonText}
            onClickCancel={onClickCancel} >
            <div className="text-center">
                <div className="spinner-border text-primary " role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </CardContainer>

    )
}