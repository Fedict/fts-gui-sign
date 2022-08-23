import React from 'react'
import {connect} from "react-redux";
import { FormattedMessage } from 'react-intl';

export const Footer = (props) => {
    return (
        <div className="fixed-bottom  bg-light text-muted ">
            <div><p className="m-1 ml-3">version: {process.env.REACT_APP_VERSION} - {props.token}</p></div>
            <div className="text-center"><a href="/gtou"><FormattedMessage id="footer.genTerms" defaultMessage="General terms of use"/></a>  -  <a href="/ps"><FormattedMessage id="footer.genPrivacy" defaultMessage="Privacy Statement"/></a></div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        token : (state.tokenFile && state.tokenFile.token?state.tokenFile.token.substr(state.tokenFile.token.length - 16):undefined),
    }
}

export default connect(mapStateToProps)(Footer);