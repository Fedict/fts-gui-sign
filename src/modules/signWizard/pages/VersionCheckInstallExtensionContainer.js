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
        defaultMessage : "Install eIDLink extension"
    },
    next : {
        id : "extension.install.next",
        defaultMessage : "I have installed eIDLink Extension"
    },
    altChromeStoreImg : {
        id : 'chrome.store.img.alt',
        defaultMessage : "button to Chrome webstore"
    }
})
export class VersionCheckInstallExtensionContainer extends React.Component {

    handleButtonNextClick() {
        window.location.reload();
    }

    openExtensionLink() {
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
            if ((UsedBrowser === browser.IE) && window.configData.eIDLinkExtensionUrls.IE) {
                url = window.configData.eIDLinkExtensionUrls.IE
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
        const usedBrowser = getBrowser()
        const { resetWizard, intl } = this.props

        return (
            <CardContainer title={intl.formatMessage(messages.title)}
                onClickCancel={() => { resetWizard() }}
                hasNextButton
                nextButtonText={intl.formatMessage(messages.next)}
                onClickNext={() => { this.handleButtonNextClick() }}
                autoClickNextTimeout={undefined}
            >

                <p><FormattedMessage id="extension.install.text.1" defaultMessage="No eIDLink extension found."/></p>
                <p><FormattedMessage id="extension.install.text.2" defaultMessage="Please install the eIDLink extension to use this application."/></p>
                <p><FormattedMessage id="extension.install.text.3" defaultMessage='After you installed the eIDLink extension you can come back to this page an push the "I have installed eIDLink Extension" button.'/></p>

                {(usedBrowser === browser.CHROME || usedBrowser === browser.EDGE)
                    ? (<img src="/img/ChromeWebStore_BadgeWBorder_v2_206x58.png"
                        style={{ cursor: "pointer" }}
                        alt={intl.formatMessage(messages.altChromeStoreImg)}
                        onClick={() => { this.openExtensionLink() }} />)
                    : (<button
                        className="btn btn-primary"
                        id="button_install_eID"
                        onClick={() => { this.openExtensionLink() }}>
                        <FormattedMessage id="extension.install.button" defaultMessage="Install eIDLink extension"/>
                    </button>)}

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