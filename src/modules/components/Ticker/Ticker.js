import React, {useEffect, useState} from "react";
import {FormattedMessage, useIntl} from "react-intl";

export const Ticker = ({autoClickNextTimeout, onTimeout, redirectMessageDescriptor}) => {
    const [autoClickTime, setAutoClickTime] = useState(autoClickNextTimeout);
    const [abortAutoNext, setAbortAutoNext] = useState(false);
    const intl = useIntl();
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
                }else if(typeof onTimeout === 'function'){
                    onTimeout();
                }
            }
        }
        return function cleanup() {
            mounted = false
        }
    }, [autoClickTime, abortAutoNext])
    if(abortAutoNext || autoClickTime <= 0){
        return false;
    }
    return <React.Fragment>
        {redirectMessageDescriptor && intl.formatMessage(redirectMessageDescriptor, {timeLeft : autoClickTime})}
        &nbsp;
        {false && (<a href="#" onClick={setAbortAutoNext.bind(undefined, true)} className="text-lowercase"><FormattedMessage id="button.cancel" defaultMessage="cancel"/></a>)}
    </React.Fragment>

}