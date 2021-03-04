export class EIDChromeExtMock {
    userCertificates =
        {Readers: [{
                ReaderName: "Broadcom Corp Contacted SmartCard 0",
                ReaderType: "standard",
                cardType: "BEID",
                certificates: [{
                    "certificate": {"encodedCertificate": "emVnZXpncnRqenRyanRoNTE2NTE2ZXoxZjVlemYzNjFlNmYgIGV6ZiA="}
                    , "expectedKeyUsage": "NON_REPUDIATION"
                },
                    {
                        "certificate": {"encodedCertificate": "emVnZXpncnRqenRyanRoNTE2NTE2ZXoxZjVlemYzNjFlNmYgIGV6ZiByZWdyZWdyZWdyZWdl"},
                        "expectedKeyUsage": "NON_REPUDIATION"
                    }]
            }], result: "OK", correlationId: "6e49a25c-12c6-8cd3-471f-5f38d5b6ea0c", src: "EIDChromeExt.background", extensionVersion: "0.0.4"}

    userCertificatesChain = {certificateChain: {
            rootCA: "emVnZXpncnRqenRyanRoNTE2NTE2ZXoxZjVlemYzNjFlNmYgIGV6ZiA=",
            subCA : ['emVnZXpncnRqenRyanRoNTE2NTE2ZXoxZjVlemYzNjFlNmYgIGV6ZiA=']
        }, cardType: "BEID", ReaderType: "standard", result: "OK", correlationId: "459895de-65f3-9165-a7e2-e4efb090d7d4",
        extensionVersion: "0.0.4",
        src: "EIDChromeExt.background"
    }

    signature = {signature: "YXBma2ExZWE2MzV6YWNhIG9heiBkejVkMSAzYXo1IDFkegogMzE=", result: "OK", correlationId: "2b5401ea-04d9-841a-ba1a-2ce666f40dbf", src: "EIDChromeExt.background", extensionVersion: "0.0.4"}


    checkVersion(minimumVersion, onCorrectVersion, onNotInstalled, onNeedsUpdate){
        onCorrectVersion(minimumVersion);
    }

    getUserCertificates(lang, mac){
        return new Promise(resolve => {
            resolve(this.userCertificates)
        })
    }
    getUserCertificateChain(lang, mac){
        return new Promise(resolve => {
            resolve(this.userCertificatesChain)
        })
    }

    sign(lang, mac, cert, algo, digest, pin){
        return new Promise(resolve => {
            resolve(this.signature)
        })
    }

}