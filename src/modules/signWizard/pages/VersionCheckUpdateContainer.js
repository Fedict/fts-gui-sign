import React from 'react'
import { connect } from 'react-redux'
import { CardContainer } from '../../components/Card/CardContainer'
import { navigateToStep } from "../../wizard/WizardActions"
import { WIZARD_STATE_VERSION_CHECK_LOADING } from '../../wizard/WizardConstants'
import { resetWizard } from '../actions/WizardLogicActions'
import { getOS, OS } from '../../browserDetection/OSDetection'
export class VersionCheckUpdateContainer extends React.Component {

    //TODO loop to check if correct version is installed
    handleButtonNextClick() {
        this.props.navigateToStep(WIZARD_STATE_VERSION_CHECK_LOADING)
    }

    handleOnClick(){
        const usedOs = getOS()
        if (usedOs === OS.WINDOWS && window.configData && window.configData.eIDLinkUrls && window.configData.eIDLinkUrls.windows) {
            window.open(window.configData.eIDLinkUrls.windows, "_blank")

        }
        if (usedOs === OS.MACOS && window.configData && window.configData.eIDLinkUrls && window.configData.eIDLinkUrls.macOs) {
            window.open(window.configData.eIDLinkUrls.macOs, "_blank")

        }
        if (usedOs === OS.LINUX && window.configData && window.configData.eIDLinkUrls && window.configData.eIDLinkUrls.linux) {
            window.open(window.configData.eIDLinkUrls.linux, "_blank")

        } 
    }
    render() {

        const { resetWizard } = this.props
        return (

            <CardContainer title={"Update eIDLink"}
                hasCancelButton
                cancelButtonText="Cancel"

                onClickCancel={() => { resetWizard() }}
                hasNextButton
                nextButtonText="next"
                onClickNext={() => { this.handleButtonNextClick() }}
            >
                <p>The installed version of eIDLink is not up to date.</p>
                <p>Please install the latest version of eIDLink to use this aplication </p>

                <button className="btn btn-primary" id="button_install_eID" onClick={() => { this.handleOnClick() }}>Download and install eIDLink</button>

            </CardContainer>

        )
    }
}

const mapDispatchToProps = ({
    navigateToStep,
    resetWizard
})

export default connect(null, mapDispatchToProps)(VersionCheckUpdateContainer)