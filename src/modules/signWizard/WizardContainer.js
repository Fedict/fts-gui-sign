import React from 'react'
import {
    WIZARD_STATE_UPLOAD,
    WIZARD_STATE_VERSION_CHECK_LOADING,
    WIZARD_STATE_VERSION_CHECK_UPDATE,
    WIZARD_STATE_VERSION_CHECK_INSTALL,
    WIZARD_STATE_CERTIFICATES_LOADING,
    WIZARD_STATE_CERTIFICATES_CHOOSE,
    WIZARD_STATE_VALIDATE_LOADING,
    WIZARD_STATE_DIGEST_LOADING,
    WIZARD_STATE_PIN_INPUT,
    WIZARD_STATE_SUCCES,
    WIZARD_STATE_SIGNING_LOADING,
    WIZARD_STATE_MESSAGE,
    WIZARD_STATE_SIGNING_PRESIGN_LOADING,
    WIZARD_STATE_PINPAD_ERROR,
    WIZARD_STATE_VERSION_CHECK_INSTALL_EXTENSION,
    WIZARD_STATE_START,
    WIZARD_STATE_CERTIFICATES_VALIDATE_CHAIN
} from '../wizard/WizardConstants'
import UploadFileContainer from './pages/UploadFileContainer'
import { connect } from 'react-redux'
import VersionCheckLoadingContainer from './pages/VersionCheckLoadingContainer'
import VersionCheckUpdateContainer from './pages/VersionCheckUpdateContainer'
import VersionCheckInstallContainer from './pages/VersionCheckInstallContainer'
import CertificatesLoadingContainer from './pages/CertificatesLoadingContainer'
import ValidateLoadingContainer from './pages/ValidateLoadingContainer'
import DigestLoadingContainer from './pages/DigestLoadingContainer'
import PinInputContainer from './pages/PinInputContainer'
import SuccesContainer from './pages/SuccesContainer'
import SigningLoadingContainer from './pages/SigningLoading'
import { MessageContainer } from '../message/MessageContainer'
import CertificateChooseContainer from './pages/CertificateChooseContainer'
import SigningPreSignLoading from './pages/SigningPreSignLoading'
import PinPadError from './pages/PinPadError'
import VersionCheckInstallExtensionContainer from './pages/VersionCheckInstallExtensionContainer'
import { ErrorGeneral } from '../message/MessageConstants'
import { resetWizard } from './actions/WizardLogicActions'
import DisplayFile from '../fileUpload/components/UploadDisplayFile/UploadDisplayFile'
import CertificateValidateChainContainer from './pages/CertificateValidateChainContainer'

export const WizardContainer = ({ wizard, reader, resetWizard }) => {
    let content = null;
    switch (wizard.state) {
        case WIZARD_STATE_START:
            if (reader && reader.isOk && reader.isChecked) {
                content = <UploadFileContainer />;
            }
            else {
                content = <VersionCheckLoadingContainer />;
            }
            break;
        case WIZARD_STATE_UPLOAD:
            content = <UploadFileContainer />;
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
            content = <DigestLoadingContainer />;
            break;
        case WIZARD_STATE_PIN_INPUT:
            content = <PinInputContainer />;
            break;
        case WIZARD_STATE_SIGNING_LOADING:
            content = <SigningLoadingContainer />;
            break;
        case WIZARD_STATE_SUCCES:
            content = <SuccesContainer />;
            break;
        case WIZARD_STATE_MESSAGE:
            content = <MessageContainer onCancel={() => { (resetWizard()) }} />;
            break;
        case WIZARD_STATE_SIGNING_PRESIGN_LOADING:
            content = <SigningPreSignLoading />;
            break;
        case WIZARD_STATE_PINPAD_ERROR:
            content = <PinPadError />
            break;
        default:
            content = <MessageContainer message={ErrorGeneral} onCancel={() => { (resetWizard()) }} />
            break;
    }

    return (
        <div >
            <div className={"row mx-5 mt-3"}>
                <div className={"col col-sm-7"} style={{ minWidth: '320px' }}>
                    <DisplayFile />
                </div>
                <div className={"col col-sm-5"}>
                    {content}
                </div>
            </div>
        </div >)
}

const mapStateToProps = (state) => {
    return (state) => ({
        wizard: state.wizard,
        reader: state.reader
    })
}

const mapDispatchToProps = ({
    resetWizard
})

export default connect(mapStateToProps, mapDispatchToProps)(WizardContainer)