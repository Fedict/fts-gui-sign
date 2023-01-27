import React from 'react'
import { connect } from 'react-redux';
import { CardContainer } from '../../components/Card/CardContainer';
import { resetWizard } from '../actions/WizardLogicActions';
import { indication, subIndication } from '../constants/indicationConstants';
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
        defaultMessage: "Check another document"
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
    
    if (!signatures || signatures.length === 0) return null;

    let xmlDoc = new DOMParser().parseFromString(validation.report,"text/xml");
    let conclusions = xmlDoc.getElementsByTagNameNS(NS, "Conclusion")
    var signQuals = xmlDoc.getElementsByTagNameNS(NS, "ValidationSignatureQualification")

    signatures.forEach(sig => {
        let cert = validation.diagnosticData.Certificate.find(cert => cert.Id === sig.certId);
        if (!cert) return null;
        sig.signer = cert.CommonName

        if (conclusions) {
            for(let conclusion of conclusions) {
                var xmlSignature = conclusion.parentElement
                if (xmlSignature.localName === "Signature" && xmlSignature.attributes['Id'].value === sig.id) {
                    for (let indication of conclusion.children) {
                        switch(indication.localName) {
                            case 'Indication':
                                sig.isValid = indication.textContent === 'TOTAL_PASSED'
                                break;
                            case 'SubIndication':
                                sig.subIndication = subIndication[indication.textContent]
                                break;
                        }
                    }
                    break
                }
            }
        }

        var qualification = "" 
        if (signQuals) {
            for (var signQual of signQuals) {
                if (signQual.parentElement && signQual.parentElement.getAttribute('Id') === sig.id) {
                    qualification = signQual.getAttribute('SignatureQualification')
                    break;
                }
            }
        }
        
        sig.isQualified = cert && cert.KeyUsage && qualification === 'QESig' && cert.KeyUsage.includes('nonRepudiation')
        sig.class = "light-" + (sig.isValid ? (sig.isQualified ? "success" : "warning") : "danger")
    });
    return signatures;
}

export class ResultContainer extends React.Component {

    render() {
        const { validation, resetWizard, intl } = this.props

        let no = <FormattedMessage id="no" defaultMessage="No"/>
        let yes = <FormattedMessage id="yes" defaultMessage="Yes"/>
        
        let signatures = getSignatures(validation);

        return (<CardContainer
                    title={intl.formatMessage(messages.title)}
                    hasNextButton
                    nextButtonText={intl.formatMessage(messages.next)}
                    onClickNext={() => { resetWizard() }}
                    leftButtonText={ <FormattedMessage id="report.download.link" defaultMessage="Download full report"/> }
                    onClickLeft={() => saveAs(new Blob([validation.report], {type: "application/xml;charset=utf-8"}), "report.xml")}
                >
                { signatures ? <div className="container text-center">
                    <div className="row validateResult py-0 mt-0">
                            <div className="col px-0"><b><FormattedMessage id="validation.signer.name" defaultMessage="Signer"/></b></div>
                            <div className="col-4 px-0"><b><FormattedMessage id="validation.sign.moment" defaultMessage="Date"/></b></div>
                            <div className="col-2 px-0"><b><FormattedMessage id="validation.sign.valid" defaultMessage="Valid"/></b></div>
                            <div className="col-2 px-0 text-nowrap"><b><FormattedMessage id="validation.sign.qualif" defaultMessage="Qualified"/></b></div>
                        </div>
                        { signatures.map((sig,index) => <div key={index} className={ "row validateResult " + sig.class }>
                            <div className="col px-0">{sig.signer}</div>
                            <div className="col-4 px-0">{moment(sig.date).format('DD/MM/YYYY - h:mm:ss')}</div>
                            <div className="col-2 px-0">{sig.isValid ? yes : no}
                                { sig.subIndication && <img title={intl.formatMessage({ id: sig.subIndication.id, defaultMessage: sig.subIndication.message })} style={{ width:16, height:16, marginBottom: 3, marginLeft: 4 }} src="/img/questionMark.svg"/> }
                             </div>
                            <div className="col-2 px-0">{sig.isQualified ? yes : no }</div>
                        </div> )}
                    </div> : <div className="text-center">
                        <div className="alert alert-warning">
                            <FormattedMessage id='validate.result.messages.noSignature' defaultMessage="No signature could be found in the document." />
                        </div>
                    </div> }
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
