import React from 'react'
import { CardLoading } from '../../components/Card/CardLoading'
import { connect } from 'react-redux'
import { validateCertificates, resetWizard } from "../actions/WizardLogicActions"
import {FormattedMessage, injectIntl} from "react-intl";
import {messages} from "./CertificateValidateChainContainer";
import {definedMessages} from "../../i18n/translations";

export class ValidateLoadingContainer extends React.Component {
    componentDidMount() {
        this.props.validateCertificates()
    }

    render() {

        const { resetWizard, intl } = this.props
        return (
           
                <CardLoading title={intl.formatMessage(messages.title)}
                    hasCancelButton
                    cancelButtonText={intl.formatMessage(definedMessages.cancel)}
                    onClickCancel={() => { resetWizard() }}
                >
                    <FormattedMessage id="validate.certificate.info" defaultMessage="The certificate is being validated, this operation can take some time."/>
                </CardLoading>
          
        )
    }
}

const mapDispatchToProps = ({
    validateCertificates,
     resetWizard
})

export default connect(null, mapDispatchToProps)(injectIntl(ValidateLoadingContainer))