import React from 'react'
import { connect } from 'react-redux'
import { CardContainer } from '../../components/Card/CardContainer'
import { navigateToStep } from "../../wizard/WizardActions"
import { WIZARD_STATE_VERSION_CHECK_LOADING } from '../../wizard/WizardConstants'
import { resetWizard, checkVersion } from '../actions/WizardLogicActions'
import { getOS, OS } from '../../browserDetection/OSDetection'
import { getBrowser, browser } from "../../browserDetection/BrowserDetection";
import { EIDLinkLinuxInstall } from '../../components/EIDLinkLinuxInstall/EIDLinkLinuxInstall'
import {defineMessages, FormattedMessage, injectIntl} from "react-intl";
import {definedMessages} from "../../i18n/translations";

const messages = defineMessages({
    title : {
        id : 'eid.update.title',
        defaultMessage : "Update eIDLink"
    }
})

export class VersionCheckUpdateContainer extends React.Component {

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

    handleButtonNextClick() {
        this.props.navigateToStep(WIZARD_STATE_VERSION_CHECK_LOADING)
    }

    handleOnClick() {
        const usedOs = getOS()
        const usedBrowser = getBrowser()

        if (usedOs === OS.WINDOWS && window.configData && window.configData.eIDLinkUrls && window.configData.eIDLinkUrls.windows) {
            const { intl } = this.props;
            var language="en";
            
            if (intl.locale!==null && intl.locale!==undefined && (intl.locale==="fr" ||intl.locale==="nl" ||intl.locale==="de"))
            {
                language = intl.locale;
            }
            console.log(window.configData.eIDLinkUrls.windows[language] + '?dt=' + new Date().getTime(), "_blank");
            if (navigator.userAgent.includes("WOW64") || navigator.userAgent.includes("Win64")) {
                window.open(window.configData.eIDLinkUrls.windowsX64[language] + '?dt=' + new Date().getTime(), "_blank")
            } else {
                window.open(window.configData.eIDLinkUrls.windows[language] + '?dt=' + new Date().getTime(), "_blank")
            }
        }
        if (usedOs === OS.MACOS) {
            if (usedBrowser === browser.SAFARI && window.configData && window.configData.eIDLinkExtensionUrls && window.configData.eIDLinkExtensionUrls.safari) {
                window.open(window.configData.eIDLinkExtensionUrls.safari + '?dt=' + new Date().getTime(), "_blank")
            }
            else if (window.configData && window.configData.eIDLinkUrls && window.configData.eIDLinkUrls.macOs) {
                window.open(window.configData.eIDLinkUrls.macOs + '?dt=' + new Date().getTime(), "_blank")
            }
        }
        if (usedOs === OS.LINUX && window.configData && window.configData.eIDLinkUrls && window.configData.eIDLinkUrls.linux) {
            window.open(window.configData.eIDLinkUrls.linux + '?dt=' + new Date().getTime(), "_blank")
        }
    }

    render() {
        const { resetWizard, intl } = this.props
        const usedOs = getOS()
        const usedBrowser = getBrowser()

        console.log(usedOs);
        console.log(usedBrowser);

        return (
            <CardContainer title={intl.formatMessage(messages.title)}
                onClickCancel={() => { resetWizard() }}
                hasNextButton
                nextButtonText={intl.formatMessage(definedMessages.next)}
                onClickNext={() => { this.handleButtonNextClick() }}
            >
                <p><FormattedMessage id="eid.update.text.1" defaultMessage="The installed version of eIDLink is not up to date." /></p>
                <p><FormattedMessage id="eid.update.text.2" defaultMessage="Please install the latest version of eIDLink to use this aplication"/> </p>
                {
                    (usedOs === OS.LINUX)
                        ? <EIDLinkLinuxInstall linuxDistributions={linuxDistributions} />
                        :  <button className="btn btn-primary" id="button_install_eID" onClick={() => { this.handleOnClick() }}>
                            <FormattedMessage id="eid.button.download" defaultMessage="Download and install eIDLink" />
                            </button>
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
    resetWizard,
    checkVersion
})

export default connect(null, mapDispatchToProps)(injectIntl(VersionCheckUpdateContainer))