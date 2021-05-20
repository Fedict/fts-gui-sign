import {sleep} from "../utils/helper";

const readerType = process.env.NODE_ENV === 'development'?"pinpad":"standard";

export class EIDChromeExtMock {
    userCertificates =
        {Readers: [{
                ReaderName: "Broadcom Corp Contacted SmartCard 0",
                ReaderType: readerType,
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
        }, cardType: "BEID", ReaderType: readerType, result: "OK", correlationId: "459895de-65f3-9165-a7e2-e4efb090d7d4",
        extensionVersion: "0.0.4",
        src: "EIDChromeExt.background"
    }

    signature = {signature: "YXBma2ExZWE2MzV6YWNhIG9heiBkejVkMSAzYXo1IDFkegogMzE=", result: "OK", correlationId: "2b5401ea-04d9-841a-ba1a-2ce666f40dbf", src: "EIDChromeExt.background", extensionVersion: "0.0.4"}


    checkVersion(minimumVersion, onCorrectVersion, onNotInstalled, onNeedsUpdate){
        onCorrectVersion(minimumVersion);
    }

    getUserCertificates(lang, mac){
        return new Promise((resolve, reject) => {
            if(window.confirm('Is error to getUserCertificates?')){
                reject ({message : 'unsupported_reader', report : 'Card error from mock'})
            } else{
                resolve(this.userCertificates)
            }

        })
    }
    getUserCertificateChain(lang, mac){
        return new Promise(resolve => {
            resolve(this.userCertificatesChain)
        })
    }

    sign(lang, mac, cert, algo, digest, pin){
        return sleep(500).then(() => {
            if(process.env.NODE_ENV === 'development'){
                if(window.confirm('Confirming the signature of the document, press yes for happy flow, no for pin input error')){
                    return (this.signature)
                }else{
                    //throw ({message : 'pin_2_attempts_left'})
                    throw ({message : 'no_reader'})
                }
            }else{
                return (this.signature)
            }

        })
    }

    suspend(){

    }

}