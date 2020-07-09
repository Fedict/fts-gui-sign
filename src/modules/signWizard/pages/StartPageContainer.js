import React from 'react'
import { connect } from 'react-redux'
import { CardContainer } from '../../components/Card/CardContainer'
import { WIZARD_STATE_UPLOAD, WIZARD_STATE_VERSION_CHECK_LOADING } from '../../wizard/WizardConstants'
import { navigateToStep } from '../../wizard/WizardActions'
import { MethodeSelectCard } from '../../components/MethodSelect/MethodSelectCard'


export class StartPageContainer extends React.Component {


    navigateToNextStep() {
        const { navigateToStep, reader } = this.props
        if (reader) {
            if (reader.isChecked && reader.isOk) {
                navigateToStep(WIZARD_STATE_UPLOAD)
            }
            else {
                navigateToStep(WIZARD_STATE_VERSION_CHECK_LOADING)
            }
        }
    }

    render() {


        return (

            <CardContainer
                title="Select the method to sign"

            >
                <MethodeSelectCard
                    index={0}
                    id={"MethodSelect"}
                    name={"eID"}
                    onClick={() => { this.navigateToNextStep() }}
                    imgSrc={"./img/SignIcons/personIcon.svg"} />
                <MethodeSelectCard
                    index={1}
                    id={"MethodSelect"}
                    name={"something else"}
                    url={"https://www.google.com/"}
                    imgSrc={"./img/SignIcons/emailIcon.svg"} />
            </CardContainer>

        )
    }


}
const mapStateToProps = (state) => {
    return (state) => ({
        reader: state.reader
    })
}
const mapDispatchToProps = ({
    navigateToStep,
})

export default connect(mapStateToProps, mapDispatchToProps)(StartPageContainer)