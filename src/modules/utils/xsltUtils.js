const isIE = typeof XSLTProcessor === 'undefined';

const transformXMLProcessor = (xmlDoc, xslDoc) => {
    const xsltProcessor = new XSLTProcessor();

    // Import the .xsl
    xsltProcessor.importStylesheet(xslDoc);

    const fragment = xsltProcessor.transformToFragment(xmlDoc, document);

    return new XMLSerializer().serializeToString(fragment);
}

const transformXMLIE = (xmlDoc, xslDoc) =>{
    var template = new window.ActiveXObject('Msxml2.XslTemplate.6.0');
    template.stylesheet = xslDoc;
    var proc = template.createProcessor();

    proc.input = xmlDoc;

    proc.transform();

    return proc.output;
}

export const loadDoc = (url) => {
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open("GET", url);
        if (isIE) {
            try {
                req.responseType = 'msxml-document';
            }catch (e) {}
        }
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

                if (isIE) {
                    resolve(transformXMLIE(xmlDoc, xslDoc));
                } else {
                    resolve(transformXMLProcessor(xmlDoc, xslDoc));
                }
            }catch (e){
                console.log(e);
            }
            reject();
        }, reject);
    })
}

