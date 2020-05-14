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
            }
            if ((UsedBrowser === browser.SAFARI) && window.configData.eIDLinkExtensionUrls.safari) {
                url = window.configData.eIDLinkExtensionUrls.safari
            }

        }

        if (url) {
            window.open(url, "_blank")
        }
        //return correct link for browser
    }
    render() {
        const { resetWizard } = this.props

        return (

            <CardContainer title={"Install eId link extension"}
                onClickCancel={() => { resetWizard() }}
                hasNextButton
                nextButtonText="Next"
                onClickNext={() => { this.handleButtonNextClick() }}
            >
                <p>No eId link extension found</p>
                <p>Please install the eId link extension to use this application</p>

                <button
                    className="btn btn-primary"
                    id="button_install_eID"
                    onClick={() => { this.openExtensionLink() }}>
                    Install eId link extension
                    </button>

            </CardContainer>

        )
    }
}

const mapDispatchToProps = ({
    navigateToStep,
    resetWizard
})

export default connect(null, mapDispatchToProps)(VersionCheckInstallExtensionContainer)