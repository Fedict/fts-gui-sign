import {doSendLogInfo, resetWizard} from "../signWizard/actions/WizardLogicActions";
import {connect, useDispatch} from "react-redux";
import React, {useEffect, useState} from "react";
import {
    WIZARD_STATE_CERTIFICATES_CHOOSE,
    WIZARD_STATE_CERTIFICATES_LOADING,
    WIZARD_STATE_CERTIFICATES_VALIDATE_CHAIN,
    WIZARD_STATE_DIGEST_LOADING, WIZARD_STATE_MESSAGE,
    WIZARD_STATE_PIN_INPUT,
    WIZARD_STATE_PINPAD_ERROR, WIZARD_STATE_SIGNING_LOADING, WIZARD_STATE_SIGNING_PRESIGN_LOADING,
    WIZARD_STATE_START, WIZARD_STATE_SUCCES,
    WIZARD_STATE_UPLOAD,
    WIZARD_STATE_VALIDATE_LOADING,
    WIZARD_STATE_VERSION_CHECK_INSTALL,
    WIZARD_STATE_VERSION_CHECK_INSTALL_EXTENSION,
    WIZARD_STATE_VERSION_CHECK_LOADING,
    WIZARD_STATE_VERSION_CHECK_UPDATE
} from "../wizard/WizardConstants";
import VersionCheckLoadingContainer from "../signWizard/pages/VersionCheckLoadingContainer";
import VersionCheckUpdateContainer from "../signWizard/pages/VersionCheckUpdateContainer";
import VersionCheckInstallContainer from "../signWizard/pages/VersionCheckInstallContainer";
import VersionCheckInstallExtensionContainer from "../signWizard/pages/VersionCheckInstallExtensionContainer";
import CertificatesLoadingContainer from "../signWizard/pages/CertificatesLoadingContainer";
import CertificateChooseContainer from "../signWizard/pages/CertificateChooseContainer";
import CertificateValidateChainContainer from "../signWizard/pages/CertificateValidateChainContainer";
import ValidateLoadingContainer from "../signWizard/pages/ValidateLoadingContainer";
import PinInputContainer from "../signWizard/pages/PinInputContainer";
import TokenWizardIntroContainer from "./pages/TokenWizardIntroContainer";
import MessageContainer from "../message/MessageContainer";
import {ErrorGeneral} from "../message/MessageConstants";
import {doSetToken} from "./actions/TokenActions";
import {FormattedMessage} from 'react-intl';
import {boldedText} from "../utils/reactIntlUtils";
import TokenDisplayFile from "./components/DisplayFile/TokenDisplayFile";
import TokenDisplayFileList from "./components/DisplayFile/TokenDisplayFileList";
import DigestForTokenLoadingContainer from "./pages/DigestForTokenLoadingContainer";
import SigningPreSignLoading from "../signWizard/pages/SigningPreSignLoading";
import SigningLoadingContainer from "../signWizard/pages/SigningLoading";
import {useRouter} from "../utils/useRouter";
import SuccesForTokenContainer from "./pages/SuccesForTokenContainer";
import MetadataLoadingContainer from "./pages/MetadataLoadingContainer";
import ReactStepper from "../components/ReactStepper/ReactStepper";
import {defineMessages, injectIntl} from "react-intl";
import {getIsPinPadReader} from "../signWizard/reducers/CertificateReducer";
import {defaults} from "../utils/helper";

const messages = defineMessages({
    tokenStep1 : {
        id : "sign.token.1",
        defaultMessage : "Read and connect eID"
    },
    tokenStep2 : {
        id : "sign.token.2",
        defaultMessage : "Enter PIN  and sign"
    },
    tokenStep4 : {
        id : "sign.token.4",
        defaultMessage : "Ready"
    }
})

