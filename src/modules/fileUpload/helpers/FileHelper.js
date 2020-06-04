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