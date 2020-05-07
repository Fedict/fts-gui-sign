import React from "react"

export const CardContainer = (
    {
        title,
        children,
        hasCancelButton,
        cancelButtonText,
        onClickCancel,
        hasNextButton,
        nextButtonText,
        onClickNext,
        nextButtonIsDisabled
    }
) => {

    return (
        <div className="col col-12 mx-auto align-middle">
            <div className="card " >
                {
                    (title)
                        ? (
                            <div className="card-header">
                                {title}
                            </div>
                        )
                        : null
                }
                <div className="card-body">
                    {children}
                </div>
                {
                    (hasCancelButton || hasNextButton)
                        ? (
                            <div className="card-footer text-muted">
                                {
                                    (hasCancelButton)
                                        ? (
                                            <button className="btn btn-secondary float-left"
                                                id="button_cancel"
                                                onClick={(e) => { if (onClickCancel) { onClickCancel(e) } }}
                                            >
                                                {cancelButtonText}
                                            </button>
                                        )
                                        : null
                                }

                                {
                                    (hasNextButton)
                                        ? (
                                            <button
                                                className="btn btn-primary float-right"
                                                disabled={nextButtonIsDisabled}
                                                id="button_next"
                                                onClick={(e) => { if (onClickNext) { onClickNext(e) } }}
                                            >
                                                {nextButtonText}
                                            </button>
                                        )
                                        : null
                                }
                            </div>)
                        : null
                }
            </div>
        </div>
    )
}