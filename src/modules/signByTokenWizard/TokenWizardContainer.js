import {resetWizard} from "../signWizard/actions/WizardLogicActions";
import {connect} from "react-redux";
import React, {useEffect} from "react";
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
import MessageContainerWithStore, {MessageContainer} from "../message/MessageContainer";
import {ErrorGeneral} from "../message/MessageConstants";
import {doSetToken, getDocumentMetadataForToken} from "./actions/TokenActions";
import PinPadError from "../signWizard/pages/PinPadError";
import TokenDisplayFile from "./components/DisplayFile/TokenDisplayFile";
import DigestForTokenLoadingContainer from "./pages/DigestForTokenLoadingContainer";
import SigningPreSignLoading from "../signWizard/pages/SigningPreSignLoading";
import SigningLoadingContainer from "../signWizard/pages/SigningLoading";
import {useRouter} from "../utils/useRouter";
import SuccesForTokenContainer from "./pages/SuccesForTokenContainer";
import MetadataLoadingContainer from "./pages/MetadataLoadingContainer";

export const TokenWizardContainer = ({ wizard, reader, resetWizard, doSetToken }) => {
    const router = useRouter();
    useEffect(() => {
        doSetToken(router.query.token, router.query.redirectUrl);
    }, [router.query.token])
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
            content = <PinInputContainer />;
            break;
        case WIZARD_STATE_SIGNING_LOADING:
            content = <SigningLoadingContainer />;
            break;
        case WIZARD_STATE_PINPAD_ERROR:
            content = <PinPadError />
            break;
        case WIZARD_STATE_SUCCES:
            content = <SuccesForTokenContainer />;
            break;
        case WIZARD_STATE_MESSAGE:
            content = <MessageContainerWithStore onCancel={() => { (resetWizard()) }} />;
            break;
        default:
            content = <MessageContainer message={ErrorGeneral} onCancel={() => { (resetWizard()) }} />
            break;
    }
    return (
        <div >
            <div className={"row mx-5 mt-3"}>
                <div className={"col col-7"}>
                    <TokenDisplayFile />
                </div>
                <div className={"col col-5"}>
                    {content}
                </div>
            </div>
        </div >)
}

const mapStateToProps = (state, ownProps) => {
    return (state) => ({
        wizard: state.wizard,
        reader: state.reader
    })
}

const mapDispatchToProps = ({
    resetWizard,
    doSetToken
})

export default connect(mapStateToProps, mapDispatchToProps)(TokenWizardContainer)