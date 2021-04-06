import React from 'react'
import { CardLoading } from '../../components/Card/CardLoading'
import { connect } from 'react-redux'
import { getCertificates } from "../actions/WizardLogicActions"
import { resetWizard } from '../actions/WizardLogicActions'
import {defineMessages, injectIntl} from "react-intl";
import {definedMessages} from "../../i18n/translations";

const messages = defineMessages({
    title: {
        id: "retrieve.certificates.title",
        defaultMessage: "Retrieving certificates"
    }
})

export class CertificatesLoadingContainer extends React.Component {

    componentDidMount() {
        this.props.getCertificates()
    }

    render() {
        const { resetWizard, intl } = this.props
        return (
                <CardLoading title={intl.formatMessage(messages.title)}
                    hasCancelButton
                    cancelButtonText={intl.formatMessage(definedMessages.cancel)}
                    onClickCancel={() => { resetWizard() }}
                />
        )
    }
}

const mapDispatchToProps = ({
    getCertificates,
     resetWizard
})

export default connect(null, mapDispatchToProps)(injectIntl(CertificatesLoadingContainer))