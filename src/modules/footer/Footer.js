import React from 'react'
import { useIntl } from 'react-intl';
import {connect} from "react-redux";
import { FormattedMessage } from 'react-intl';
import { Link } from "react-router-dom";

export const Footer = (props) => {
    const locale = useIntl().locale
    const httpParams = '?language=' + locale
    return (
        <div className="fixed-bottom  bg-light text-muted">
            <div><p className="m-1 ml-3">version: {process.env.REACT_APP_VERSION} - {props.token}</p></div>
            <div className="text-center">
                { !props.token && <><Link to={'/gtou' + httpParams}>
                    <FormattedMessage id="footer.genTerms" defaultMessage="General terms of use"/>
                </Link>  -  </>}
                <Link to={'/ps' + httpParams}>
                    <FormattedMessage id="footer.genPrivacy" defaultMessage="Privacy Statement"/>
                </Link>{ locale === "fr" || locale === "nl" && <> - <a href= { locale === "fr" ? "https://bosa.belgium.be/fr/declaration-daccessibilite" : "https://bosa.belgium.be/nl/toegankelijkheidsverklaring" }>
                    <FormattedMessage id="footer.accStatement" defaultMessage="Accessibility statement"/>
                </a></>}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        token : (state.tokenFile && state.tokenFile.token?state.tokenFile.token.substr(state.tokenFile.token.length - 16):undefined),
    }
}

export default connect(mapStateToProps)(Footer);