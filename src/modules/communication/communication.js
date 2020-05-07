//-----------------------------------------
//--- constants                         ---
//-----------------------------------------

const url = (window && window.configData) ? window.configData.BEurl : ""
const REQUEST_FAILED = "REQUEST_FAILED"

//-----------------------------------------
//--- helpers                           ---
//-----------------------------------------

const createBody = (certificateBody, documentName, documentBase64) => {

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
        "signingProfileId": "XADES_1",
        "toSignDocument": {
            "bytes": documentBase64,
            // "digestAlgorithm": "SHA256",
            "name": documentName
        }

    }
}

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



export const getDataToSignAPI = async (certificateBody, document) => {

    const documentB64 = await getBase64Data(document)

    const body = createBody(certificateBody, document.name, documentB64);

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



export const signDocumentAPI = async (certificateBody, document, signature) => {
    const documentB64 = await getBase64Data(document)

    const body = {
        ...createBody(certificateBody, document.name, documentB64),
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

export const validateSignatureAPI = async (document) => {
    const documentB64 = await getBase64Data(document)
    const body = {
        // "originalDocuments": [
        //     {
        //         "bytes": "string",
        //         "digestAlgorithm": "SHA1",
        //         "name": "string"
        //     }
        // ],
        // "policy": {
        //     "bytes": "string",
        //     "digestAlgorithm": "SHA1",
        //     "name": "string"
        // },
        // "signatureId": "string",
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

