const transformXMLProcessor = (xmlDoc, xslDoc) => {
    const xsltProcessor = new XSLTProcessor();

    // Import the .xsl
    xsltProcessor.importStylesheet(xslDoc);

    const fragment = xsltProcessor.transformToFragment(xmlDoc, document);

    return new XMLSerializer().serializeToString(fragment);
}

export const loadDoc = (url) => {
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open("GET", url);
        req.onload = function() {
            if(this.responseXML){
                resolve(this.responseXML)
            }else{
                reject();
            }
        }
        req.send();
    });
}

export const transformXML = (xmlUrl, xsltUrl) => {
    return new Promise((resolve, reject) => {
        Promise.all([loadDoc(xmlUrl), loadDoc(xsltUrl)]).then(function(data) {
            try{
                const xmlDoc = data[0];
                const xslDoc = data[1];
                resolve(transformXMLProcessor(xmlDoc, xslDoc));
            }catch (e){
                //console.log(e);
            }
            reject();
        }, reject);
    })
}

