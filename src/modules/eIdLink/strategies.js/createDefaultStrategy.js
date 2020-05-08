export const NO_EXTENTION_ACTIVE = "NO_EXTENTION_ACTIVE"
export const createDefaultStrategy = () => {

    const getVersion = (minimumVersion, onCorrectVersion, onNotInstalled, onNeedsUpdate, onNoExtentionInstalled) => {
        onNoExtentionInstalled()
    }

    const getInfo = () => {
        return Promise.reject(NO_EXTENTION_ACTIVE)
    }

    const getCertificate = (lang, mac) => {
        return Promise.reject(NO_EXTENTION_ACTIVE)
    }

    const getCertificateChain = (lang, mac, userCert) => {
        return Promise.reject(NO_EXTENTION_ACTIVE)
    }

    const sign = (lang, mac, cert, algo, digest, pin) => {
        return Promise.reject(NO_EXTENTION_ACTIVE)
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