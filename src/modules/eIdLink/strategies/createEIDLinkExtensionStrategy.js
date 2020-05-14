export const createEIDLinkExtensionStrategy = (api) => {

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

    const getInfo = () => {
        return api.getInfo()
    }

    const getCertificate = (lang, mac) => {
        return api.getUserCertificates(lang, mac)
            .then((response) => {
                return response
            })
    }

    const getCertificateChain = (lang, mac, userCert) => {
        return api.getUserCertificateChain(lang, mac, userCert)
    }

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