export const createActiveXEIDLinkStrategy = () => {

    let pendingPromises = {}

    const stop = () => {
        pendingPromises = {}
    }

    const isUptodate = (minimumVersion, installedVersion) => {
        var expected = minimumVersion.split(".");
        var actual = installedVersion.split(".");
        return (actual[0] > expected[0]) || (actual[0] === expected[0] && actual[1] >= expected[1]);
    }

    const getVersion = (minimumVersion, onSuccess, onNotInstalled, onNeedsUpdate) => {
        messagePromise({ operation: 'VERSION' }).then(
            function (msg) {
                var installedVersion = msg.version;
                //console.log("BeIDConnect version is " + installedVersion);

                if (isUptodate(minimumVersion, installedVersion)) {
                    onSuccess(installedVersion);
                } else {
                    onNeedsUpdate(installedVersion);
                }
            },
            function (err) {
                onNotInstalled();
            });
    }

    const getIdData = (language, mac, idFlags) => {
        //console.log("Getting certificate chain");
        return messagePromise({ operation: 'ID', idflags : idFlags.toString(), mac, language });
    }

    const getCertificateChain = (lang, mac, userCert) => {
        //console.log("Getting certificate chain");
        return messagePromise({ operation: 'CERTCHAIN', cert: userCert });
    }

    const sign = (language, mac, cert, algo, digest, pin) => {
        //console.log(pin ? "Signing with PIN" : "Signing with pinpad");
        return messagePromise({ operation: 'SIGN', cert: cert, algo: algo, digest: digest, pin: pin, language: language, mac: mac });
    }

    const auth = (language, mac, cert, algo, digest, pin) => {
        //console.log(pin ? "Signing with PIN" : "Signing with pinpad");
        return messagePromise({ operation: 'AUTH', cert: cert, algo: algo, digest: digest, pin: pin, language: language, mac: mac });
    }

    const getCertificate = (language, mac) => {
        //console.log("Reading user certificates");
        return messagePromise({ operation: 'USERCERTS', language: language, mac: mac });
    };

    const guid = () => {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    const messagePromise = (msg) => {
        if (msg) {
            const correlationId = guid()

            msg.correlationId = correlationId
            pendingPromises[correlationId] = true

            const promise = new Promise((resolve, reject) => {
                try {
                    const obj = document.DemoActiveX;
                    if (obj) {
    
                        const response = obj.sendNativeMessage(JSON.stringify(msg));
                        const responseJson = JSON.parse(response)
                        //console.log("Processing reply from BeIDConnect : " + JSON.stringify(responseJson));

                        if (responseJson.correlationId) {

                            var p = pendingPromises[msg.correlationId];
                            if (!p) {
                                //console.log("No pending promise found, ignoring BeIDConnect reply");
                                return;
                            }

                            delete pendingPromises[msg.correlationId];

                            if (responseJson.result === "OK") {
                                resolve(responseJson);
                            }

                            else {
                                reject(
                                    {
                                        message: responseJson.result,
                                        report: responseJson.report
                                    }
                                );
                            }
                        } else {
                            //console.log("Ignoring message without correlationId");
                        }
                    }
                } catch (err) {
                    reject({ result: "http_status_", correlationId: msg.correlationId, report: "Received '" + err + "'; response was '" });
                }
            })

            return promise
        }
    }

    return ({
        getVersion,
        getCertificateChain,
        getIdData,
        getCertificate,
        sign,
        auth,
        stop
    })
}