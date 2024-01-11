import React from 'react'
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from "react-intl";
import { INVISIBLE_SIGNATURE, MANUAL_SIGNATURE, selectSignature, includePhoto } from "../fileUpload/reducers/CustomSignatureReducer";

const disbledTextColor = { color: "#CFCFCF"};
const disabledBGColor = { backgroundColor: "#CFCFCF"};

const PDFSignatureSelection = (props) => {
    return (
        <ol className="invisibleOL" style={{ borderTopStyle: "solid", borderWidth: "thin", borderColor: "rgba(0, 0, 0, 0.125)", margin: "15px -20px -20px", backgroundColor: "rgba(0, 0, 0, 0.03)"}}>
            <div className="card-body" style={{ paddingLeft: "60px" }}>
                <li><div className="row mb-4"><div className="col col-1"><span className="badge badge-primary p-1">1</span></div><div className="col col-11"><b>
                    <FormattedMessage id="signing.upload.no.signature" defaultMessage="Choose the place where you want to put your signature by drawing a rectangle at the desired location with your mouse." />
                </b></div></div></li>
                <li><div className="row mb-4"><div className="col col-1">
                    <span className="badge p-1 badge-primary" style={ props.signatureArea === null && props.signatureFields.length === 0 ? disabledBGColor : {} }>2</span></div><div className="col col-11">
                    <b style={ props.signatureArea === null && props.signatureFields.length === 0 ? disbledTextColor : {} }><FormattedMessage id="signing.upload.select.signature" defaultMessage="Confirm the display of your signature in this document:"/></b><br/>
                    <input className="mt-3" type="radio" id="sig_man" key="manualSignature" checked={props.signatureSelected === MANUAL_SIGNATURE}
                            disabled={props.signatureArea === null} onChange={ () => {props.selectSignature(MANUAL_SIGNATURE)} }
                            name="sigSel"/>&nbsp;<label htmlFor="sig_man"><FormattedMessage id="signing.upload.manual.signature" defaultMessage="Display in manually drawn signature field"/></label><br/>
                            { props.signatureFields && props.signatureFields.map((sigField, index) => (
                                <div key={index} >
                                    <input type="radio" id={ "sig_"+index } checked={props.signatureSelected === sigField} onChange={ () => {props.selectSignature(sigField)} } name="sigSel"/>
                                    &nbsp;<label htmlFor={ "sig_"+index }><FormattedMessage id="signing.upload.existing.signature" defaultMessage="Display in existing signature field ''{sigField}''" values={{ sigField: sigField }} /></label><br/>
                                </div>
                            ))}
                    <input type="radio" id="sig_inv" key="invisible" checked={ props.signatureSelected === INVISIBLE_SIGNATURE } onChange={ () => {props.selectSignature(INVISIBLE_SIGNATURE)} } name="sigSel"/>
                        &nbsp;<label htmlFor="sig_inv"><FormattedMessage id="signing.upload.visible.signature" defaultMessage="No display (signature without illustration)" /></label>
                </div></div></li>
                <li><div className="row mb-4" style={ props.signatureSelected === INVISIBLE_SIGNATURE ? disbledTextColor : {} }>
                    <div className="col col-1"><span className="badge p-1 badge-primary" style={ props.signatureSelected === INVISIBLE_SIGNATURE ? disabledBGColor : {} }>3</span></div>
                    <div className="col col-11">
                        <b><FormattedMessage id="signing.upload.photo.signature" defaultMessage="The photo from your eID card can be added to your signature." /></b><p style={{ height: "10px" }}>
                        <input className="mt-3" type="checkbox" id="photo" checked={props.photoIncluded && props.signatureSelected !== INVISIBLE_SIGNATURE}
                            onChange={ () => { props.includePhoto(!props.photoIncluded) } } disabled={ props.signatureSelected === INVISIBLE_SIGNATURE } style={{ display: "inline-grid "}}/>&nbsp;
                        <label style={{ position: "absolute", marginTop: "11px" }} htmlFor="photo"><FormattedMessage id="signing.upload.photo.choice" defaultMessage="Add photo from eID card" /></label></p>
                    </div>
                </div></li>
            </div>
        </ol>
    )
}

const mapStateToProps = (state) => {
    return (state) => ({
        signatureFields: state.customSignatures.signatureFields,
        signatureArea: state.customSignatures.signatureArea,
        signatureSelected: state.customSignatures.signatureSelected,
        photoIncluded: state.customSignatures.photoIncluded
    })
}

const mapDispatchToProps = ({
    selectSignature,
    includePhoto
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(PDFSignatureSelection))
