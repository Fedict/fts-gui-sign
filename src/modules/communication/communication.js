import { getBase64Data } from "../fileUpload/helpers/FileHelper"
import packageJson from '../../../package.json';
import {defaults, defaultsExcludeEmpty, getBEUrl} from "../utils/helper";
import { globalToken } from "../../store/globals"
import { INVISIBLE_SIGNATURE, MANUAL_SIGNATURE } from '../fileUpload/reducers/CustomSignatureReducer'

//-----------------------------------------
//--- constants                         ---
//-----------------------------------------

/**
 * @const {string} - API url: can be configured in config.js
 */
const url = getBEUrl()

/**
 * @const {string} - key to return when the api request fails
 */
const REQUEST_FAILED = "REQUEST_FAILED"


//-----------------------------------------
//--- helpers                           ---
//-----------------------------------------

/**
 * Function to get the signingProfileId from window.configData based on the MIME-type of the document. 
 * SigningProfileId can be configured in config.js.
 * If no signingprofile is configuerd for the MIME-type, the configuerd signingProfileId will be returend
 * @param {string} documentType - MIME-type of the document
 * @returns {string} SigningProfileId based on the MIME-type of the document or the default SigningProfileId
 */
export const getsigningProfileId = (documentType) => {
    if (window && window.configData && window.configData.signingProfileIds && window.configData.signingProfileIds[documentType]) {
        return window.configData.signingProfileIds[documentType]
    }
    return (window && window.configData) ? window.configData.defaultSigningProfileId : ""
}


/**
 * Function to format a manually drawn Signature definition to a psfC field
 */
export const createPsfC = (sigArea) => {
    return sigArea.page + "," + sigArea.rect.left + "," + sigArea.rect.top + "," +
            (sigArea.rect.right - sigArea.rect.left) + "," + (sigArea.rect.bottom - sigArea.rect.top);
}

/**
 * Function to build the request body for the Api request
 * @param {Object} certificateBody - object that represents the certificate
 * @param {[Object]} certificateBody.certificateChain - certificateChain object of the certificate
 * @param {Object} certificateBody.certificate - certificate object
 
 * @param {string} documentName - name of the document
 * @param {string} documentBase64 - base64 encoded document
 * @param {string} documentType - MIME-type of the document
 * 
 * @returns {object} body to use in the API request
 */
export const createBody = (certificateBody, documentName, documentBase64, documentType, signingDate, customSignature, signLanguage, photo) => {

    const sigType = customSignature.signatureSelected;
    return {
        "clientSignatureParameters": {
            "certificateChain": certificateBody.certificateChain,
            "detachedContents": [
            ],
            "signingCertificate": certificateBody.certificate,
            signingDate,
            pdfSigParams: {
                "psfN": sigType !== INVISIBLE_SIGNATURE && sigType !== MANUAL_SIGNATURE ? sigType : null,
                "psfC": sigType === MANUAL_SIGNATURE ? createPsfC(customSignature.signatureArea) : null,
                photo,
                signLanguage,
                "psp": sigType === INVISIBLE_SIGNATURE ? null : {
                    "texts": {
                        "fr": "Signé par %gn% %sn%\nLe %d(d MMM YYYY z - HH:mm)%",
                        "en": "Signed by %gn% %sn%\nOn %d(d MMM YYYY z - HH:mm )%",
                        "de": "Unterzeichnet von %gn% %sn%\nAm %d(HH:mm MMM d YYYY z)%",
                        "nl": "Getekend door %gn% %sn%\nOp %d(HH:mm MMM d YYYY z)%",
                    },
                    "textPos": photo ? "RIGHT" : "TOP",
                    "bgColor": "TRANSPARENT",
                    "font": "Montserrat-Regular",
                    "textColor": "#000000",
                    "textPadding": 10,
                    "textWrapping": "FILL_BOX",
                    "textAlignH": "CENTER",
                    "textAlignV": "MIDDLE",
                    "textSize": "12",
                    "bodyBgColor": "#D0D0D0",
                    "version": "2",
                    "rotation": sigType === MANUAL_SIGNATURE  && customSignature.signatureArea.pageInfo.rotate === 90 ? "ROTATE_270" : "NONE"
                }
            }
        },
        "signingProfileId": getsigningProfileId(documentType),
        "toSignDocument": {
            "bytes": documentBase64,
            "name": documentName
        },
        token: globalToken
    }
}

