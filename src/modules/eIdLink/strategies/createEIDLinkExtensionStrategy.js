/**
 * used when calling eazySign getId
 * @type {{ID_FLAG_INCLUDE_ADDR: number, ID_FLAG_INCLUDE_CACERTS: number, ID_FLAG_INCLUDE_INTEGRITY: number, ID_FLAG_INCLUDE_AUTH_CERT: number, ID_FLAG_INCLUDE_PHOTO: number, ID_FLAG_INCLUDE_ROOTCERT: number, ID_FLAG_INCLUDE_ID: number, ID_FLAG_INCLUDE_CERTS: number, ID_FLAG_INCLUDE_SIGN_CERT: number}}
 */
export const ID_FLAGS = {
    ID_FLAG_INCLUDE_ID          : 1,
    ID_FLAG_INCLUDE_ADDR        : 2,
    ID_FLAG_INCLUDE_PHOTO       : 4,
    ID_FLAG_INCLUDE_INTEGRITY   : 8,
    ID_FLAG_INCLUDE_CERTS       : 16,
    ID_FLAG_INCLUDE_AUTH_CERT   : 32,
    ID_FLAG_INCLUDE_SIGN_CERT   : 64,
    ID_FLAG_INCLUDE_CACERTS     : 128,
    ID_FLAG_INCLUDE_ROOTCERT    : 256
}

export function isUptodate(minimumVersion, installedVersion) {
    try{
        var expected = minimumVersion.split(".");
        var actual = installedVersion.split(".");
        return (+actual[0] > +expected[0]) || (actual[0] === expected[0] && +actual[1] >= +expected[1]);
    }
    catch{
        return false;
    }
}

/**
 * function that creates a strategy when the extension is active
 * returns a object with the following functions:
 * - getVersion
 * - getCertificate
 * - getCertificateChain
 * - sign
 * - auth
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
        api.getVersion().then(
            function (msg) {
                var installedVersion = {version:msg.version, extensionVersion: msg.extensionVersion, extensionBrowser: msg.extensionBrowser};
                //console.log("BeIDConnect version is " + installedVersion);
                if (msg.windowsInstallType && msg.windowsInstallType==="admin")
                {
                    installedVersion.IsAdmin = true;
                }

                if (isUptodate(minimumVersion, installedVersion.version)) {
                    if (onCorrectVersion && typeof onCorrectVersion === "function"){
                        onCorrectVersion(installedVersion);
                    }
                } else {
                    if (onNeedsUpdate && typeof onNeedsUpdate === "function"){
                        onNeedsUpdate(installedVersion);
                    }
                }
            },
            function (err) {
                if (onNotInstalled && typeof onNotInstalled === "function"){
                    onNotInstalled();
                }
            });
    }

    /**
     * function that returns a promise that resolves in a list of certificates and readers
     * @param {string} lang - language of the browser
     * @param {string} mac - mac
     */
    const getCertificate = (lang, mac) => {
        return api.getUserCertificates(lang, mac, 'NONREPUDIATION')
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

    const getIdData = (lang, mac, idFlags) => {
        return api.getId(lang, mac, idFlags)
    }

    /**
     * function to get the signing data 
     * @param {string} lang - language of the browser
     * @param {string} mac - mac
     * @param {string} cert - certificate that is used to sign the document
     * @param {string} algo - algorithm of the digest
     * @param {string} digest - digest that is used to sign the document
     * @param {string} pin - pincode. should be null for pinpad reader
     */
    const sign = (lang, mac, cert, algo, digest, pin) => {
        return api.sign(lang, mac, cert, algo, digest, pin)
    }

    /**
     * function to get the auth data 
     * @param {string} lang - language of the browser
     * @param {string} mac - mac
     * @param {string} cert - certificate that is used to sign the document
     * @param {string} algo - algorithm of the digest
     * @param {string} digest - digest that is used to sign the document
     * @param {string} pin - pincode. should be null for pinpad reader
     */
    const auth = (lang, mac, cert, algo, digest, pin) => {
        return api.auth(lang, mac, cert, algo, digest, pin)
    }

    return {
        getVersion: getVersion,
        getCertificate: getCertificate,
        getCertificateChain: getCertificateChain,
        getIdData : getIdData,
        sign: sign,
        auth: auth,
        stop: () => { }
    }
}