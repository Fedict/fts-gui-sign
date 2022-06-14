import React from 'react'
import { connect } from 'react-redux';
import { CardContainer } from '../../components/Card/CardContainer';
import { resetWizard } from '../actions/WizardLogicActions';
import { MessageContainer } from '../../message/MessageContainer';
import { ErrorGeneral } from '../../message/MessageConstants';
import {defineMessages, FormattedMessage, injectIntl} from "react-intl";
import { saveAs } from 'file-saver';
import moment from "moment";

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

function getSignatures(validation) {
    if (!validation.diagnosticData) return null

    var signatures = validation.diagnosticData.Signature.map(sig => (
        {
            date: sig.ClaimedSigningTime,
            certId: sig.ChainItem[0].Certificate,
            isValid: sig.BasicSignature.SignatureValid
        }) );
    
    if (!signatures || signatures.size === 0) return null;

    var xmlDoc = new DOMParser().parseFromString(validation.report,"text/xml");
    var certQuals = xmlDoc.getElementsByTagNameNS("http://dss.esig.europa.eu/validation/detailed-report", "ValidationCertificateQualification")

    signatures.forEach(sig => {
        var cert = validation.diagnosticData.Certificate.find(cert => cert.Id === sig.certId);
        if (!cert) return null;

        sig.signer =  cert.GivenName + ' ' + cert.Surname;

        var qualification = "" 
        if (certQuals) {
            for (var certQual of certQuals) {
                if (certQual.parentElement && certQual.getAttribute('Id') === sig.certId) {
                    qualification = certQual.parentElement.getAttribute('SignatureQualification')
                    break;
                }
            }
        }
        
        sig.isQualified = cert && cert.KeyUsage && qualification === 'QESig' && cert.KeyUsage.includes('nonRepudiation')
        sig.class = "alert-" + (sig.isValid ? (sig.isQualified ? "success" : "warning") : "danger")
    });
    return signatures;
}

export class ResultContainer extends React.Component {

    render() {
        const { validation, resetWizard, intl } = this.props
        
        let signatures = getSignatures(validation);
        if (!signatures) {
            return <MessageContainer message={ErrorGeneral} onCancel={() => { resetWizard() }} />
        }

        return (<CardContainer
                    title={intl.formatMessage(messages.title)}
                    hasNextButton
                    nextButtonText={intl.formatMessage(messages.next)}
                    onClickNext={() => { resetWizard() }}
                    leftButtonText={ <FormattedMessage id="report.download.link" defaultMessage="Download full report"/> }
                    onClickLeft={() => saveAs(new Blob([validation.report], {type: "application/xml;charset=utf-8"}), "report.xml")}
                >
                    <div className="text-center">
                        <div className="container">
                            <div className="row">
                                <div className="col"><b>Who</b></div>
                                <div className="col"><b>When</b></div>
                                <div className="col"><b>Valid</b></div>
                                <div className="col"><b>Qualified</b></div>
                            </div><br/>
                            { signatures.map(sig => <div className={ "row alert " + sig.class }>
                                <div className="col">{sig.signer}</div>
                                <div className="col">{moment(sig.date).format('DD/MM/YYYY - h:mm:ss')}</div>
                                <div className="col">{sig.isValid ? 'Yes' : 'No'}</div>
                                <div className="col">{sig.isQualified ? 'Yes' : 'No'}</div>
                            </div> )}
                        </div>
                    </div>
                </CardContainer>
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