export const createBodyForToken = (certificateBody, token, fileIdToSign, customSignature, signLanguage, signingDate, photo) => {
    const sigType = customSignature.signatureSelected;
    return {
        "clientSignatureParameters": {
            "certificateChain": certificateBody.certificateChain,
            "detachedContents": [
            ],
            "signingCertificate": certificateBody.certificate,
            signingDate,
            pdfSigParams: {
                "psfC": sigType === MANUAL_SIGNATURE ? createPsfC(customSignature.signatureArea) : null,
                "psfN": sigType !== INVISIBLE_SIGNATURE && sigType !== MANUAL_SIGNATURE ? sigType : null,
                photo,
                signLanguage,
                }
        },
        fileIdToSign,
        token
    }
}

const noContentHandler = (response) => {
    if (!response.ok) {
        if(response.headers){
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") > -1) {
                return response.json();
            }
        }
        throw new Error(REQUEST_FAILED)
    }
    return true;
}

const jsonHandler = (response) => {
    if (!response.ok) {
        if(response.headers){
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") > -1) {
                return response.json();
            }
        }
        throw new Error(REQUEST_FAILED)
    }
    try {
        return response.json()
    }
    catch{
        return response.text()
    }
}

//-----------------------------------------
//--- API requests                      ---
//-----------------------------------------

/**
 * API to log various front-end versions to the back-end
 * @returns {Promise} Promise that resolves the result of the API request
 */
