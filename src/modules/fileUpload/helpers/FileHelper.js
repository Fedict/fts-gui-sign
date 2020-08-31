/**
 * Function to convert a document to base64 encoding
 * @param {*} document - document to convert to base64
 * 
 * @returns {Promise} Promise that resolves the base64 encoded document
 */
export const getBase64Data = (document) => {
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

/**
 * function that returns a promise that resolves in the content of the file.
 * @param {file} document 
 */
export const getContentData = (document) => {
    return new Promise((resolve, rejects) => {
        let reader = new FileReader();
        reader.onload = (event) => {

            resolve(event.target.result);
        }
        reader.onerror = (err) => {
            rejects(err);
        }

        reader.readAsText(document);
    })
}

/**
 * funtion to create a blob from a base64 string
 * @param {*} base64 - base64 string
 * @param {*} contentType 
 * @param {*} sliceSize 
 */
export const getBlobFromBase64 = (base64, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

export const GetDataUrlFromFile = (document) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onloadend = () => {
            resolve(reader.result)
        }

        reader.onerror = () => {
            reject()
        }

        reader.readAsDataURL(document)
    })
}

export const getBinaryFromDataURI = (dataURI) => {
    console.log(dataURI)
    if (dataURI) {
        var base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;
        var base64 = dataURI.substring(base64Index);
        var raw = window.atob(base64);
        return raw
    }
}