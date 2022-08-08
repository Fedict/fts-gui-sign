import React, { useState } from 'react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { CardContainer } from "../../components/Card/CardContainer";
import { navigateToStep } from "../../wizard/WizardActions";
import { selectCertificate } from "../../signWizard/actions/CertificateActions";
import { doSendLogInfo, getCertificatesWithCallback, resetWizard } from "../../signWizard/actions/WizardLogicActions";
import { WIZARD_STATE_VALIDATE_LOADING } from "../../wizard/WizardConstants";
import { definedMessages } from "../../i18n/translations";
import { boldedText } from "../../utils/reactIntlUtils";
import { ReadCertificates } from "../../components/ReadCertificates/ReadCertificates";
import { doWithToken } from "../../utils/helper";
import { sendLogInfoIgnoreResult } from "../../communication/communication";
import { setPreview, setInputsSignState, setPreviewFileId } from "../../signByTokenWizard/actions/TokenActions"
import { signingType, signState } from '../constants';

const messages = defineMessages({
    title: {
        id: "token.intro.title",
        defaultMessage: "Digital signing of '{fileName}'"
    },
    multiFileTitle: {
        id: "token.intro.multiFile.title",
        defaultMessage: "Digitally sign multiple documents"
    }
})

const TokenWizardIntroContainer = (props) => {
    const [readConfirmed, setReadConfirmed] = useState(false);
    const [certificatesRead, setCertificatesRead] = useState(false);


    let readyToSign = certificatesRead && (readConfirmed || !props.tokenFile.requestDocumentReadConfirm) && props.tokenFile.inputs.findIndex(i => i.signState === signState.SIGN_REQUESTED) !== -1;
    return (
        <CardContainer
            title={props.intl.formatMessage(props.isMultifile ? messages.multiFileTitle : messages.title, { fileName: `'${props.fileName}'` })}
            hasCancelButton={false}
            cancelButtonText={props.intl.formatMessage(definedMessages.cancel)}
            onClickCancel={() => { props.resetWizard() }}
            hasNextButton={false}
            nextButtonText={props.intl.formatMessage(definedMessages.start)}
            onClickNext={() => { props.navigateToNextStep() }}
            autoClickNextTimeout={undefined}
        >
            <FormattedMessage tagName={"p"}
                id={props.isMultifile ? "token.intro.multiFile.txt" : "token.intro.txt"}
                defaultMessage={props.isMultifile ?
                    "Welcome,{newLine}{newLine}You are about to sign the documents on the left.{newLine}{newLine}After reading the documents, connect your card reader to the computer, insert the eID card into the card reader and press the <b>{signButtonText}</b> button to digitally sign the documents. {newLine} {newLine} To sign the documents, enter your eID PIN code. Make sure you have it to hand."
                    : "<b>Welcome</b>{newLine}{newLine}You are about to sign the document on the left.{newLine}{newLine}You can now insert your eID card into the card reader (make sure you know its PIN code) and then press the Start button to start signing the document."

                }
                values={{ newLine: <br />, fileName: props.fileName, b: boldedText, signButtonText: <FormattedMessage id="buttons.sign" defaultMessage="sign" /> }} />

            {props.tokenFile.noSignedDownloads &&
                <FormattedMessage tagName={"p"} id="token.intro.nodownload" defaultMessage="Please note: <b>you will not be able to download</b> the signed document(s) after signing." values={{ b: boldedText }} />
            }
            {props.tokenFile.requestDocumentReadConfirm &&
                <p className="form-check">
                    <input type="checkbox" onChange={(e) => {
                        props.doSendLogInfo('UI - documentReadCheckbox - ' + e.target.readConfirmed);
                        setReadConfirmed(e.target.checked);
                    }} className="form-check-input" id="documentReadCheckbox" data-testid="documentReadCheckbox" value={readConfirmed} defaultChecked={readConfirmed} />
                    <label className="form-check-label" htmlFor="documentReadCheckbox">
                        <FormattedMessage id={props.isMultifile ? "token.intro.check.multiFile.read" : "token.intro.check.read"}
                            defaultMessage={props.isMultifile ? "I have read these documents" : "I have read this document."} /><sup>*</sup></label>
                </p>
            }
            <p>
                <button
                    className={ readyToSign ? "btn btn-primary text-uppercase" : "btn btn-secondary text-uppercase"} disabled={!readyToSign}
                    onClick={() => {
                        props.setInputsSignState(signState.SIGN_REQUESTED, signState.TO_BE_SIGNED)
                        if (props.tokenFile.signingType === signingType.XadesMultiFile || props.isMultifile) {
                            props.setPreview(false)
                            props.setPreviewFileId(-1)
                        }
                        props.doSendLogInfo('UI - SIGN_BUTTON CLICKED')
                        props.navigateToNextStep()
                    }}
                    id="button_next"
                >
                    <FormattedMessage id="buttons.sign" defaultMessage="sign"/>
                </button>
                <span style={{ padding: 30 }}>&nbsp;</span>
                <ReadCertificates getCertificates={props.getCertificates} onCertificatesRead={setCertificatesRead} />
            </p>
            <hr />
            <FormattedMessage tagName={"p"}
                id={props.isMultifile ? "token.intro.multiFile.reject" : "token.intro.reject"}
                defaultMessage={props.isMultifile ? "<b>Don't want to sign these documents?</b>{newLine}Click <b>{rejectButtonText}</b> to reject signing the documents" :
                    "<b>Don't want to sign this document?</b>{newLine}Click <b>{rejectButtonText}</b> to reject signing the document"}
                values={{ b: boldedText, newLine: <br />, rejectButtonText: <FormattedMessage id="buttons.reject" defaultMessage="reject" /> }}
            />
            <button
                className="btn btn-danger text-uppercase"
                onClick={() => { props.resetWizard() }}
                id="button_cancel"
            >
                <FormattedMessage id="buttons.reject" defaultMessage="reject" />
            </button>
        </CardContainer>
    );
}

function mapStateToProps(state) {
    return {
        isMultifile: state.tokenFile.inputs.length > 1,
        fileName: state.tokenFile.inputs[0].fileName,
        tokenFile: state.tokenFile
    };
}
const mapDispatchToProps = ({
    navigateToNextStep: () => (navigateToStep(WIZARD_STATE_VALIDATE_LOADING)),
    selectCertificate,
    getCertificates: getCertificatesWithCallback,
    resetWizard,
    doSendLogInfo,
    setPreview,
    setInputsSignState,
    setPreviewFileId
})

export const TokenWizardIntroComponent = injectIntl(TokenWizardIntroContainer)

export default connect(mapStateToProps, mapDispatchToProps)(TokenWizardIntroComponent);
