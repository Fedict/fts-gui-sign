import React from 'react'
import { connect } from 'react-redux';
import { CardContainer } from '../../components/Card/CardContainer';
import { resetWizard } from '../actions/WizardLogicActions';
import { subIndication } from '../constants/indicationConstants';
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


const NS = "http://dss.esig.europa.eu/validation/detailed-report";

function getSignatures(validation) {
    if (!validation.diagnosticData) return null

    var signatures = validation.diagnosticData.Signature.map(sig => (
        {
            id: sig.Id,
            date: sig.ClaimedSigningTime,
            certId: sig.ChainItem[0].Certificate
        }) );
    
    if (!signatures || signatures.size === 0) return null;

    var xmlDoc = new DOMParser().parseFromString(validation.report,"text/xml");
    var certQuals = xmlDoc.getElementsByTagNameNS(NS, "ValidationCertificateQualification")
    var sigValidations = xmlDoc.getElementsByTagNameNS(NS, "ValidationProcessBasicSignature")

    signatures.forEach(sig => {
        var cert = validation.diagnosticData.Certificate.find(cert => cert.Id === sig.certId);
        if (!cert) return null;
        sig.signer = cert.CommonName

        if (sigValidations) {
            for (var sigValidation of sigValidations) {
                var id = sigValidation.parentElement.getAttribute('Id');
                if (id === sig.id) {
                    var conclusions = sigValidation.getElementsByTagNameNS(NS, "Conclusion")
                    if (conclusions && conclusions.length > 0) {
                        var indications = conclusions[0].getElementsByTagNameNS(NS, "Indication")
                        if (indications && indications.length > 0)
                        sig.isValid = indications[0].textContent === 'PASSED'
                        if (!sig.isValid) {
                            sig.subIndication = subIndication[conclusions[0].getElementsByTagNameNS(NS, "SubIndication")[0].textContent]
                        }
                    }
                    break;
                }
            }
        }

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

        let no = <FormattedMessage id="no" defaultMessage="No"/>
        let yes = <FormattedMessage id="yes" defaultMessage="Yes"/>
        
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
                <div className="container text-center">
                    <div className="row alert py-0 mt-0">
                            <div className="col px-0"><b><FormattedMessage id="validation.signer.name" defaultMessage="Signer"/></b></div>
                            <div className="col-4 px-0"><b><FormattedMessage id="validation.sign.moment" defaultMessage="Date"/></b></div>
                            <div className="col-2 px-0"><b><FormattedMessage id="validation.sign.valid" defaultMessage="Valid"/></b></div>
                            <div className="col-2 px-0"><b><FormattedMessage id="validation.sign.qualif" defaultMessage="Qualified"/></b></div>
                        </div>
                        { signatures.map((sig,index) => <div key={index} className={ "row alert " + sig.class }>
                            <div className="col px-0">{sig.signer}</div>
                            <div className="col-4 px-0">{moment(sig.date).format('DD/MM/YYYY - h:mm:ss')}</div>
                            <div className="col-2 px-0">{sig.isValid ? yes : no}
                                { sig.subIndication && <img title={intl.formatMessage({ id: sig.subIndication.id, defaultMessage: sig.subIndication.message })} style={{ width:16, height:16, marginBottom: 3, marginLeft: 4 }} src="/img/questionMark.svg"/> }
                             </div>
                            <div className="col-2 px-0">{sig.isQualified ? yes : no }</div>
                        </div> )}
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
