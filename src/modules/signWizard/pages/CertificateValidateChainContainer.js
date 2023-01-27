import React from 'react'
import { CardLoading } from '../../components/Card/CardLoading'
import { connect } from 'react-redux'
import { validateCertificateChain, resetWizard } from "../actions/WizardLogicActions"
import {defineMessages, FormattedMessage, injectIntl} from "react-intl";
import {definedMessages} from "../../i18n/translations";

export const messages = defineMessages({
    title: {
        id: "certificate.validate.title",
        defaultMessage: "Validating certificates"
    }
})

export class CertificateValidateChainContainer extends React.Component {
    componentDidMount() {
        this.props.validateCertificateChain()
    }

    render() {
        const { resetWizard, intl } = this.props
        return (
                <CardLoading title={intl.formatMessage(messages.title)}
                    hasCancelButton
                    cancelButtonText={intl.formatMessage(definedMessages.cancel)}
                    onClickCancel={() => { resetWizard() }}
                >
                    <FormattedMessage id="validate.certificate.info" defaultMessage="The certificate is being validated, this operation can take some time." tagName="p"/>
                </CardLoading>
        )
    }
}

const mapDispatchToProps = ({
    validateCertificateChain,
     resetWizard
})

export default connect(null, mapDispatchToProps)(injectIntl(CertificateValidateChainContainer))