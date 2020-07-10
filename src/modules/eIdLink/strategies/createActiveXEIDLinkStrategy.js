

export const createActiveXEIDLinkStrategy = () => {
    let pendingPromises = {}

    const isUptodate = (minimumVersion, installedVersion) => {
        var expected = minimumVersion.split(".");
        var actual = installedVersion.split(".");
        return (actual[0] > expected[0]) || (actual[0] === expected[0] && actual[1] >= expected[1]);
    }

    const getVersion = function (minimumVersion, onSuccess, onNotInstalled, onNeedsUpdate) {
        messagePromise({ operation: 'VERSION' }).then(
            function (msg) {
                var installedVersion = msg.version;
                console.log("eaZyLink version is " + installedVersion);

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


    const getCertificateChain = function (language, mac) {
        console.log("Getting certificate chain");
        return messagePromise({ operation: 'USERCERTS ', mac: mac });
    }

    const sign = function (language, mac, cert, algo, digest, pin) {
        console.log(pin ? "Signing with PIN" : "Signing with pinpad");
        return messagePromise({ operation: 'SIGN', cert: cert, algo: algo, digest: digest, pin: pin, language: language, mac: mac });
    }


    const getCertificate = function (language, mac) {
        console.log("Reading user certificates");
        return messagePromise({ operation: 'USERCERTS', language: language, mac: mac });
    };

  




    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }


    const messagePromise = (msg) => {
        if(msg) {
            const correlationId = guid()

            msg.correlationId = correlationId
            console.log(JSON.stringify(msg))
            pendingPromises[correlationId] = true
            const promise = new Promise((resolve, reject) => {

                try {
                    var obj = document.DemoActiveX;
                    if (obj) {
                        console.log(JSON.stringify(msg))
                        const response = obj.SayHello(JSON.stringify(msg));
                        const responseJson = JSON.parse(response)
                        console.log("Processing reply from eazylink : " + JSON.stringify(responseJson));

                        if (responseJson.correlationId) {

                            var p = pendingPromises[msg.correlationId];
                            if (!p) {
                                console.log("No pending promise found, ignoring eaZyLink reply");
                                return;
                            }

                            delete pendingPromises[msg.correlationId];

                            if (responseJson.result === "OK") {
                                resolve(responseJson);
                            }
                            // else if (typeof cardTypeRequested !== undefined && msg.cardtype !== undefined && cardTypeRequested !== msg.cardtype) {
                            //     reject(
                            //         {
                            //             message: "wrong_card_type",
                            //             report: responseJson.report
                            //         }
                            //     );
                            // } 
                            else {
                                reject(
                                    {
                                        message: responseJson.result,
                                        report: responseJson.report
                                    }
                                );
                            }
                        } else {
                            console.log("Ignoring message without correlationId");
                        }
                    }
                } catch (err) {
                    var report = "Received '" + err + "' from eaZyLink for operation " + msg.operation + "; responseText was '"
                    reject({ result: "http_status_", correlationId: msg.correlationId, report: "Received '" + err + "'; response was '" });
                }

            })

            return promise
        }
    }


    return ({
        getVersion: getVersion,
        getCertificateChain,
        getCertificate,
        sign

    })


}