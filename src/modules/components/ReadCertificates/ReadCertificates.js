import React, {useEffect, useState} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";

export const ReadCertificates = (props) => {
    const [eidReadingMessage, seteIDReadingMessage] = useState();
    const [inProgress, setInProgress] = useState();
    const [retryCounter, setRetryCounter] = useState(0);
    const intl = useIntl();
    useEffect(() => {
        //console.log('getCertificatesWithCallback');
        if(inProgress){
            return;
        }
        setInProgress(true);
        props.getCertificates((result) => {
            //console.log('getCertificatesWithCallback result', result);

            setInProgress(false);
            if(result && result.message){
                seteIDReadingMessage(result.message);
                setTimeout(setRetryCounter.bind(undefined, retryCounter + 1), 2000);
            }
            if(result === true){
                if(typeof props.onCertificatesRead === 'function'){
                    props.onCertificatesRead(true);
                }
                seteIDReadingMessage(undefined);
            }
        });
    }, [retryCounter])

    if(inProgress || eidReadingMessage){
        return <span><LoadingSpinner style={{position:"absolute"}}/>
            &nbsp; <span style={{position:"absolute",
                marginLeft: '2.5rem',
                marginTop: 5
            }}>{eidReadingMessage && eidReadingMessage.id && intl.formatMessage(eidReadingMessage)}</span>
        </span>
    }
    return <span>{eidReadingMessage && eidReadingMessage.id && intl.formatMessage(eidReadingMessage)}</span>;
}