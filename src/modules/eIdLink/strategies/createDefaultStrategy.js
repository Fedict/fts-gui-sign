/**
 * @constant {string} - string that is thrown when extension is not active
 */
export const NO_EXTENSION_ACTIVE = "NO_EXTENSION_ACTIVE"

/**
 * function that creates a strategy when no extension is active
 * returns a object with the following functions:
 * - getVersion
 * - getCertificate
 * - getCertificateChain
 * - sign
 * - stop
 * @returns {object} returns a object with functions.
 */
export const createDefaultStrategy = () => {

    /**
     * function to check if eIDlink is installed and has the right version.
     * @param {string} minimumVersion - minimum version of eIDLink
     * @param {function} onCorrectVersion - callback when the correct version is installed
     * @param {function} onNotInstalled - callback when eIDLink is not installed 
     * @param {function} onNeedsUpdate - callback when eIDLink is not up to date
     * @param {function} onNoExtensionInstalled - callback when eIDLink extension in not installed
     */
    const getVersion = (minimumVersion, onCorrectVersion, onNotInstalled, onNeedsUpdate, onNoExtensionInstalled) => {
        if (typeof onNoExtensionInstalled === "function") { onNoExtensionInstalled() }
    }

    /**
     *  function that returns a rejected promise
     * @param {string} lang - language of the browser
     * @param {string} mac - mac
     */
    const getCertificate = (lang, mac) => {
        return Promise.reject(NO_EXTENSION_ACTIVE)
    }

    /**
     * function that returns a rejected promise
     * @param {string} lang - language of the browser
     * @param {string} mac - mac
     * @param {string} userCert - userCertificate from where to get the CertificateChain
     */
    const getCertificateChain = (lang, mac, userCert) => {
        return Promise.reject(NO_EXTENSION_ACTIVE)
    }

    /**
     * function that returns a rejected promise
     * @param {string} lang - language of the browser
     * @param {string} mac - mac
     * @param {string} cert - certificate that is used to sign the document
     * @param {string} algo - algorithm of the digest
     * @param {string} digest - digest that is used to sign the document
     * @param {string} pin - pincode. should be null for pinpad reader
     */
    const sign = (lang, mac, cert, algo, digest, pin) => {
        return Promise.reject(NO_EXTENSION_ACTIVE)
    }

    /**
     * function that returns a rejected promise
     * @param {string} lang - language of the browser
     * @param {string} mac - mac
     * @param {string} cert - certificate that is used to sign the document
     * @param {string} algo - algorithm of the digest
     * @param {string} digest - digest that is used to sign the document
     * @param {string} pin - pincode. should be null for pinpad reader
     */
    const auth = (lang, mac, cert, algo, digest, pin) => {
        return Promise.reject(NO_EXTENSION_ACTIVE)
    }

    return {
        getVersion: getVersion,
        getCertificate: getCertificate,
        getCertificateChain: getCertificateChain,
        sign: sign,
        auth: auth,
        stop: () => { }
    }
}