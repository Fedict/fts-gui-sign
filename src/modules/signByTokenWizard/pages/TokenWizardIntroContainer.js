import React, {useEffect, useState} from 'react';
import {defineMessages, FormattedMessage, injectIntl} from 'react-intl';
import {connect} from 'react-redux';
import {CardContainer} from "../../components/Card/CardContainer";
import {navigateToStep} from "../../wizard/WizardActions";
import {selectCertificate} from "../../signWizard/actions/CertificateActions";
import {resetWizard} from "../../signWizard/actions/WizardLogicActions";
import {WIZARD_STATE_CERTIFICATES_CHOOSE, WIZARD_STATE_CERTIFICATES_LOADING} from "../../wizard/WizardConstants";
import {getDigestForToken} from "../actions/TokenActions";
import {definedMessages} from "../../i18n/translations";

const messages = defineMessages({
    title : {
        id : "token.intro.title",
        defaultMessage : "Welcome"
    }
})

const TokenWizardIntroContainer = (props) => {
    return (
        <CardContainer
            title={props.intl.formatMessage(messages.title)}
            hasCancelButton
            cancelButtonText={props.intl.formatMessage(definedMessages.cancel)}
            onClickCancel={() => { resetWizard() }}
            hasNextButton
            nextButtonText={props.intl.formatMessage(definedMessages.start)}
            onClickNext={() => { props.navigateToNextStep() }}
        >
            <FormattedMessage id="token.intro.txt" defaultMessage="Hello, {newLine} you are about to sign a document that was prepared for you." values={{newLine : <br/>}}/>
        </CardContainer>
    );
}

function mapStateToProps(state){
    return {

    };
}
const mapDispatchToProps = ({
    navigateToNextStep : () => navigateToStep(WIZARD_STATE_CERTIFICATES_LOADING),
    selectCertificate,
    resetWizard
})

export const TokenWizardIntroComponent = injectIntl(TokenWizardIntroContainer)

export default connect(mapStateToProps, mapDispatchToProps)(TokenWizardIntroComponent);
