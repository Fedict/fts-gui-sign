const { createActiveXEIDLinkStrategy } = require("./createActiveXEIDLinkStrategy")
function flushPromises() {
    return new Promise(resolve => setImmediate(resolve));
}
describe("unit tests for createActiveXEIDLinkStrategy", () => {

    beforeEach(() => {
        document.DemoActiveX = {
            sendNativeMessage: jest.fn((msg) => {
                const message = JSON.parse(msg)
                return JSON.stringify({ version: "0.0.0", correlationId: message.correlationId, result: "OK" })
            })
        }
    })

    describe("tests for getVersion", () => {

        test('getVersion calls DemoActiveX.sendNativeMessage with opperation VERSION', () => {
            const eIDLink = createActiveXEIDLinkStrategy()
            eIDLink.getVersion("0.0.0", () => { }, () => { }, () => { })

            expect(document.DemoActiveX.sendNativeMessage).toBeCalledTimes(1)
            expect(typeof document.DemoActiveX.sendNativeMessage.mock.calls[0][0]).toEqual("string")
            const callMassage = JSON.parse(document.DemoActiveX.sendNativeMessage.mock.calls[0][0])
            expect(callMassage.operation).toEqual('VERSION')
            expect(callMassage.correlationId).toBeTruthy()
        })

        test('getVersion calls onSuccess if the minimum version is smaller than the returned version', async () => {
            document.DemoActiveX = {
                sendNativeMessage: jest.fn((msg) => {
                    const message = JSON.parse(msg)
                    const returnValue = {
                        version: "5.5.0",
                        correlationId: message.correlationId,
                        result: 'OK'
                    }

                    return JSON.stringify(returnValue)
                })
            }
            const eIDLink = createActiveXEIDLinkStrategy()
            const mockOnSucces = jest.fn()
            eIDLink.getVersion("1.0.0", mockOnSucces, () => { }, () => { })

            await flushPromises()
            expect(mockOnSucces).toBeCalledTimes(1)
        })

        test('getVersion calls onNotInstalled if there is a error', async () => {
            document.DemoActiveX = {
                sendNativeMessage: jest.fn((msg) => {
                    const message = JSON.parse(msg)
                    const returnValue = {
                        result: 'NOTOK',
                        correlationId: message.correlationId,
                    }

                    return JSON.stringify(returnValue)
                })
            }
            const eIDLink = createActiveXEIDLinkStrategy()
            const mockOnInstall = jest.fn()
            eIDLink.getVersion("1.0.0", () => { }, mockOnInstall, () => { })

            await flushPromises()
            expect(mockOnInstall).toBeCalledTimes(1)
        })

        test('getVersion calls onNeedsUpdate if the minimum version is bigger than the returned version', async () => {
            document.DemoActiveX = {
                sendNativeMessage: jest.fn((msg) => {
                    const message = JSON.parse(msg)
                    const returnValue = {
                        version: "0.5.0",
                        correlationId: message.correlationId,
                        result: 'OK'
                    }

                    return JSON.stringify(returnValue)
                })
            }
            const eIDLink = createActiveXEIDLinkStrategy()
            const mockOnUpdate = jest.fn()
            eIDLink.getVersion("1.0.0", () => { }, () => { }, mockOnUpdate)

            await flushPromises()
            expect(mockOnUpdate).toBeCalledTimes(1)
        })
    })

    describe("tests for getCertificateChain", () => {

        test("getCertificateChain calls DemoActiveX.sendNativeMessage with opperation CERTCHAIN and certificate", async () => {
            const eIDLink = createActiveXEIDLinkStrategy()

            const startCert = "certificateString"
            await eIDLink.getCertificateChain(null, null, startCert)
            await flushPromises()

            expect(document.DemoActiveX.sendNativeMessage).toBeCalledTimes(1)
            expect(typeof document.DemoActiveX.sendNativeMessage.mock.calls[0][0]).toEqual("string")
            const callMassage = JSON.parse(document.DemoActiveX.sendNativeMessage.mock.calls[0][0])
            expect(callMassage.operation).toEqual('CERTCHAIN')
            expect(callMassage.correlationId).toBeTruthy()
            expect(callMassage.cert).toEqual(startCert)
        })
    })

    describe("tests for sign", () => {

        test("sign calls DemoActiveX.sendNativeMessage with opperation SIGN and correct params", async () => {
            const eIDLink = createActiveXEIDLinkStrategy()

            const startLanguage = "en"
            const startMac = "mac"
            const startCert = "certificateString"
            const startAlgo = "algo"
            const startDigest = "digest"
            const startPin = "pin"
            await eIDLink.sign(startLanguage, startMac, startCert, startAlgo, startDigest, startPin)
            await flushPromises()

            expect(document.DemoActiveX.sendNativeMessage).toBeCalledTimes(1)
            expect(typeof document.DemoActiveX.sendNativeMessage.mock.calls[0][0]).toEqual("string")
            const callMassage = JSON.parse(document.DemoActiveX.sendNativeMessage.mock.calls[0][0])
            expect(callMassage.operation).toEqual('SIGN')
            expect(callMassage.correlationId).toBeTruthy()
            expect(callMassage.cert).toEqual(startCert)
            expect(callMassage.algo).toEqual(startAlgo)
            expect(callMassage.digest).toEqual(startDigest)
            expect(callMassage.pin).toEqual(startPin)
            expect(callMassage.language).toEqual(startLanguage)
            expect(callMassage.mac).toEqual(startMac)
        })
    })

    describe("tests for auth", () => {

        test("sign calls DemoActiveX.sendNativeMessage with opperation AUTH and correct params", async () => {
            const eIDLink = createActiveXEIDLinkStrategy()

            const startLanguage = "en"
            const startMac = "mac"
            const startCert = "certificateString"
            const startAlgo = "algo"
            const startDigest = "digest"
            const startPin = "pin"
            await eIDLink.auth(startLanguage, startMac, startCert, startAlgo, startDigest, startPin)
            await flushPromises()

            expect(document.DemoActiveX.sendNativeMessage).toBeCalledTimes(1)
            expect(typeof document.DemoActiveX.sendNativeMessage.mock.calls[0][0]).toEqual("string")
            const callMassage = JSON.parse(document.DemoActiveX.sendNativeMessage.mock.calls[0][0])
            expect(callMassage.operation).toEqual('AUTH')
            expect(callMassage.correlationId).toBeTruthy()
            expect(callMassage.cert).toEqual(startCert)
            expect(callMassage.algo).toEqual(startAlgo)
            expect(callMassage.digest).toEqual(startDigest)
            expect(callMassage.pin).toEqual(startPin)
            expect(callMassage.language).toEqual(startLanguage)
            expect(callMassage.mac).toEqual(startMac)
        })
    })

    describe("tests for getCertificate", () => {

        test("sign calls DemoActiveX.sendNativeMessage with opperation USERCERTS ", async () => {
            const eIDLink = createActiveXEIDLinkStrategy()

            const startCert = "certificateString"
            await eIDLink.getCertificate(null, null, startCert)
            await flushPromises()

            expect(document.DemoActiveX.sendNativeMessage).toBeCalledTimes(1)
            expect(typeof document.DemoActiveX.sendNativeMessage.mock.calls[0][0]).toEqual("string")
            const callMassage = JSON.parse(document.DemoActiveX.sendNativeMessage.mock.calls[0][0])
            expect(callMassage.operation).toEqual('USERCERTS')
            expect(callMassage.correlationId).toBeTruthy()
        })
    })
})