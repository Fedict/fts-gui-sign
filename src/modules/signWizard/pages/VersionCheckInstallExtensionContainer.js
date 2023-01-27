import React from 'react'
import { connect } from 'react-redux'
import { CardContainer } from '../../components/Card/CardContainer'
import { navigateToStep } from "../../wizard/WizardActions"
import { resetWizard } from '../actions/WizardLogicActions'
import { getBrowser, browser } from '../../browserDetection/BrowserDetection'
import {defineMessages, FormattedMessage, injectIntl} from "react-intl";
import {EIDChromeExtMock} from "../../testUtils/EIDChromeExtMock";
import {WIZARD_STATE_UPLOAD} from "../../wizard/WizardConstants";

const messages = defineMessages({
    title : {
        id : "extension.install.title",
        defaultMessage : "Install BeIDConnect extension"
    },
    next : {
        id : "extension.install.next",
        defaultMessage : "I have installed BeIDConnect Extension"
    },
    altChromeStoreImg : {
        id : 'chrome.store.img.alt',
        defaultMessage : "Button to Chrome web store"
    }
})
export class VersionCheckInstallExtensionContainer extends React.Component {

    state = {extensionClicked : false}

    handleButtonNextClick() {
        window.location.reload();
    }

    openExtensionLink() {
        this.setState({extensionClicked : true})
        let url
        if (window.configData && window.configData.eIDLinkExtensionUrls) {
            const UsedBrowser = getBrowser()
            if ((UsedBrowser === browser.CHROME) && window.configData.eIDLinkExtensionUrls.chrome) {
                url = window.configData.eIDLinkExtensionUrls.chrome
            }
            if ((UsedBrowser === browser.EDGE) && window.configData.eIDLinkExtensionUrls.edge) {
                url = window.configData.eIDLinkExtensionUrls.edge
            }
            if ((UsedBrowser === browser.FIREFOX) && window.configData.eIDLinkExtensionUrls.firefox) {
                url = window.configData.eIDLinkExtensionUrls.firefox
                window.open(url + '?dt=' + new Date().getTime(), "_self")
                url = ""
            }
            if ((UsedBrowser === browser.SAFARI) && window.configData.eIDLinkExtensionUrls.safari) {
                url = window.configData.eIDLinkExtensionUrls.safari
                window.open(url + '?dt=' + new Date().getTime(), "_self")
                url = ""
            }
        }

        if (url) {
            window.open(url + '?dt=' + new Date().getTime(), "_blank")
        }
    }

    useExtensionMock(){
        Object.defineProperty(window, "EIDChromeExt", ((value) => ({
            get() { return value; },
            set(v) { value = v; }
        }))(EIDChromeExtMock));
        this.props.navigateToStep(WIZARD_STATE_UPLOAD);
    }

    render() {
        const { resetWizard, intl } = this.props

        return (
            <CardContainer title={intl.formatMessage(messages.title)}
                onClickCancel={() => { resetWizard() }}
                hasNextButton
                nextButtonText={intl.formatMessage(messages.next)}
                nextButtonIsDisabled={!this.state.extensionClicked}
                onClickNext={() => { this.handleButtonNextClick() }}
                autoClickNextTimeout={undefined}
            >

                <p><FormattedMessage id="extension.install.text.1" defaultMessage="No BeIDConnect extension found."/></p>
                <p><FormattedMessage id="extension.install.text.2" defaultMessage="Please install the BeIDConnect extension to use this signing application. Each browser type needs an extension to be able to use the function of BeIDConnect optimally. You can find the extension in the web store below."/></p>
                <p><FormattedMessage id="extension.install.text.3" defaultMessage="After you installed this extension, you can confirm this on this page by clicking on {extensionInstallNext}."
                                     values={{extensionInstallNext : intl.formatMessage(messages.next)}}
                /></p>

                    <button
                        className={this.state.extensionClicked?"btn btn-secondary":"btn btn-primary"}
                        id="button_install_eID"
                        onClick={() => { this.openExtensionLink() }}>
                        <FormattedMessage id="extension.install.button" defaultMessage="Install BeIDConnect extension"/>
                    </button>

                {process.env.NODE_ENV === 'development' &&
                    <button className="btn" onClick={() => this.useExtensionMock()}>Use mock</button>
                }
            </CardContainer>
        )
    }
}

const mapDispatchToProps = ({
    navigateToStep,
    resetWizard
})

export default connect(null, mapDispatchToProps)(injectIntl(VersionCheckInstallExtensionContainer))