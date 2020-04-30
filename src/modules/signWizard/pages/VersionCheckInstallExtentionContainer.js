import React from 'react'
import { connect } from 'react-redux'
import { CardContainer } from '../../components/CardContainer/CardContainer'
import { navigateToStep } from "../../wizard/WizardActions"
import { WIZARD_STATE_VERSION_CHECK_LOADING } from '../../wizard/WizardConstants'
import { resetWizard } from '../actions/WizardLogicActions'
import { isChrome, isEdgeChromium, getBrowser, browser } from '../../browserDetection/BrowserDetection'
export class VersionCheckInstallExtentionContainer extends React.Component {

    handleButtonNextClick() {
        window.location.reload();
    }

    openExtentionLink() {
        let url
        if (window.configData && window.configData.eIDLinkExtentionUrls) {
            if ((getBrowser() === browser.CHROME) && window.configData.eIDLinkExtentionUrls.chrome) {
                console.log("ik ben hier")
                url = window.configData.eIDLinkExtentionUrls.chrome
            }
            if ((getBrowser() === browser.EDGE) && window.configData.eIDLinkExtentionUrls.edge) {
                url = window.configData.eIDLinkExtentionUrls.edge
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
            <div className="row mt-3">
                <CardContainer title={"Install eId link extention"}
                    onClickCancel={() => { resetWizard() }}
                    hasNextButton
                    nextButtonText="Next"
                    onClickNext={() => { this.handleButtonNextClick() }}
                >
                    <p>No eId link extention found</p>
                    <p>Please install the eId link extention to use this application</p>

                    <button
                        className="btn btn-primary"
                        id="button_install_eID"
                        onClick={() => { this.openExtentionLink() }}>
                        Install eId link extention
                    </button>

                </CardContainer>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return (state) => ({

    })
}
const mapDispatchToProps = ({
    navigateToStep,
    resetWizard
})

export default connect(mapStateToProps, mapDispatchToProps)(VersionCheckInstallExtentionContainer)