export const TokenWizardContainer = ({ wizard, reader, resetWizard, doSetToken, certificate, intl, inputs, previewDocuments, selectedInputId }) => {
    const [currentIndexStep, setCurrentIndexStep] = useState(1);

    const dispatch = useDispatch();
    const router = useRouter();
    useEffect(() => {
        const clientNames = {
            name: router.query.name, 
            name_fr: router.query.name_fr,
            name_nl: router.query.name_nl,
            name_de: router.query.name_de,
            name_en: router.query.name_en
        }
        
        doSetToken(router.query.token, defaults(router.query.callbackUrl, router.query.redirectUrl), clientNames, router.query.HookURL);

        let params = { ...router.query }
        delete params.token
        dispatch(doSendLogInfo("UI PARAMS :" + JSON.stringify(params)), [])

    }, [router.query.token]);

    useEffect(() => {
        switch (wizard.state) {
            case WIZARD_STATE_START:
            case WIZARD_STATE_UPLOAD:
            case WIZARD_STATE_VERSION_CHECK_LOADING:
            case WIZARD_STATE_VERSION_CHECK_UPDATE:
            case WIZARD_STATE_VERSION_CHECK_INSTALL:
            case WIZARD_STATE_VERSION_CHECK_INSTALL_EXTENSION:
            case WIZARD_STATE_CERTIFICATES_LOADING:
            case WIZARD_STATE_CERTIFICATES_CHOOSE:
            case WIZARD_STATE_CERTIFICATES_VALIDATE_CHAIN:
            case WIZARD_STATE_VALIDATE_LOADING:
            case WIZARD_STATE_DIGEST_LOADING:
                setCurrentIndexStep(1);
                break;
            case WIZARD_STATE_PIN_INPUT:
                setCurrentIndexStep(2);
                break;
            case WIZARD_STATE_SIGNING_PRESIGN_LOADING:
                setCurrentIndexStep(getIsPinPadReader(certificate)?2:2);
                break;
            case WIZARD_STATE_SIGNING_LOADING:
                setCurrentIndexStep(2);
                break;
            case WIZARD_STATE_SUCCES:
                setCurrentIndexStep(3);
                break;
        }
    }, [wizard.state])
    let content = null;

    switch (wizard.state) {
        case WIZARD_STATE_START:
            content = <MetadataLoadingContainer />
            break;
        case WIZARD_STATE_UPLOAD:
            if (reader && reader.isOk && reader.isChecked) {
                content = <TokenWizardIntroContainer/>;
            } else {
                content = <VersionCheckLoadingContainer/>;
            }
            break;
        case WIZARD_STATE_VERSION_CHECK_LOADING:
            content = <VersionCheckLoadingContainer />;
            break;
        case WIZARD_STATE_VERSION_CHECK_UPDATE:
            content = <VersionCheckUpdateContainer />;
            break;
        case WIZARD_STATE_VERSION_CHECK_INSTALL:
            content = <VersionCheckInstallContainer />;
            break;
        case WIZARD_STATE_VERSION_CHECK_INSTALL_EXTENSION:
            content = <VersionCheckInstallExtensionContainer />;
            break;
        case WIZARD_STATE_CERTIFICATES_LOADING:
            content = <CertificatesLoadingContainer />;
            break;
        case WIZARD_STATE_CERTIFICATES_CHOOSE:
            content = <CertificateChooseContainer />;
            break;
        case WIZARD_STATE_CERTIFICATES_VALIDATE_CHAIN:
            content = <CertificateValidateChainContainer />
            break;
        case WIZARD_STATE_VALIDATE_LOADING:
            content = <ValidateLoadingContainer />;
            break;
        case WIZARD_STATE_DIGEST_LOADING:
            content = <DigestForTokenLoadingContainer />;
            break;
        case WIZARD_STATE_SIGNING_PRESIGN_LOADING:
            content = <SigningPreSignLoading />;
            break;
        case WIZARD_STATE_PIN_INPUT:
            content = <PinInputContainer downloadSelector={ true } />;
            break;
        case WIZARD_STATE_SIGNING_LOADING:
            content = <SigningLoadingContainer />;
            break;
        case WIZARD_STATE_PINPAD_ERROR:
            content = <SigningPreSignLoading />
            //content = <PinPadError />
            break;
        case WIZARD_STATE_SUCCES:
            content = <SuccesForTokenContainer />;
            break;
        case WIZARD_STATE_MESSAGE:
            content = <MessageContainer onCancel={() => { (resetWizard()) }} />;
            break;
        default:
            content = <MessageContainer message={ErrorGeneral} onCancel={() => { (resetWizard()) }} />
            break;
    }

    return (
        <div >
            <div className={"row mx-5 mt-3"}>
                <div className={"col col-sm-6"}>
                    { inputs &&
                        <div className="row">
                            { inputs.length > 1 && (
                                <TokenDisplayFileList/>
                            )}
                            { previewDocuments && (
                                <div className="col">
                                    { inputs.length > 1 && (
                                        <p><FormattedMessage id = "token.documents.title.name"defaultMessage="<b>DOCUMENT PREVIEW:</b> {docName}" values={{b : boldedText, docName: inputs[selectedInputId].fileName.toUpperCase() }}/></p>
                                    )}
                                    <TokenDisplayFile index={selectedInputId} drawSignature={ inputs[selectedInputId].drawSignature } />
                                </div>
                            )}
                        </div>
                    }
                </div>
                <div className={"col col-sm-6"}>
                    <ReactStepper style={{marginBottom : 20}}>
                        <ReactStepper.Header>
                            {Object.keys(messages).map((key, index) => (
                                <ReactStepper.HeaderStep
                                    number={index + 1}
                                    label={intl.formatMessage(messages[key])}
                                    active={(index + 1) === currentIndexStep}
                                    done={currentIndexStep > (index + 1)}
                                    key={key}></ReactStepper.HeaderStep>
                            ))}
                        </ReactStepper.Header>
                    </ReactStepper>
                    {content}
                </div>
            </div>
        </div >)
}

const mapStateToProps = (state, ownProps) => {
    return (state) => ({
        wizard: state.wizard,
        inputs: state.tokenFile.inputs,
        certificate : state.certificate,
        reader: state.reader,
        selectedInputId : state.filePreview.index,
        previewDocuments: state.tokenFile.previewDocuments
    })
}

const mapDispatchToProps = ({
    resetWizard,
    doSetToken
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TokenWizardContainer))