import React from 'react'
import { connect } from 'react-redux'
import { CardContainer } from '../../components/Card/CardContainer'
import { navigateToStep } from "../../wizard/WizardActions"
import { resetWizard } from '../actions/WizardLogicActions'
import { getBrowser, browser } from '../../browserDetection/BrowserDetection'


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
                //TODO remove this when firefox url links to store page
                window.open(url + '?dt=' + new Date().getTime(), "_self")
                url = ""
            }
            if ((UsedBrowser === browser.SAFARI) && window.configData.eIDLinkExtensionUrls.safari) {
                url = window.configData.eIDLinkExtensionUrls.safari
                
            }

        }

        if (url) {
            window.open(url + '?dt=' + new Date().getTime(), "_blank")
        }
        //return correct link for browser
    }
    render() {
        const usedBrowser = getBrowser()
        const { resetWizard } = this.props

        return (

            <CardContainer title={"Install eIDLink extension"}
                onClickCancel={() => { resetWizard() }}
                hasNextButton
                nextButtonText="I have installed eIDLink Extension"
                onClickNext={() => { this.handleButtonNextClick() }}
            >
                <p>No eIDLink extension found.</p>
                <p>Please install the eIDLink extension to use this application.</p>
                <p>If you click the button, you will be redirected to the install page of the eID extension .</p>
                <p>After you installed the eIDLink extension you can come back to this page an push the "I have installed eIDLink Extension" button.</p>

                {(usedBrowser === browser.CHROME || usedBrowser === browser.EDGE)
                    ? (<img src="./img/ChromeWebStore_BadgeWBorder_v2_206x58.png"
                        style={{ cursor: "pointer" }}
                        alt={"button to Chrome webstore"}
                        onClick={() => { this.openExtensionLink() }} />)
                    : (<button
                        className="btn btn-primary"
                        id="button_install_eID"
                        onClick={() => { this.openExtensionLink() }}>
                        {

                            "Install eIDLink extension"}
                    </button>)}

            </CardContainer>

        )
    }
}

const mapDispatchToProps = ({
    navigateToStep,
    resetWizard
})

export default connect(null, mapDispatchToProps)(VersionCheckInstallExtensionContainer)