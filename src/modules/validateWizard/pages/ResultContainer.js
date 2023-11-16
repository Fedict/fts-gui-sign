import React, { useState, useEffect, useRef } from 'react'
import {defineMessages, FormattedMessage, injectIntl} from "react-intl";
import { connect } from 'react-redux';
import { CardContainer } from '../../components/Card/CardContainer';
import { resetWizard } from '../actions/WizardLogicActions';
import { subIndication } from '../constants/indicationConstants';
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

const no = <FormattedMessage id="no" defaultMessage="No"/>
const yes = <FormattedMessage id="yes" defaultMessage="Yes"/>

export const ResultContainer = (props) => {
    const { intl, normalizedReport, report } = props;
    const [showPkcs7Info, setShowPkcs7Info] = useState(false);

    return (<CardContainer
                title={intl.formatMessage(messages.title)}
                hasNextButton
                nextButtonText={intl.formatMessage(messages.next)}
                onClickNext={() => { resetWizard() }}
                predButtonText={ <FormattedMessage id="report.download.link" defaultMessage="Download full report"/> }
                onClickPred={() => saveAs(new Blob([report], {type: "application/xml;charset=utf-8"}), "report.xml")}
            >
            { normalizedReport.signatures.length !== 0 ? <div className="container text-center">
                <div className="row validateResult py-0 mt-0">
                        <div className="col px-0"><b><FormattedMessage id="validation.signer.name" defaultMessage="Signer"/></b></div>
                        <div className="col-4 px-0"><b><FormattedMessage id="validation.sign.moment" defaultMessage="Date"/></b></div>
                        <div className="col-2 px-0"><b><FormattedMessage id="validation.sign.valid" defaultMessage="Valid"/></b></div>
                        <div className="col-2 px-0 text-nowrap"><b><FormattedMessage id="validation.sign.qualif" defaultMessage="Qualified"/></b></div>
                        <div className="col-2 px-0 text-nowrap"><b><FormattedMessage id="validation.sign.format" defaultMessage="EU Format"/></b>
                            <img title={intl.formatMessage({ id: "more.info", defaultMessage: "More Info" })} style={{ width:16, height:16, marginBottom: 3, marginLeft: 4 }} src="/img/questionMark.svg" onClick={() => setShowPkcs7Info(!showPkcs7Info)}/>
                                    { showPkcs7Info && <div className="text-wrap" style={{ textAlign: "left", marginLeft: "-170px", width: "400px", backgroundColor: "#a6a6d1", position: "absolute" , zIndex: 1 }}>
                                        <FormattedMessage id="validation.sign.pkcs7.info" defaultMessage="This signature validation is based on the applicable European standards. See {LINK}.{br}Other signature formats and validations are available on the market (for example PCKS7 in Adobe Reader).{br}Please check which validation standard matches your validation request."
                                            values={{ br: <br/>, LINK: (<a href={intl.formatMessage({ id: "validation.sign.pkcs7.link", defaultMessage: "https://link.com"})}>
                                            <FormattedMessage id="validation.sign.pkcs7.linkText" defaultMessage="LINK" /></a>) }}
                                        />
                                        <div onClick={() => setShowPkcs7Info(false)} style={{ position: "fixed", padding: 0, margin: 0, top: 0, left: 0, width: "100%", height: "100%" , zIndex: -1 }}/>
                                    </div>}
                        </div>
                    </div>
                    { normalizedReport.signatures.map((sig,index) => <div key={index} className={ "row validateResult " + ("light-" + (sig.missingSigningCert ? "pkcs7" : (sig.valid ? (sig.qualified ? "success" : "warning") : "danger"))) }>
                        <div className="col px-0">{sig.signerCommonName}</div>
                        <div className="col-4 px-0">{moment(sig.claimedSigningTime).format('DD/MM/YYYY - HH:mm:ss')}</div>
                        <div className="col-2 px-0"> {
                            sig.missingSigningCert ? <strong>? *</strong> : <>
                                {sig.valid ? yes : no}
                                {sig.subIndication && <img title={intl.formatMessage({ id: subIndication[sig.subIndication].id, defaultMessage: subIndication[sig.subIndication].message })} style={{ width:16, height:16, marginBottom: 3, marginLeft: 4 }} src="/img/questionMark.svg"/> }
                            </>
                        } </div>
                        <div className="col-2 px-0">{sig.qualified ? yes : no }</div>
                        <div className="col-2 px-0"> { sig.valid ? (sig.signatureFormat.startsWith("PKCS7") ? no : yes) : "" } </div>
                    </div> )}
                    { normalizedReport.signatures.find(sig => sig.missingSigningCert) && <>
                    <p class="text-justify"><strong>* </strong><FormattedMessage id='validate.result.note.adobeSigned.1' defaultMessage="Sign.belgium can't validate the signature based on the available information." /></p>
                    <p class="text-justify"><FormattedMessage id='validate.result.note.adobeSigned.2' defaultMessage="Sign.belgium signature validation is based on the applicable European standards. If Adobe Reader was used to sign this document, it is possible to change the signature format to this European standard." /></p>
                    <p class="text-justify"><a href="/pkcs7"><FormattedMessage id='validate.result.note.adobeSigned.link' defaultMessage="Manual: how to adjust the signature setting in Adobe Reader." /></a></p>
                    </>
                    }
                </div> : <div className="text-center">
                    <div className="alert alert-warning" role="alert">
                        <FormattedMessage id='validate.result.messages.noSignature' defaultMessage="No signature could be found in the document." />
                    </div>
                </div> }
                </CardContainer>
        )
}

const mapStateToProps = (state) => {
    return (state) => ({
        normalizedReport: state.validation.normalizedReport,
        report: state.validation.report
    })
}

const mapDispatchToProps = ({
    resetWizard
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ResultContainer))
