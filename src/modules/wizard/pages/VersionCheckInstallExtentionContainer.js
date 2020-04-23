import React from 'react'
import { connect } from 'react-redux'
import { CardContainer } from '../../components/CardContainer/CardContainer'
import { navigateToStep } from "../actions/WizardActions"
import { WIZARD_STATE_VERSION_CHECK_LOADING } from '../wizard/WizardConstants'
import { resetWizard } from '../actions/WizardLogicActions'
export class VersionCheckInstallExtentionContainer extends React.Component {

    //TODO loop to check if correct version is installed
    handleButtonNextClick() {
        window.location.reload();
    }

    getExtentionLink() {
        //return correct link for browser
    }
    render() {
        const { resetWizard } = this.props

        return (
            <div className="row mt-3">
                <CardContainer title={"installeer eID link extentie"}
                    onClickCancel={() => { resetWizard() }}
                    hasNextButton
                    nextButtonText="ga verder"
                    onClickNext={() => { this.handleButtonNextClick() }}
                >
                    <p>Er is geen versie van eIDLink extentie gevonden.</p>
                    <p>Gelieve eIDlink te instaleren om gebruik te kunnen maken van deze applicatie</p>

                    <button className="btn btn-primary" id="button_install_eID">
                        Download en installeer eIDLink extentie
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