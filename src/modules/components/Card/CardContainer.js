import React, {Fragment, useEffect, useState, useRef} from "react"
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
            autoClickNextTimeout,
            predButtonText,
            onClickPred
        }
    ) => {
    const [autoClickTime, setAutoClickTime] = useState(autoClickNextTimeout);
    const [abortAutoNext, setAbortAutoNext] = useState(false);
    const nextBtnRef = useRef(null);

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
            }
        }
        return function cleanup() {
            mounted = false
        }
    }, [autoClickTime, abortAutoNext])

    useEffect(() => {
        if (window && window.document){
            if (title && title.length > 0){
                document.title = "BOSA - " + title;
            }
        }
      }, [title]);
    
      useEffect(() => {
        if (nextBtnRef.current) nextBtnRef.current.focus();
      });
    
    return (
        <div className="col col-12 mx-auto align-middle">
            <main className="card" >
                {
                    (title)
                        ? (
                            <div className="card-header"><h1>{title}</h1></div>
                        )
                        : null
                }
                <div className="card-body">
                    {children}
                </div>
                {(title)
                    ? (
                        <div className="card-footer text-muted">
                            {
                             predButtonText && <button className="float-left btn btn-primary" onClick={(e) => onClickPred(e)} >{predButtonText}</button>
                            }
                            {
                                (hasNextButton)
                                    ? (
                                        <Fragment>
                                            <button
                                            className={"float-right btn " + (nextButtonIsDisabled?"btn-secondary":"btn-primary")}
                                            disabled={nextButtonIsDisabled}
                                            id="button_next"
                                            ref={nextBtnRef}
                                            onClick={(e) => { if (onClickNext) { onClickNext(e) } }}
                                        >
                                            {nextButtonText} {autoClickTime >= 0 && `(${autoClickTime})`}
                                        </button>
                                            {autoClickTime >= 0 && <Fragment>
                                                <br/>
                                                <br/>
                                                <a href="#" onClick={() => setAbortAutoNext(true)} className="float-right"><FormattedMessage id="abort.autonext" defaultMessage="Stay on this screen for a while"/></a>
                                            </Fragment>}
                                        </Fragment>
                                    )
                                    : <Fragment>&nbsp;</Fragment>
                            }
                        </div>
                    ):false}
            </main>
            {
                (hasCancelButton)
                    ? (
                        <div style={{marginTop:15}}>
                            <button className="btn btn-outline-primary"
                                id="button_cancel"
                                onClick={(e) => { if (onClickCancel) { onClickCancel() } }}
                        >
                            {cancelButtonText}
                            </button>
                        </div>
                    )
                    : null
            }
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