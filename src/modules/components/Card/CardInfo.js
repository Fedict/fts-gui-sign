import React from "react"
import { CardContainer } from "./CardContainer"

export const CardInfo = (
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
        text
    }
) => {
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
                <div className="alert alert-info">
                    {text}
                </div>
                {children}
            </div>
        </CardContainer>
    )
}