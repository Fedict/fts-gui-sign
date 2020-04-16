import React from "react"
import { CardContainer } from "../CardContainer/CardContainer"

export const CardLoading = ({ title, hasCancelButton,
    cancelButtonText,
    onClickCancel,
    children }) => {
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