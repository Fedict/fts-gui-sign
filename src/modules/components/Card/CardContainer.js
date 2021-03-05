import React, {Fragment, useEffect, useState} from "react"
import PropTypes from 'prop-types';
import {FormattedMessage} from "react-intl";

/**
 * Basic card with buttons
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
 * @param {number} [props.autoClickNextTimeout] - auto click on next button after the time expires
 */
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
        nextButtonIsDisabled,
        autoClickNextTimeout
    }
) => {
    const [autoClickTime, setAutoClickTime] = useState(autoClickNextTimeout);
    const [abortAutoNext, setAbortAutoNext] = useState(false);
    useEffect(() => {
        let mounted = true;
        if(!mounted){
            return;
        }
        if(abortAutoNext) {
            setAutoClickTime(-1);
        }else{
            if(autoClickNextTimeout && autoClickNextTimeout > 0){
                if(autoClickTime > 0){
                    setTimeout(() => {
                        if (mounted) {
                            setAutoClickTime(autoClickTime - 1)
                        }
                    }, 1000);
                }else if(typeof onClickNext === 'function'){
                    onClickNext();
                }
                return function cleanup() {
                    mounted = false
                }
            }
        }
    }, [autoClickTime, abortAutoNext])
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
                                                onClick={(e) => { if (onClickCancel) { onClickCancel() } }}
                                            >
                                                {cancelButtonText}
                                            </button>
                                        )
                                        : null
                                }

                                {
                                    (hasNextButton)
                                        ? (
                                            <Fragment>
                                                <button
                                                className="btn btn-primary float-right"
                                                disabled={nextButtonIsDisabled}
                                                id="button_next"
                                                onClick={(e) => { if (onClickNext) { onClickNext(e) } }}
                                            >
                                                {nextButtonText} {autoClickTime >= 0 && `(${autoClickTime})`}
                                            </button>
                                                {autoClickTime >= 0 && <Fragment>
                                                    <br/>
                                                    <br/>
                                                    <a href="#" onClick={() => setAbortAutoNext(true)} className="float-right"><FormattedMessage id="abort.autonext" defaultMessage="stay on this screen for a while"/></a>
                                                </Fragment>}
                                            </Fragment>
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

CardContainer.propTypes = {
    title: PropTypes.node,
    children: PropTypes.node,
    hasCancelButton: PropTypes.bool,
    cancelButtonText: PropTypes.node,
    onClickCancel: PropTypes.func,
    hasNextButton: PropTypes.bool,
    nextButtonText: PropTypes.node,
    onClickNext: PropTypes.func,
    nextButtonIsDisabled: PropTypes.bool,
    autoClickNextTimeout: PropTypes.number
}