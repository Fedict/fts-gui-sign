import React, {Fragment, useEffect, useRef, useState} from "react";
import {FormattedMessage} from "react-intl";
import {transformXML} from "../../../utils/xsltUtils";

const XmlDataViewer = (props) => {
    const [previewSkipped, setPreviewSkipped] = useState(false);
    const [previewError, setPreviewError] = useState(false);
    const [loading, setLoading] = useState(true);
    const iframeEl = useRef(null);
    useEffect(() => {
        if(!props.xslt){
            setPreviewSkipped(true);
            setLoading(false);
            return;
        }
        try{
            transformXML(props.data, props.xslt).then((resultHTML) => {
                iframeEl.current.src = "about:blank";

                iframeEl.current.contentWindow.document.open();
                /*
                fragment.ownerDocument.children.forEach((child) =>{
                    console.log(child)
                    //iframeEl.current.contentWindow.document.appendChild(child);
                })
                 */
                iframeEl.current.contentWindow.document.write(resultHTML);
                iframeEl.current.contentWindow.document.close();
                setLoading(false);
            }, () => {
                setPreviewError(true)
            })
        }catch (e){
            console.log(e);
            setPreviewError(true);
        }

    }, [props.data, props.xslt])

    return <Fragment>
        {previewError?
            <FormattedMessage id="xmlpreview.error" defaultMessage="Couldn't create the preview of the document to sign"/>
        :(loading?
                <FormattedMessage id="xmlpreview.loading" defaultMessage="Loading the preview of the document..."/>
        :false)
        }
        <div style={previewSkipped || loading?{display:'none'}:{
            boxShadow: 'inset -5px -5px 20px #888888',
            border: '3px solid black',
            padding: '5px 0px 5px 5px'
        }}>
        <iframe ref={iframeEl} width={'100%'} height={700} frameBorder={0}></iframe>
        </div>
    </Fragment>
}

export default XmlDataViewer;