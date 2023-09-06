import React, {Fragment } from "react"
import {FormattedMessage} from "react-intl";
import XmlDataViewer from "../XmlDataViewer/XmlDataViewer";
import { DisplayPDF } from "./DisplayPDF";

/**
 * Component to display a file (XML or PDF)
 * if no file is present a picture is shown
 * @param {object} props  
 * @param {object} props.uploadFile - upload file object from the redux store 
 * @param {object} props.uploadFile.displayFile - file that is shown 
 * @param {boolean} props.uploadFile.displayFile.isPdf - indicates if the file is a pdf
 * @param {string} props.uploadFile.displayFile.name - name of the file
 * @param {object} props.uploadFile.displayFile.url - dataURL for the file
 */
export const DisplayFile = ({ uploadFile }) => {

    if (!(uploadFile && uploadFile.displayFile && uploadFile.displayFile.url)) {
        return (
            <div style={{
                height: "85vh",
                width: "100%",
                backgroundColor: "white",
                backgroundImage: "url('/img/img.jpg')",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover"
            }}>
            </div>
        )
    }
    
    const data = uploadFile.displayFile
    if (!data.isPdf) {
        const dataNotVisualizable = <Fragment>
            <p><FormattedMessage id="file.download.text.1" defaultMessage="The document to sign can't be previewed but you can download it by right-clicking on the link below and selecting the option 'save-link-as'."/></p>
        </Fragment>

        return <div>
            {data.isXml && <XmlDataViewer key={data.url} data={data.url} xslt={data.xsltUrl} previewErrorRenderer={() => (
                dataNotVisualizable
            )}></XmlDataViewer>}
            <p><a href={data.url} download={data.fileName} title={data.fileName}><FormattedMessage id="file.download.link" defaultMessage="Download the file to sign."/></a></p>
        </div>
    }

    return <DisplayPDF file={data} />;
}

