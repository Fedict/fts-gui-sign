import React from 'react'
import { connect } from 'react-redux'
import {DisplayFile} from "../../../fileUpload/components/DisplayFile/DisplayFile";
import {getBEUrl} from "../../../utils/helper";

const url = getBEUrl();

export const mapStateToProps = (state) => {
    if(state.tokenFile.token){
        return {
            uploadFile: {
                displayFile : {
                    url :  `${url}/signing/getDocumentForToken?token=${state.tokenFile.token}`,
                    displayUrl :  `${url}/signing/getDocumentForToken?token=${state.tokenFile.token}`,
                    isPdf : state.tokenFile.isPdf,
                    isXml : state.tokenFile.isXml,
                    xsltUrl : state.tokenFile.xsltUrl,
                    fileName : state.tokenFile.fileName
                }
            }

        }
    }
    return {

    }
}

export default connect(mapStateToProps)(DisplayFile)