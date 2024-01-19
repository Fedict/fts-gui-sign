import React from 'react'
import { connect } from 'react-redux'
import {FormattedMessage} from 'react-intl';

import {getBEUrl} from "../../../utils/helper";
import {setPreviewFileId, setInputsSignState, setCustomSignature, SET_ALL_INPUTS} from "../../actions/TokenActions";
import {signState} from "../../constants";
import { setSignAttributes } from '../../../../modules/fileUpload/reducers/CustomSignatureReducer';
import {doSendLogInfo} from "../../../signWizard/actions/WizardLogicActions";


/**
 * Component to display list of filenames 
 * @param {array} list  
 * @param {string} list.fileName - name of the file
 * @param {string} list.iconType - identifier for an icon representing file type (PDF or XML)
 * @param {string} list.url - url to initiate a download of the file
 * @param {array} previewDocuments - display mode : if true display selectable icon list, else display list of downloadble urls
 * @param {array} selectedInputId - the curently selected icon
 */
export const TokenDisplayFileList = ({ tokenFile, selectedInputId, customSignature, setPreviewFileId, setCustomSignature, setSignAttributes, setInputsSignState, doSendLogInfo }) => {

    const inputs = tokenFile.inputs.map((input, index) => {
        var iconType = "UNK"
        if (input.mimeType === "application/pdf") iconType = "PDF"
        else if (input.mimeType === "application/xml") iconType = "XML"
        return { ...input, iconType, url: getBEUrl() + '/signing/getFileForToken/' + tokenFile.token + "/DOC/" + index, cleanFileName: input.fileName.replace(/\.[^.]*$/, '') };
    });

    if (tokenFile.previewDocuments) {
        const allNone = inputs.find((input) => (input.signState === signState.DONT_SIGN)) ?
                { set: signState.SIGN_REQUESTED, id: "all", txt: "SELECT ALL" } :
                { set: signState.DONT_SIGN, id: "none", txt: "UNSELECT ALL" }
        return (
        <div className="col-md-auto text-center">
            { tokenFile.selectDocuments && 
                <a href="#" onClick={ () => setInputsSignState(SET_ALL_INPUTS, allNone.set) }><b><FormattedMessage id = { "token.documents.select." + allNone.id } defaultMessage={ allNone.txt }/></b></a> }
            {( inputs.map((input, index) => ( 
                <div className="m-2 p-2 text-break" key={index} onClick={() => { 
                    setCustomSignature(selectedInputId, customSignature); setPreviewFileId(index);  setSignAttributes(inputs[index].customSignature);
                 } }
                       style={ selectedInputId !== index ?  { width: 110 } : 
                         { width: 110, backgroundColor: "grey", borderRadius: "3px", border: "1px solid" }}>
                    <div style={{ paddingTop: -20, border: "solid 1px lightgrey", height:70, backgroundColor: "white", position: "relative" }}>
                    { tokenFile.selectDocuments &&
                        <input type="checkbox" className="form-check-input" style={{ width: 15, height: 15, marginTop: "0.5rem", marginLeft: "0.5rem" }} 
                            disabled={!(input.signState === signState.DONT_SIGN || input.signState === signState.SIGN_REQUESTED)} checked={input.signState !== signState.DONT_SIGN}
                            onChange={ () => { setInputsSignState(index, input.signState === signState.SIGN_REQUESTED ? signState.DONT_SIGN : signState.SIGN_REQUESTED)
                                doSendLogInfo('UI - CHECK FILE : ' + input.fileName + " : " + (input.signState === signState.DONT_SIGN))
                            }}/>
                    }
                        <img src={"/img/Icon" + input.iconType + ".png"} style={{ position: "absolute", margin: "auto", left: 0, right: 0, bottom: 8 }} alt={input.iconType}></img>
                    </div>
                    {input.cleanFileName}
                </div>
            )))}
        </div>);
    }

    return (
    <div className="col">
        <p><b><FormattedMessage id = "token.documents.list" defaultMessage="DOCUMENTS TO SIGN"/></b></p>
        {(inputs.map((input, index) => ( 
            <div className="m-2 p-2" key={index} style={{ border:  selectedInputId === index ?  "3px solid blue" : "1px solid lightGrey", backgroundColor: "whiteSmoke", maxWidth: "100%" }}>
                <div className="row">
                    <div className="col">
                    { tokenFile.selectDocuments &&
                        <input type="checkbox" className="form-check-input" style={{ width: 15, height: 15, margin: 9, position: "absolute" }}
                            disabled={ true } checked={input.signState !== signState.DONT_SIGN}
                            />
                    }
                        <img  className="p-2" src={"/img/Icon" + input.iconType + ".png"} alt={input.iconType} style={{ marginTop: "-3px", marginLeft: "27px" }} ></img>
                        <a href={ input.url + "?forceDownload" } download>{input.cleanFileName}</a>
                    </div>
                    { input.signState === signState.SIGNED && (<div className="col-md-auto py-1">
                        <div className="px-3" style={{ width: "auto", maxWidth: "100%", borderRadius: "20px", backgroundColor: "#01c301" }}>
                            <img className="mb-1 mr-1" style={{ width: "12px", height:"12px" }} src="/img/check.png"/>
                            <FormattedMessage id = "succes.title.short" defaultMessage="Signed" />
                        </div>
                    </div>
                    )}
                    { (input.signState === signState.ERROR_DIGEST || input.signState === signState.ERROR_SIGN) && (<div className="col-md-auto py-1">
                        <div className="px-3" style={{ width: "auto", maxWidth: "100%", borderRadius: "20px", backgroundColor: "#FF0000" }}>
                            <img className="mb-1 mr-1" style={{ width: "12px", height:"12px" }} src="/img/cross.png"/>
                            <FormattedMessage id = "error.title.short" defaultMessage="Error" />
                        </div>
                    </div>
                    )}
                    { (input.signState === signState.SKIPPED) && (<div className="col-md-auto py-1">
                        <div className="px-3" style={{ width: "auto", maxWidth: "100%", borderRadius: "20px", backgroundColor: "#0e8297", color: "white" }}>
                            <FormattedMessage id = "error.title.skipped" defaultMessage="Skipped" />
                        </div>
                    </div>
                    )}
                </div>
            </div>
        )))}
    </div>);
}

export const mapStateToProps = (state) => {
    return {
        selectedInputId : state.filePreview.index,
        tokenFile: state.tokenFile,
        customSignature: state.customSignature
    }
}

const mapDispatchToProps = ({
    setPreviewFileId,
    setInputsSignState,
    doSendLogInfo,
    setCustomSignature,
    setSignAttributes
})

export default connect(mapStateToProps,mapDispatchToProps)(TokenDisplayFileList)