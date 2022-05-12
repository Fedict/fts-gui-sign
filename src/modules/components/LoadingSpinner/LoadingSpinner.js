import {useIntl} from "react-intl";
import React from "react";

export const LoadingSpinner = (props) => {
    const intl = useIntl();
    return <img src="/img/loading.gif" width={40} alt={intl.formatMessage({id : 'loading'})} />
    /*
    return <span className="spinner-border text-primary " role="status" {...props}>
            <span className="sr-only"><FormattedMessage id="loading" defaultMessage="Loading..." /></span>
        </span>
     */
}