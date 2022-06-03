import React from 'react'
import { connect } from 'react-redux'
import {DisplayFile} from "../../../fileUpload/components/DisplayFile/DisplayFile";
import {getBEUrl} from "../../../utils/helper";

export const mapStateToProps = (state, index) => {
    if(state.tokenFile.token){
        var id = index.index;
        var input = state.tokenFile.inputs[id];
        var baseUrl = getBEUrl() + '/signing/getFileForToken/' + state.tokenFile.token;
        return {
            uploadFile: {
                displayFile : {
                    url :  baseUrl + '/DOC/' + id,
                    isPdf : input.mimeType === "application/pdf",
                    isXml : input.mimeType === "application/xml",
                    xsltUrl : input.hasDisplayXslt ? baseUrl + '/XSLT/' + id : null,
                    fileName : input.fileName
                }
            }

        }
    }
    return {
   }
}

export default connect(mapStateToProps)(DisplayFile)