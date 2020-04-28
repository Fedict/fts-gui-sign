//todo implement rejection reason

export const createDefaultStrategy = () => {

    const getVersion = (minimumVersion, onCorrectVersion, onNotInstalled, onNeedsUpdate, onNoExtentionInstalled) => {
        onNoExtentionInstalled()
    }

    const getInfo = () => {
        return Promise.reject("reason")
    }

    const getCertificate = (lang, mac) => {
        return Promise.reject("reason")
    }

    const getCertificateChain = (lang, mac, userCert) => {
        return Promise.reject("reason")
    }

    const sign = (lang, mac, cert, algo, digest, pin) => {
        return Promise.reject("reason")
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