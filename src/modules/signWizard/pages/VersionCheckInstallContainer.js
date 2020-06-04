import React from 'react'
import { connect } from 'react-redux'
import { CardContainer } from '../../components/Card/CardContainer'
import { navigateToStep } from "../../wizard/WizardActions"
import { WIZARD_STATE_VERSION_CHECK_LOADING } from '../../wizard/WizardConstants'
import { resetWizard, checkVersion } from '../actions/WizardLogicActions'
import { OS, getOS } from "../../browserDetection/OSDetection"
import { EIDLinkLinuxInstall } from '../../components/EIDLinkLinuxInstall/EIDLinkLinuxInstall'
export class VersionCheckInstallContainer extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            intervalId: ""
        }
    }

    componentDidMount() {
        const { checkVersion } = this.props
        const id = setInterval(() => {
            checkVersion()
        }, 5000);
        this.setState({ intervalId: id })
    }
    componentWillUnmount() {
        const id = this.state.intervalId
        if (id) {
            clearInterval(id)
        }
    }
    //TODO loop to check if correct version is installed
    handleButtonNextClick() {
        this.props.navigateToStep(WIZARD_STATE_VERSION_CHECK_LOADING)
    }


    handleOnClick() {
        const usedOs = getOS()
        if (usedOs === OS.WINDOWS && window.configData && window.configData.eIDLinkUrls && window.configData.eIDLinkUrls.windows) {
            window.open(window.configData.eIDLinkUrls.windows + '?dt=' + new Date().getTime(), "_blank")

        }
        if (usedOs === OS.MACOS && window.configData && window.configData.eIDLinkUrls && window.configData.eIDLinkUrls.macOs) {
            window.open(window.configData.eIDLinkUrls.macOs + '?dt=' + new Date().getTime(), "_blank")

        }

    }

    render() {
        const { resetWizard } = this.props
        const usedOs = getOS()
        return (

            <CardContainer title={"Install eIDLink"}
                onClickCancel={() => { resetWizard() }}
                hasNextButton
                nextButtonText="I have installed eIDLink"
                onClickNext={() => { this.handleButtonNextClick() }}
            >
                <p>No eIDLink is found</p>
                <p>Please install eIDLink to use this application</p>

                {
                    (usedOs === OS.LINUX)
                        ? <EIDLinkLinuxInstall linuxDistributions={linuxDistributions} />
                        : <button className="btn btn-primary" id="button_install_eID" onClick={() => { this.handleOnClick() }}>Download and install eIDLink</button>
                }


            </CardContainer>

        )
    }
}

const hasLinuxUrls = (window.configData
    && window.configData.eIDLinkUrls
    && window.configData.eIDLinkUrls.linux
    && Object.keys(window.configData.eIDLinkUrls.linux).length !== 0)

const linuxDistributions = (hasLinuxUrls)
    ? Object.values(window.configData.eIDLinkUrls.linux)
    : [];


const mapDispatchToProps = ({
    navigateToStep,
    checkVersion,
    resetWizard
})

export default connect(null, mapDispatchToProps)(VersionCheckInstallContainer)