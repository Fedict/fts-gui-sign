import { connect } from 'react-redux'
import {DisplayFile} from "../../../fileUpload/components/DisplayFile/DisplayFile";
import {getBEUrl} from "../../../utils/helper";

const url = getBEUrl();

export const mapStateToProps = (state, index) => {
    if(state.tokenFile.token){
        var id = index.index;
        var input = state.tokenFile.inputs[id];
        var baseUrl = url + '/signing/getFileForToken/' + state.tokenFile.token;
        var fileNameExt = input.fileName.split(".").pop().toLowerCase();
        return {
            uploadFile: {
                displayFile : {
                    url :  baseUrl + '/DOC/' + id,
                    displayUrl :  baseUrl + '/DOC/' + id,
                    isPdf : fileNameExt === "pdf",
                    isXml : fileNameExt === "xml",
                    xsltUrl : input.displayXslt ? baseUrl + '/XSLT/' + id : null,
                    fileName : input.fileName
                }
            }

        }
    }
    return {
   }
}

export default connect(mapStateToProps)(DisplayFile)