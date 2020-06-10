/**
 * function that creates a strategy when the extention is active
 * returns a object with the folowing functions:
 * - getVersion
 * - getInfo
 * - getCertificate
 * - getCertificateChain
 * - sign
 * - stop
 * @returns {object} returns a object with functions.
 */
export const createEIDLinkExtensionStrategy = (api) => {

    /**
    * function to check if eIDlink is installed and has the right version.
    * @param {string} minimumVersion - minimum version of eIDLink
    * @param {function} onCorrectVersion - callback when the correct version is installed
    * @param {function} onNotInstalled - callback when eIDLink is not installed 
    * @param {function} onNeedsUpdate - callback when eIDLink is not up to date
    * @param {function} onNoExtensionInstalled - callback when eIDLink extension in not installed
    */
    const getVersion = (minimumVersion, onCorrectVersion, onNotInstalled, onNeedsUpdate, onNoExtensionInstalled) => {

        api.checkVersion(minimumVersion,
            function (installedVersion) {

                if (onCorrectVersion && typeof onCorrectVersion === "function") {
                    onCorrectVersion(installedVersion)
                }
            },
            (msg) => {

                if (onNotInstalled && typeof onNotInstalled === "function") {
                    onNotInstalled(msg)
                }
            },
            (installedVersion) => {

                if (onNeedsUpdate && typeof onNeedsUpdate === "function") {
                    onNeedsUpdate(installedVersion)
                }
            }
        );
    }

    /**
     * function that returns extra info about eIDLink
     */
    const getInfo = () => {
        return api.getInfo()
    }


    /**
     * function that returns a promise that resolves in a list of certificates and readers
     * @param {string} lang - language of the browser
     * @param {string} mac - mac
     */
    const getCertificate = (lang, mac) => {
        return api.getUserCertificates(lang, mac)
            .then((response) => {
                return response
            })
    }

    /**
     * function to get the certificate from a certificate
     * @param {string} lang - language of the browser
     * @param {string} mac - mac
     * @param {string} userCert - userCertificate from where to get the CertificateChain
     */
    const getCertificateChain = (lang, mac, userCert) => {
        return api.getUserCertificateChain(lang, mac, userCert)
    }

    /**
     * function to get the signing data 
     * @param {string} lang - language of the browser
     * @param {string} mac - mac
     * @param {string} cert - certificate that is used to sign the document
     * @param {string} algo - algroritme of the digest
     * @param {string} digest - digest that is used to sign the document
     * @param {string} pin - pincode. should be null for pinpad reader
     */
    const sign = (lang, mac, cert, algo, digest, pin) => {
        return api.sign(lang, mac, cert, algo, digest, pin)
    }

    return {
        getVersion: getVersion,
        getInfo: getInfo,
        getCertificate: getCertificate,
        getCertificateChain: getCertificateChain,
        sign: sign,

        stop: () => { }
    }
}