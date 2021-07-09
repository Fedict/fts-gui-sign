import React from 'react'
import { connect } from 'react-redux'
import { CardContainer } from '../../components/Card/CardContainer'
import { navigateToStep } from "../../wizard/WizardActions"
import { WIZARD_STATE_VERSION_CHECK_LOADING } from '../../wizard/WizardConstants'
import { resetWizard, checkVersion } from '../actions/WizardLogicActions'
import { OS, getOS } from "../../browserDetection/OSDetection"
import { EIDLinkLinuxInstall } from '../../components/EIDLinkLinuxInstall/EIDLinkLinuxInstall'
import {defineMessages, FormattedMessage, injectIntl} from "react-intl";
const messages = defineMessages({
    title : {
        id : 'eid.install.title',
        defaultMessage : "Install eIDLink"
    },
    next : {
        id : 'eid.install.next',
        defaultMessage : "I have installed eIDLink"
    }
})
export class VersionCheckInstallContainer extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            intervalId: "",
            installButtonClicked : false
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

        this.setState({installButtonClicked : true})
    }

    render() {
        const { resetWizard, intl } = this.props
        const usedOs = getOS()
        return (
            <CardContainer title={intl.formatMessage(messages.title)}
                onClickCancel={() => { resetWizard() }}
                hasNextButton
                nextButtonText={intl.formatMessage(messages.next)}
                onClickNext={() => { this.handleButtonNextClick() }}
                nextButtonIsDisabled={!this.state.installButtonClicked}
            >
                <p><FormattedMessage id="eid.install.text.1" defaultMessage="No eIDLink is found"/></p>
                <p><FormattedMessage id="eid.install.text.2" defaultMessage="Please install eIDLink to use this application"/></p>

                {
                    (usedOs === OS.LINUX)
                        ? <EIDLinkLinuxInstall linuxDistributions={linuxDistributions} />
                        : <button className={this.state.installButtonClicked?"btn btn-secondary":"btn btn-primary"} id="button_install_eID" onClick={() => { this.handleOnClick() }}><FormattedMessage id="eid.button.download" defaultMessage="Download and install eIDLink" /></button>
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

export default connect(null, mapDispatchToProps)(injectIntl(VersionCheckInstallContainer))