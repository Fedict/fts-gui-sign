import React from 'react'
import { connect } from 'react-redux';
import { CardContainer } from '../../components/CardContainer/CardContainer';
import { resetWizard } from '../actions/WizardLogicActions';
import { indication, indicationKeys } from '../constants/indicationConstants';
import { MessageContainer } from '../../message/MessageContainer';
import { ErrorGeneral } from '../../message/MessageConstants';


export class ResultContainer extends React.Component {

    render() {
        const { validation, resetWizard } = this.props


        let result = <MessageContainer message={ErrorGeneral} onCancel={() => { resetWizard() }} />

        if (indicationKeys.includes(validation.indication)) {
            const indicationUsed = indication[validation.indication]
            result = (
                <div className="row mt-3">
                    <CardContainer
                        title={"result of the validation"}
                        hasNextButton
                        nextButtonText="Validate next document"
                        onClickNext={() => { resetWizard() }}
                    >
                        <div className="text-center">
                            <div className={"alert " + indicationUsed.className}>
                                {indicationUsed.message}
                            </div>

                        </div>

                    </CardContainer>

                </div>
            )
        }
        return (
            <div>{ result }</div>

        )
    }
}

const mapStateToProps = (state) => {
    return (state) => ({
        validation: state.validation
    })
}
const mapDispatchToProps = ({
    resetWizard


})

export default connect(mapStateToProps, mapDispatchToProps)(ResultContainer)
