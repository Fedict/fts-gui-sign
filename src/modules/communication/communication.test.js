import { getsigningProfileId, createBody } from "./communication";

describe("getsigningProfileId", () => {
    beforeAll(() => {
        Object.defineProperty(window, "configData", ((value) => ({
            get() { return value; },
            set(v) { value = v; }
        }))(window.configData));

        window.configData = {
            defaultSigningProfileId: "XADES_1",
            signingProfileIds: {
                "application/pdf": "PADES_1",
                "application/xml": "XADES_1",
                "text/xml": "XADES_1"
            },
        }
    })



    test("getsigningProfileId returns correct signingprofileId based on MIME-type", () => {
        const expected = "PADES_1"
        const result = getsigningProfileId("application/pdf");

        expect(result).toEqual(expected)
    })
    test("getsigningProfileId returns default signingprofileId", () => {
        const expected = "XADES_1"
        const result = getsigningProfileId("does not exists");

        expect(result).toEqual(expected)
    })
})


describe("createBody", () => {
    beforeAll(() => {
        beforeAll(() => {
            Object.defineProperty(window, "configData", ((value) => ({
                get() { return value; },
                set(v) { value = v; }
            }))(window.configData));

            window.configData = {
                defaultSigningProfileId: "XADES_1",
                signingProfileIds: {
                    "application/pdf": "PADES_1",
                    "application/xml": "XADES_1",
                    "text/xml": "XADES_1"
                },
            }
        })
    })

    test("createBody places objects on the correct place in object", () => {
        const startCertificateObject = {
            certificateChain: [
                { encodedCertificate: "certificatestring" },
                { encodedCertificate: "certificatestring" }
            ],
            signingCertificate: { encodedCertificate: "certificatestring" }
        }
        const startDocumentName = "name of the file"
        const startDocumentBase64 = "base64 string odf document"
        const startDocumentType = "application/xml"
        const expected = {
            "clientSignatureParameters": {
                "certificateChain": startCertificateObject.certificateChain,
                "detachedContents": [],
                "signingCertificate": startCertificateObject.certificate,
                "signingDate": "2020-04-06T09:45:44",
            },
           
            "signingProfileId": "XADES_1",
            "toSignDocument": {
                "bytes": startDocumentBase64,
                // "digestAlgorithm": "SHA256",
                "name": startDocumentName
            }

        }

        const result = createBody(startCertificateObject, startDocumentName, startDocumentBase64, startDocumentType)

        expect(result).toEqual(expected)
    })

})