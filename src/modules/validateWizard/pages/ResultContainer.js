import React from 'react'
import { connect } from 'react-redux';
import { CardContainer } from '../../components/Card/CardContainer';
import { resetWizard } from '../actions/WizardLogicActions';
import { indication, indicationKeys, subIndication, subIndicationKeys } from '../constants/indicationConstants';
import { MessageContainer } from '../../message/MessageContainer';
import { ErrorGeneral } from '../../message/MessageConstants';

export class ResultContainer extends React.Component {

    render() {
        const { validation, resetWizard } = this.props

        let subIndicationResult = "";

        if (validation && validation.subIndication && subIndicationKeys.includes(validation.subIndication)) {
            const subIndicationUsed = subIndication[validation.subIndication]
            subIndicationResult = (
                <div className="text-center">
                    <div className={"alert " + subIndicationUsed.className}>
                        {subIndicationUsed.message}
                    </div>

                </div>
            )
        }

        let result = <MessageContainer message={ErrorGeneral} onCancel={() => { resetWizard() }} />

        if (indicationKeys.includes(validation.indication)) {
            const indicationUsed = indication[validation.indication]
            result = (
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
                    {subIndicationResult}
                </CardContainer>
            )
        }

        return (
            <div>{result}</div>

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
