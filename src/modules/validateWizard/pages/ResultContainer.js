import React from 'react'
import { connect } from 'react-redux';
import { CardContainer } from '../../components/Card/CardContainer';
import { resetWizard } from '../actions/WizardLogicActions';
import { indication, indicationKeys, subIndication, subIndicationKeys } from '../constants/indicationConstants';
import { MessageContainer } from '../../message/MessageContainer';
import { ErrorGeneral } from '../../message/MessageConstants';
import {defineMessages, FormattedMessage, injectIntl} from "react-intl";
import { saveAs } from 'file-saver';

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

function getSignature(validation) {
    var sig = getSignatures(validation)[0];
    return sig.who + '  on ' + sig[0];
}

function getSignatures(validation) {
    var signatures = validation.diagnosticData.Signature.map(sig => [sig.ClaimedSigningTime, sig.ChainItem[0].Certificate]);
    signatures.forEach(sig => {
        var cert = validation.diagnosticData.Certificate.find(cert => cert.Id === sig[1]);
        sig.who = cert.GivenName + ' ' + cert.Surname;
    });
    return signatures;
}

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

                    <p>Signed by :  { getSignature(validation) }</p>

                    <lu>
                        Signed by : { getSignatures(validation).map(sig => <li>{sig.who + ' on ' +sig[0]}</li> ) }
                   </lu>


                    <a href="#" onClick={() => saveAs(new Blob([validation.report], {type: "application/json;charset=utf-8"}), "report.json")}>Download report</a>
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
