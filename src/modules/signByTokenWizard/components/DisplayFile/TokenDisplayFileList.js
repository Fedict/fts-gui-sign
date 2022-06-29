import React from 'react'
import { connect } from 'react-redux'
import {FormattedMessage} from 'react-intl';

import {getBEUrl} from "../../../utils/helper";
import {setPreviewFileId} from "../../actions/TokenActions";

/**
 * Component to display list of filenames 
 * @param {array} list  
 * @param {string} list.fileName - name of the file
 * @param {string} list.iconType - identifier for an icon representing file type (PDF or XML)
 * @param {string} list.url - url to initiate a download of the file
 * @param {array} previewDocuments - display mode : if true display selectable icon list, else display list of downloadble urls
 * @param {array} previewFileId - the curently selected icon
 */
export const TokenDisplayFileList = ({ list, previewDocuments, previewFileId, filesAreSigned, setPreviewFileId }) => {
    if (previewDocuments) {
        const hilightBorderStyle = {
            backgroundColor: "grey",
            borderRadius: "3px",
            border: "1px solid"
        };
    
        return (
        <div className="col-md-auto">
            {(list.map((item, index) => ( 
                <div className="text-center m-2 p-2" style={ previewFileId !== index ?  null :  hilightBorderStyle} key={index} onClick={() => setPreviewFileId(index)}>
                    <div style={{ paddingTop: -20, border: "solid 1px lightgrey", width: 100, height:70, backgroundColor: "white", position: "relative" }}>
                        <img src={"/img/Icon" + item.iconType + ".png"} style={{ position: "absolute", margin: "auto", left: 0, right: 0, bottom: 8 }} alt={item.iconType}></img>
                    </div>
                    {item.fileName.replace(/\.[^.]*$/, '')}
                </div>
            )))}
        </div>);
    }

    return (
    <div className="col">
        <p><b><FormattedMessage id = "token.documents.list" defaultMessage="DOCUMENTS TO SIGN"/></b></p>
        {(list.map((item, index) => ( 
            <div className="m-2 p-2" key={index} style={{ border: "1px solid lightGrey", backgroundColor: "whiteSmoke", maxWidth: "100%" }}>
                <div className="row">
                    <div className="col">
                        <img  className="p-2" src={"/img/Icon" + item.iconType + ".png"} alt={item.iconType}></img>
                        <a href={ item.url + "?forceDownload" } download>{item.fileName.replace(/\.[^.]*$/, '')}</a>
                    </div>
                    { filesAreSigned && (<div className="col-md-auto py-1">
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
    var list = [];
    state.tokenFile.inputs.forEach((item, index) => {
        var iconType = "UNK";
        if (item.mimeType === "application/pdf") iconType = "PDF";
        else if (item.mimeType === "application/xml") iconType = "XML";
        list.push({
            iconType: iconType,
            fileName: item.fileName,
            url: getBEUrl() + '/signing/getFileForToken/' + state.tokenFile.token + "/DOC/" + index
     })
    });

    
    return {
        list : list,
        previewFileId : state.filePreview.index,
        previewDocuments : state.tokenFile.previewDocuments
    }
}

const mapDispatchToProps = ({
    setPreviewFileId
})

export default connect(mapStateToProps,mapDispatchToProps)(TokenDisplayFileList)