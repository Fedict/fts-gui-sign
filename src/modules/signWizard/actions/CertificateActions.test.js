import { saveCertificateList, CERTIFICATE_SAVE_LIST, selectCertificate, CERTIFICATE_SELECT_CERTIFICATE } from "./CertificateActions"

describe("CertificateActions", () => {

    describe("saveCertificateList", () => {

        test("saveCertificateList returns a action with type CERTIFICATE_SAVE_LIST and payload certificateList", () => {
            const payload = { test: "object" }
            const result = saveCertificateList(payload)

            expect(result.type).toBe(CERTIFICATE_SAVE_LIST)
            expect(result.payload).toEqual(payload)
        })
    })

    describe("saveCertificateList", () => {
        
        test("selectCertificate returns a action with type CERTIFICATE_SELECT_CERTIFICATE and payload certificate", () => {
            const payload = { test: "object" }
            const result = selectCertificate(payload)

            expect(result.type).toBe(CERTIFICATE_SELECT_CERTIFICATE)
            expect(result.payload).toEqual(payload)
        })
    })
})