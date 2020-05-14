export const NO_EXTENSION_ACTIVE = "NO_EXTENSION_ACTIVE"
export const createDefaultStrategy = () => {

    const getVersion = (minimumVersion, onCorrectVersion, onNotInstalled, onNeedsUpdate, onNoExtensionInstalled) => {
        onNoExtensionInstalled()
    }

    const getInfo = () => {
        return Promise.reject(NO_EXTENSION_ACTIVE)
    }

    const getCertificate = (lang, mac) => {
        return Promise.reject(NO_EXTENSION_ACTIVE)
    }

    const getCertificateChain = (lang, mac, userCert) => {
        return Promise.reject(NO_EXTENSION_ACTIVE)
    }

    const sign = (lang, mac, cert, algo, digest, pin) => {
        return Promise.reject(NO_EXTENSION_ACTIVE)
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