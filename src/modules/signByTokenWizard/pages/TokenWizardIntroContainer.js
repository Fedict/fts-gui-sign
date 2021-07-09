import React, {useEffect, useState} from 'react';
import {defineMessages, FormattedMessage, injectIntl} from 'react-intl';
import {connect} from 'react-redux';
import {CardContainer} from "../../components/Card/CardContainer";
import {navigateToStep} from "../../wizard/WizardActions";
import {selectCertificate} from "../../signWizard/actions/CertificateActions";
import {doSendLogInfo, getCertificatesWithCallback, resetWizard} from "../../signWizard/actions/WizardLogicActions";
import {WIZARD_STATE_CERTIFICATES_LOADING, WIZARD_STATE_VALIDATE_LOADING} from "../../wizard/WizardConstants";
import {definedMessages} from "../../i18n/translations";
import {boldedText} from "../../utils/reactIntlUtils";
import {ReadCertificates} from "../../components/ReadCertificates/ReadCertificates";
import {doWithToken} from "../../utils/helper";
import {sendLogInfoIgnoreResult} from "../../communication/communication";

const messages = defineMessages({
    title : {
        id : "token.intro.title",
        defaultMessage : "Digital signing of {fileName}"
    }
})

const TokenWizardIntroContainer = (props) => {
    const [checked, setChecked] = useState(false);
    const [certificatesRead, setCertificatesRead] = useState(false);
    return (
        <CardContainer
            title={props.intl.formatMessage(messages.title, {fileName : `'${props.fileName}'`})}
            hasCancelButton={false}
            cancelButtonText={props.intl.formatMessage(definedMessages.cancel)}
            onClickCancel={() => { props.resetWizard() }}
            hasNextButton={false}
            nextButtonText={props.intl.formatMessage(definedMessages.start)}
            onClickNext={() => { props.navigateToNextStep() }}
            autoClickNextTimeout={undefined}
        >
            <FormattedMessage tagName={"p"} id="token.intro.txt"
                              defaultMessage="Welcome, {newLine} you are about to sign the document on the left.{newLine}{newLine}You can now insert your eID card into the card reader (make sure you know its PIN code) and then press the Start button to start signing the document."
                              values={{newLine : <br/>, fileName : props.fileName, b : boldedText, signButtonText : <FormattedMessage id="buttons.sign" defaultMessage="sign"/>}}/>
            <p className="form-check">
                <input type="checkbox" onChange={(e) => {
                    props.doSendLogInfo('UI - documentReadCheckbox - ' + e.target.checked);
                    setChecked(e.target.checked);
                }} className="form-check-input" id="documentReadCheckbox" data-testid="documentReadCheckbox" value={checked} defaultChecked={checked}/>
                <label className="form-check-label" htmlFor="documentReadCheckbox"><FormattedMessage id="token.intro.check.read" defaultMessage="I have read this document"/></label>
            </p>
            <p>
                <button
                    className={checked && certificatesRead?"btn btn-primary text-uppercase":"btn btn-secondary text-uppercase"}
                    disabled={!(checked && certificatesRead)}
                    onClick={() => {
                        props.doSendLogInfo('UI - SIGN_BUTTON CLICKED')
                        props.navigateToNextStep()
                    }}
                    id="button_next"
                >
                    <FormattedMessage id="buttons.sign" defaultMessage="sign"/>
                </button>
                <span style={{padding : 30}}>&nbsp;</span>
                <ReadCertificates getCertificates={props.getCertificates} onCertificatesRead={setCertificatesRead} />
            </p>
            <hr/>
            <FormattedMessage tagName={"p"} id="token.intro.reject"
                          defaultMessage="<b>Don't want to sign this document?</b>{newLine}Click <b>{rejectButtonText}</b> to reject signing the document"
                          values={{b : boldedText, newLine : <br/>, rejectButtonText : <FormattedMessage id="buttons.reject" defaultMessage="reject"/>}}
            />
            <button
                className="btn btn-danger text-uppercase"
                onClick={() => { props.resetWizard() }}
                id="button_cancel"
            >
                <FormattedMessage id="buttons.reject" defaultMessage="reject"/>
            </button>
        </CardContainer>
    );
}

function mapStateToProps(state){
    return {
        fileName : state.tokenFile.fileName
    };
}
const mapDispatchToProps = ({
    navigateToNextStep : () => (navigateToStep(WIZARD_STATE_VALIDATE_LOADING)),
    selectCertificate,
    getCertificates : getCertificatesWithCallback,
    resetWizard,
    doSendLogInfo
})

export const TokenWizardIntroComponent = injectIntl(TokenWizardIntroContainer)

export default connect(mapStateToProps, mapDispatchToProps)(TokenWizardIntroComponent);
