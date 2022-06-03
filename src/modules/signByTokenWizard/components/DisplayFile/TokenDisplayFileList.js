import { buildQueries } from '@testing-library/dom';
import React, {Fragment} from 'react'
import { connect } from 'react-redux'
import {setPreviewFileId} from "../../actions/TokenActions";
import {getBEUrl} from "../../../utils/helper";

/**
 * Component to display list of filenames 
 * @param {array} list  
 * @param {string} list.fileName - name of the file
 */
export const TokenDisplayFileList = ({ list, previewDocuments, previewFileId, setPreviewFileId }) => {
    if (previewDocuments) {
        const hilightBorderStyle = {
            backgroundColor: "grey",
            borderRadius: "3px",
            border: "1px solid"
        };
    
        return (
        <div className={"col-md-auto"}>
            {(list.map((item, index) => ( 
            <div className={ "text-center m-2 p-2" } style={ previewFileId !== index ?  null :  hilightBorderStyle} key={index} onClick={() => setPreviewFileId(index)}>
                <div style={{ paddingTop: -20, border: "solid 1px lightgrey", width: 100, height:70, backgroundColor: "white", position: "relative" }}>
                    <img src={"/img/" + item.iconType + "Icon.png"} style={{ position: "absolute", margin: "auto", left: 0, right: 0, bottom: 8 }} alt={item.iconType}></img>
                </div>
                {item.fileName.replace(/\.[^\.]*$/, '')}
            </div>
            )))}
        </div>);
    }

    return (
    <div className={"col"}>
        {(list.map((item, index) => ( 
        <div className={ "m-2 p-2"} style={{ border: "1px solid grey", backgroundColor: "lightgray", maxWidth: "100%" }}>
            <img  className={ "p-2" } src={"/img/" + item.iconType + "Icon.png"} alt={item.iconType}></img>
            <a href={ item.url + "?forceDownload" } download>{item.fileName.replace(/\.[^\.]*$/, '')}</a>
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