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
    WIZARD_STATE_VERSION_CHECK_INSTALL_EXTENTION,
    WIZARD_STATE_START
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
import MessageContainerWithStore from '../message/MessageContainer'
import { MessageContainer } from '../message/MessageContainer'
import CertificateChooseContainer from './pages/CertificateChooseContainer'
import SigningPreSignLoading from './pages/SigningPreSignLoading'
import PinPadError from './pages/PinPadError'
import VersionCheckInstallExtentionContainer from './pages/VersionCheckInstallExtentionContainer'
import { ErrorGeneral } from './messages/ErrorGeneral'

export const WizardContainer = ({ wizard, reader }) => {


    switch (wizard.state) {
        case WIZARD_STATE_START:
            if (reader && reader.ok) {
                return <UploadFileContainer />
            }
            else {
                return <VersionCheckLoadingContainer />
            }
        case WIZARD_STATE_UPLOAD:
            return <UploadFileContainer />;
        case WIZARD_STATE_VERSION_CHECK_LOADING:
            return <VersionCheckLoadingContainer />;
        case WIZARD_STATE_VERSION_CHECK_UPDATE:
            return <VersionCheckUpdateContainer />;
        case WIZARD_STATE_VERSION_CHECK_INSTALL:
            return <VersionCheckInstallContainer />;

        case WIZARD_STATE_VERSION_CHECK_INSTALL_EXTENTION:
            return <VersionCheckInstallExtentionContainer />
        case WIZARD_STATE_CERTIFICATES_LOADING:
            return <CertificatesLoadingContainer />;


        case WIZARD_STATE_CERTIFICATES_CHOOSE:
            return <CertificateChooseContainer />

        case WIZARD_STATE_VALIDATE_LOADING:
            return <ValidateLoadingContainer />

        case WIZARD_STATE_DIGEST_LOADING:
            return <DigestLoadingContainer />
        case WIZARD_STATE_PIN_INPUT:
            return <PinInputContainer />

        case WIZARD_STATE_SIGNING_LOADING:
            return <SigningLoadingContainer />
        case WIZARD_STATE_SUCCES:
            return <SuccesContainer />
        case WIZARD_STATE_MESSAGE:
            return <MessageContainerWithStore />

        case WIZARD_STATE_SIGNING_PRESIGN_LOADING:
            return <SigningPreSignLoading />
        case WIZARD_STATE_PINPAD_ERROR:
            return <PinPadError />


        default:
            return <MessageContainer message={ErrorGeneral} />
    }


}


const mapStateToProps = (state) => {
    return (state) => ({
        wizard: state.wizard,
        reader: StaticRange.reader
    })
}
const mapDispatchToProps = ({

})

export default connect(mapStateToProps, mapDispatchToProps)(WizardContainer)