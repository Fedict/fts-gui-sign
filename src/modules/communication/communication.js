//-----------------------------------------
//--- constants                         ---
//-----------------------------------------

/**
 * @const {string} - API url: can be configerd in config.js
 */
const url = (window && window.configData) ? window.configData.BEurl : ""

/**
 * @const {string} - key to retun when the api request fails
 */
const REQUEST_FAILED = "REQUEST_FAILED"

//-----------------------------------------
//--- helpers                           ---
//-----------------------------------------

/**
 * Function to get the signingProfileId from window.configData based on the MIME-type of the document. 
 * SigningProfileId can be configuerd in config.js.
 * If no signingprofile is configuerd for the MIME-type the configuerd signingProfileId will be returend
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
export const createBody = (certificateBody, documentName, documentBase64, documentType) => {

    return {
        "clientSignatureParameters": {
            "certificateChain": certificateBody.certificateChain,
            "detachedContents": [
                // {
                //     "bytes": "string",
                //     "digestAlgorithm": "SHA1",
                //     "name": "string"
                // }
            ],
            "signingCertificate": certificateBody.certificate,
            "signingDate": "2020-04-06T09:45:44"
        },
        "signingProfileId": getsigningProfileId(documentType),
        "toSignDocument": {
            "bytes": documentBase64,
            // "digestAlgorithm": "SHA256",
            "name": documentName
        }

    }
}
/**
 * Function to convert a document to base64 encoding
 * @param {*} document - document to convert to base64
 * 
 * @returns {Promise} Promise that resolves the base64 encoded document
 */
const getBase64Data = (document) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onloadend = () => {
            let b64 = reader.result.replace(/^data:.+;base64,/, '')
            resolve(b64)
        }

        reader.onerror = () => {
            reject()
        }

        reader.readAsDataURL(document)
    })
}

//-----------------------------------------
//--- API requests                      ---
//-----------------------------------------

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
        .then((response) => {
            if (!response.ok) {
                throw new Error(REQUEST_FAILED)
            }
            try {
                return response.json()
            }
            catch{
                return response.text()
            }

        })
}


/**
 * API request to get the DataToSign
 * @param {Object} certificateBody - object that represents the certificate
 * @param {Object} document - document to be signed
 * 
 * @returns {Promise} Promis that resolves the result of the API request
 */
export const getDataToSignAPI = async (certificateBody, document) => {

    const documentB64 = await getBase64Data(document)

    const body = createBody(certificateBody, document.name, documentB64, document.type);

    return fetch(url + "/signing/getDataToSign",
        {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'

            },
        }
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error(REQUEST_FAILED)
            }

            try {
                return response.json()
            }
            catch{
                return response.text()
            }

        })

}


/**
 * API request to sign a document
 * @param {Object} certificateBody - object that represents the certificate
 * @param {Object} document - document to be signed
 * @param {string} signature - signature value used to sign th document
 */

export const signDocumentAPI = async (certificateBody, document, signature) => {
    const documentB64 = await getBase64Data(document)

    const body = {
        ...createBody(certificateBody, document.name, documentB64, document.type),
        "signatureValue": signature
    }

    return fetch(url + "/signing/signDocument", {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'

        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(REQUEST_FAILED)
            }

            try {
                return response.json()
            }
            catch{
                return response.text()
            }

        })

}

/**
 * API request to validate the signature on a document
 * @param {Object} document - document to be signed
 */
export const validateSignatureAPI = async (document) => {
    const documentB64 = await getBase64Data(document)
    const body = {
        "signedDocument": {

            "bytes": documentB64,
            // "digestAlgorithm": "SHA256",
            "name": document.name

        }
    }

    return fetch(url + "/validation/validateSignature", {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'

        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(REQUEST_FAILED)
            }

            try {
                return response.json()
            }
            catch{
                return response.text()
            }

        })
}

