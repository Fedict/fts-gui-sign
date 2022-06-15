import React, {Fragment, useEffect, useRef, useState} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {loadDoc, transformXML} from "../../../utils/xsltUtils";
import XMLViewer from "react-xml-viewer";

const messages = defineMessages({
    downloadTitle : {
        id : 'xmlpreview.button.download',
        defaultMessage : 'Download original xml'
    },
    printTitle : {
        id : 'xmlpreview.button.print',
        defaultMessage : 'Print'
    }
})

const XmlDataViewer = (props) => {
    const [previewSkipped, setPreviewSkipped] = useState(false);
    const [previewError, setPreviewError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [xml, setXml] = useState(undefined);
    const iframeEl = useRef(null);
    const intl = useIntl();

    useEffect(() => {
        if(!props.xslt){
            function xmlLoadingFailed(){
                setPreviewSkipped(true);
                setLoading(false);
            }
            loadDoc(props.data).then((xml) => {
                setLoading(false);
                setXml(new XMLSerializer().serializeToString(xml.documentElement))
            }, xmlLoadingFailed)
                .catch(xmlLoadingFailed)
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
            //console.log(e);
            setPreviewError(true);
        }

    }, [props.data, props.xslt])

    return <Fragment>
        {previewError?
            (
                props.previewErrorRenderer?
                    props.previewErrorRenderer():
                <FormattedMessage id="xmlpreview.error" defaultMessage="Couldn't create the preview of the document to sign"/>
            )
        :(loading?
                <FormattedMessage id="xmlpreview.loading" defaultMessage="Loading the preview of the document..."/>
        :false)
        }
        {/*raw xml*/}
        {xml && <div style={{
            boxShadow: 'inset -5px -5px 20px #888888',
            border: '3px solid black',
            padding: '5px 0px 5px 5px',
            maxHeight : window.innerHeight - 200,
            overflow: "scroll"
        }}>
            <XMLViewer xml={xml} collapsible={true} invalidXml={<p>Invalid Xml</p>}/>
        </div>}

        <div style={previewSkipped || loading || xml?{display:'none'}:{
            boxShadow: 'inset -5px -5px 20px #888888',
            border: '3px solid black',
            padding: '5px 0px 5px 5px',
            textAlign: 'right'
        }}>
            <a style={{marginRight:30}} href={props.data} target="_blank"
               title={intl.formatMessage(messages.downloadTitle)}
            ><img height={20} src="/img/download.svg" alt={intl.formatMessage(messages.downloadTitle)}/></a>
            <a style={{marginRight:30}} href="#" onClick={()=>{
                window.frames["xmlDataContent"].focus();
                window.frames["xmlDataContent"].print();
            }}
               title={intl.formatMessage(messages.printTitle)}
            ><img height={20} src="/img/print.svg" alt={intl.formatMessage(messages.printTitle)}/></a>
            <iframe ref={iframeEl} width={'100%'} height={700} frameBorder={0} name="xmlDataContent"></iframe>
        </div>
    </Fragment>
}

export default XmlDataViewer;