export const logVersions = (guiSign, beID, browserExt, browserStore, token) => {

    return fetch(url + "/logging/versions", {
            method: 'POST',
            body: JSON.stringify({
                frontEndType: "GUISIGN",
                frontEnd: guiSign,
                beID: beID,
                browserExt: browserExt,
                browserStore: browserStore,
                token: token,
                userAgent: navigator.userAgent
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        }
    ).then((response) => response.text())
}

/**
 * API request to validate a array of certificates
 * @param {Object} certificateBody - the api body for the request
 * 
 * @returns {Promise} Promis that resolves the result of the API request
 */
export const validateCertificatesAPI = (certificateBody) => {

    return fetch(url + "/validation/validateCertificates",
        {
            method: 'POST',
            body: JSON.stringify(certificateBody),
            headers: {
                'Content-Type': 'application/json'
            },
        }
    )
        .then(jsonHandler)
}

/**
 * API request to get the DataToSign
 * @param {Object} certificateBody - object that represents the certificate
 * @param {Object} document - document to be signed
 * 
 * @returns {Promise} Promise that resolves the result of the API request
 */
export const getDataToSignAPI = async (certificateBody, document, signingDate, customSignature, signLanguage, photo) => {

    const documentB64 = await getBase64Data(document)

    const body = createBody(certificateBody, document.name, documentB64, document.type, signingDate, customSignature, signLanguage, photo);

    return fetch(url + "/signing/getDataToSign",
        {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            },
        }
    )
        .then(jsonHandler)
}

/**
 * API request to sign a document
 * @param {Object} certificateBody - object that represents the certificate
 * @param {Object} document - document to be signed
 * @param {string} signature - signature value used to sign th document
 */
export const signDocumentASyncAPI = async (certificateBody, document, signature, signingDate, customSignature, signLanguage, photo) => {
    const documentB64 = await getBase64Data(document)

    const body = {
        ...createBody(certificateBody, document.name, documentB64, document.type, signingDate, customSignature, signLanguage, photo),
        "signatureValue": signature
    }

    return fetch(url + "/signing/signDocumentASync", {
        credentials: "include",
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(jsonHandler)
}

/**
 * API request to validate the signature on a document
 * @param {Object} document - document to be signed
 */
export const validateSignatureASyncAPI = async (document) => {
    const documentB64 = await getBase64Data(document)
    const body = {
        "signedDocument": {
            "bytes": documentB64,
            "name": document.name
        },
        token : globalToken
    }

    return fetch(url + "/validation/validateSignatureASync", {
        credentials: "include",
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'

        },
    })
        .then(jsonHandler)
}

/**
 * API request to get the DataToSign by token
 * @param {Object} certificateBody - object that represents the certificate
 * @param {Object} token - token of the document to be signed
 *
 * @returns {Promise} Promise that resolves the result of the API request
 */
export const getDataToSignForTokenAPI = async (certificateBody, token, fileIdToSign, customSignature, signLanguage, signingDate, photo) => {

    const body = createBodyForToken(certificateBody, token, fileIdToSign, customSignature, signLanguage, signingDate, photo);

    return fetch(url + "/signing/getDataToSignForToken",
        {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            },
        }
    )
        .then(jsonHandler)
}

// Wait for a long running "backend ASync" task with growing duration between two polling of the backend
// Maximum 100 trials

export const waitForASyncTask = (resp, tryOK, goError, goCatch, runId = 0) => {
    const uuid = resp.uuid;
    if (runId === 0) {
        if (!uuid || !uuid.match('[0-9,a-f,-]{36}')) {
            goError(uuid);
            return;
        }
    } else if (runId > 100) {
        goCatch("timeout");
        return;
    }
    var waitTime = [150, 300, 450, 600, 1000, 1000, 1000][runId];
    if (!waitTime) waitTime = 2000;
    setTimeout(() => {
        fetch(url + "/signing/getTaskResult/" + uuid, { credentials: "include" })
        .then(jsonHandler)
        .then((resp) => {
            if (!tryOK(resp)) {
                if (resp.done === false) waitForASyncTask({ uuid }, tryOK, goError, goCatch, runId + 1);
                else goError(resp);
            }
        }).catch((err) => { goCatch(err) })
    }, waitTime);
};


/**
 * API request to sign a document
 * @param {Object} certificateBody - object that represents the certificate
 * @param {Object} token - token of the document to be signed
 * @param {string} signature - signature value used to sign th document
 */
export const signDocumentForTokenAPI = async (certificateBody, token, fileIdToSign, customSignature, signLanguage, signature, signingDate, photo, expectNoContent = false) => {
    const body = {
        ...createBodyForToken(certificateBody, token, fileIdToSign, customSignature, signLanguage, signingDate, photo),
        "signatureValue": signature
    }

    return fetch(url + "/signing/signDocumentForToken", {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(expectNoContent?noContentHandler:jsonHandler)
}
/**
 * API request to get document metadata by token, to set filename
 * @param {Object} token - token of the document to be signed
 */
export const getDocumentMetadataForTokenAPI = async (token) => {
    return fetch(`${url}/signing/getMetadataForToken?token=${token}`)
        .then(jsonHandler)
}
/**
    Fetches messages from config folder
 */
export const fetchMessagesForLocale = async (locale) => {
    return fetch(`${packageJson.homepage}config/${locale}.json`)
        .then((response) => {
            if (response.ok) {
                const contentType = response.headers.get("content-type");
                //TODO try to understand why ui returns application/octet-stream when calling a json file :|
                if (contentType && (contentType.indexOf("application/json") !== -1 || contentType.indexOf("application/octet-stream") !== -1)) {
                    return response.json();
                }
            }
            return {};
        });
}



export const sendBEIDLinkErrorToBE = async (report, message, token) => {
    const body = {
        "err": "FE_NATIVE_ERR",
        "report": report,
        "result": message,
        "token": token && token.substring(token.length-8)
    }


    return fetch(url + "/logging/error", {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(jsonHandler)
}

let lastLogInfo = {
    amount : 0
};

export const sendHookInfoAPI = async (o, tokenFile) => {
    var hookURL = tokenFile.hookURL;
    if (!hookURL) return;

    var tokenId = tokenFile.token;
    if (tokenId) tokenId = tokenId.substring(tokenId.length - 16);
    o.tokenId = tokenId;
    let logHook = {
        hookData: o,
        hookURL: hookURL
    }
    return fetch(hookURL, {
        method: 'POST',
        body: JSON.stringify(o),
        headers: { 'Content-Type': 'application/json' }
    })
        .then((response) => {
            logHook.status = response.status
            sendLogInfoIgnoreResult(JSON.stringify(logHook), tokenFile.token)
        })
        .catch((e) => {
            logHook.status = e.message
            sendLogInfoIgnoreResult(JSON.stringify(logHook), tokenFile.token)
        })
}

export const sendLogInfoIgnoreResult = (message, token) => {
    sendLogInfo(message, () =>{}, token);
}

export const sendLogInfo = (message, callback, token) => {
    //console.log('sendLogInfo', message, token);
    if(defaultsExcludeEmpty(message, '______') === '______'
//        || defaultsExcludeEmpty(token, '______') === '______'
        || (lastLogInfo.message === message && lastLogInfo.token === token && lastLogInfo.amount++ > 5)){
        //ignore if message is empty or when sending the same message more than 5 times to the CS
        if(typeof callback === 'function'){
            callback();
        }
        return;
    }
    lastLogInfo.message = message;
    lastLogInfo.token = token;
    lastLogInfo.amount = 0;

    if (!token) token = globalToken;
    const body = {
        "level" : "INFO",
        "message": message,
        "token": token
    }
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(),
        typeof callback === 'function'?
            defaults((window.configData?window.configData.logTimeout:undefined), 10000):90000
    );

    return fetch(url + "/logging/log", {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        },
        signal: controller.signal
    })
        .then(() => {
            clearTimeout(id);

            if(typeof callback === 'function'){
                callback();
            }
        })
        .catch((e) => {
            clearTimeout(id);

            //error but try calling callback anyway
            if(typeof callback === 'function'){
                callback();
            }
        })
}