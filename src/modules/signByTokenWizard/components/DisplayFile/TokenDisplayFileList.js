import React from 'react'
import { connect } from 'react-redux'
import {FormattedMessage} from 'react-intl';

import {getBEUrl} from "../../../utils/helper";
import {setPreviewFileId, switchInputSelection} from "../../actions/TokenActions";

/**
 * Component to display list of filenames 
 * @param {array} list  
 * @param {string} list.fileName - name of the file
 * @param {string} list.iconType - identifier for an icon representing file type (PDF or XML)
 * @param {string} list.url - url to initiate a download of the file
 * @param {array} previewDocuments - display mode : if true display selectable icon list, else display list of downloadble urls
 * @param {array} previewFileId - the curently selected icon
 */
export const TokenDisplayFileList = ({ tokenFile, previewFileId, setPreviewFileId, switchInputSelection }) => {
    if (tokenFile.previewDocuments) {
        const hilightBorderStyle = {
            backgroundColor: "grey",
            borderRadius: "3px",
            border: "1px solid"
        };
    
        return (
        <div className="col-md-auto">
            {(tokenFile.inputs.map((input, index) => ( 
                <div className="text-center m-2 p-2" style={ previewFileId !== index ?  null :  hilightBorderStyle} key={index} onClick={() => setPreviewFileId(index)}>
                    <div style={{ paddingTop: -20, border: "solid 1px lightgrey", width: 100, height:70, backgroundColor: "white", position: "relative" }}>
                    <input type="checkbox" className="form-check-input" style={{ width: 15, height: 15, marignTop: "0.3rem", marginLeft: "-2.5rem" }}  checked={input.isSelected} onChange={ () => { switchInputSelection(index, !input.isSelected) }}/>
                        <img src={"/img/Icon" + input.iconType + ".png"} style={{ position: "absolute", margin: "auto", left: 0, right: 0, bottom: 8 }} alt={input.iconType}></img>
                    </div>
                    {input.fileName.replace(/\.[^.]*$/, '')}
                </div>
            )))}
        </div>);
    }

    return (
    <div className="col">
        <p><b><FormattedMessage id = "token.documents.list" defaultMessage="DOCUMENTS TO SIGN"/></b></p>
        {(tokenFile.inputs.map((input, index) => ( 
            <div className="m-2 p-2" key={index} style={{ border: "1px solid lightGrey", backgroundColor: "whiteSmoke", maxWidth: "100%" }}>
                <div className="row">
                    <div className="col">
                        <input type="checkbox" className="form-check-input" style={{ width: 15, height: 15, margin: 9, position: "relative" }} checked={input.isSelected} onChange={ () => { switchInputSelection(index, !input.isSelected) }}/>
                        <img  className="p-2" src={"/img/Icon" + input.iconType + ".png"} alt={input.iconType} style={{ marginTop: -7 }} ></img>
                        <a href={ input.url + "?forceDownload" } download>{input.fileName.replace(/\.[^.]*$/, '')}</a>
                    </div>
                    { input.isSigned && (<div className="col-md-auto py-1">
                        <div className="px-3" style={{ width: "auto", maxWidth: "100%", borderRadius: "20px", backgroundColor: "#01c301" }}>
                            <img className="mb-1 mr-1" style={{ width: "12px", height:"12px" }} src="/img/check.png" alt="PDF"/>
                            <FormattedMessage id = "succes.title.short" defaultMessage="Signed" />
                        </div>
                    </div>
                    )}
                </div>
            </div>
        )))}
    </div>);
}

export const mapStateToProps = (state) => {
    state.tokenFile.inputs.forEach((input, index) => {
        var iconType = "UNK";
        if (input.mimeType === "application/pdf") iconType = "PDF";
        else if (input.mimeType === "application/xml") iconType = "XML";
        input.iconType = iconType;
        input.url = getBEUrl() + '/signing/getFileForToken/' + state.tokenFile.token + "/DOC/" + index
     });
    
    return {
        previewFileId : state.filePreview.index,
        tokenFile: state.tokenFile
    }
}

const mapDispatchToProps = ({
    setPreviewFileId,
    switchInputSelection
})

export default connect(mapStateToProps,mapDispatchToProps)(TokenDisplayFileList)