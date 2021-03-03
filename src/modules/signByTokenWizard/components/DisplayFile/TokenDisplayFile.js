import React from 'react'
import { connect } from 'react-redux'
import {DisplayFile} from "../../../fileUpload/components/DisplayFile/DisplayFile";

const url = (window && window.configData) ? window.configData.BEurl : ""

export const mapStateToProps = (state) => {
    if(state.tokenFile.token){
        return {
            uploadFile: {
                displayFile : {
                    url :  `${url}/signing/getDocumentForToken?token=${state.tokenFile.token}`,
                    displayUrl :  `${url}/signing/getDocumentForToken?token=${state.tokenFile.token}`,
                    isPdf : true
                }
            }

        }
    }
    return {

    }
}

export default connect(mapStateToProps)(DisplayFile)