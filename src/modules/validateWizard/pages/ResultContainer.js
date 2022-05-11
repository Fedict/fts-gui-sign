import React from 'react'
import { connect } from 'react-redux';
import { CardContainer } from '../../components/Card/CardContainer';
import { resetWizard } from '../actions/WizardLogicActions';
import { indication, indicationKeys, subIndication, subIndicationKeys } from '../constants/indicationConstants';
import { MessageContainer } from '../../message/MessageContainer';
import { ErrorGeneral } from '../../message/MessageConstants';
import {defineMessages, FormattedMessage, injectIntl} from "react-intl";

const messages = defineMessages({
    title: {
        id: "validate.result.title",
        defaultMessage: "Result of the validation"
    },
    next: {
        id: "validate.result.validateNextButton",
        defaultMessage: "Validate next document"
    }
})

export class ResultContainer extends React.Component {

    render() {
        const { validation, resetWizard, intl } = this.props

        let subIndicationResult = "";

        if (validation && validation.subIndication && subIndicationKeys.includes(validation.subIndication)) {
            const subIndicationUsed = subIndication[validation.subIndication]
            subIndicationResult = (
                <div className="text-center">
                    <div className={"alert " + subIndicationUsed.className}>
                    <FormattedMessage id={subIndicationUsed.id} defaultMessage={subIndicationUsed.message} />
                    </div>

                </div>
            )
        }

        let result = <MessageContainer message={ErrorGeneral} onCancel={() => { resetWizard() }} />

        if (indicationKeys.includes(validation.indication)) {
            const indicationUsed = indication[validation.indication]
            result = (
                <CardContainer
                    title={intl.formatMessage(messages.title)}
                    hasNextButton
                    nextButtonText={intl.formatMessage(messages.next)}
                    onClickNext={() => { resetWizard() }}
                >
                    <div className="text-center">
                        <div className={"alert " + indicationUsed.className}>
                        <FormattedMessage id={indicationUsed.id} defaultMessage={indicationUsed.message} />
                        </div>

                    </div>
                    <a href={"data:text/plain;charset=utf-8," + validation.report} download="report.json">Download report</a>
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ResultContainer))
