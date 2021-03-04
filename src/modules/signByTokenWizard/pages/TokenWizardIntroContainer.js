import React, {useEffect, useState} from 'react';
import {defineMessages, FormattedMessage, injectIntl} from 'react-intl';
import {connect} from 'react-redux';
import {CardContainer} from "../../components/Card/CardContainer";
import {navigateToStep} from "../../wizard/WizardActions";
import {selectCertificate} from "../../signWizard/actions/CertificateActions";
import {resetWizard} from "../../signWizard/actions/WizardLogicActions";
import {WIZARD_STATE_CERTIFICATES_LOADING} from "../../wizard/WizardConstants";
import {definedMessages} from "../../i18n/translations";

const messages = defineMessages({
    title : {
        id : "token.intro.title",
        defaultMessage : "Digital signing of {fileName}"
    }
})

const TokenWizardIntroContainer = (props) => {
    return (
        <CardContainer
            title={props.intl.formatMessage(messages.title, {fileName : `'${props.fileName}'`})}
            hasCancelButton
            cancelButtonText={props.intl.formatMessage(definedMessages.cancel)}
            onClickCancel={() => { resetWizard() }}
            hasNextButton
            nextButtonText={props.intl.formatMessage(definedMessages.start)}
            onClickNext={() => { props.navigateToNextStep() }}
        >
            <FormattedMessage id="token.intro.txt" defaultMessage="Welcome, {newLine} you are about to sign the document on the left.{newLine}{newLine}You can now insert your eID card into the card reader (make sure you know its PIN code) and then press the Start button to start signing the document." values={{newLine : <br/>, fileName : props.fileName}}/>
        </CardContainer>
    );
}

function mapStateToProps(state){
    return {
        fileName : state.tokenFile.fileName
    };
}
const mapDispatchToProps = ({
    navigateToNextStep : () => navigateToStep(WIZARD_STATE_CERTIFICATES_LOADING),
    selectCertificate,
    resetWizard
})

export const TokenWizardIntroComponent = injectIntl(TokenWizardIntroContainer)

export default connect(mapStateToProps, mapDispatchToProps)(TokenWizardIntroComponent);
