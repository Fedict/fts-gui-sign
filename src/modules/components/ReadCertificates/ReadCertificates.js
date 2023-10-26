import React, {useEffect, useState} from "react";
import {useIntl} from "react-intl";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {faqURLs} from "../../../const";

export const ReadCertificates = (props) => {
    const [message, setMessage] = useState();
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
                setMessage(result);
                setTimeout(setRetryCounter.bind(undefined, retryCounter + 1), 5000);
            }
            if(result === true){
                if(typeof props.onCertificatesRead === 'function'){
                    props.onCertificatesRead(true);
                }
                setMessage(undefined);
            }
        });
    }, [retryCounter])

    let msgText = message && message.message ? intl.formatMessage(message.message) : null;
    if(inProgress || msgText){
        return <span><LoadingSpinner style={{position:"absolute"}}/>
            &nbsp; <span style={{position:"absolute",
                marginLeft: '2.5rem',
                marginTop: 5
            }}>{msgText && msgText}
            {msgText && message.link && <>&nbsp;<a href={intl.formatMessage(faqURLs) + message.linkURL}>{intl.formatMessage(message.link)}</a></>}</span>
        </span>
        }
    return <span>{msgText && msgText}</span>;
}
