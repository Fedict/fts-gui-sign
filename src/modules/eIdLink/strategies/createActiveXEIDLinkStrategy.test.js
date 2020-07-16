const { textSpanContainsPosition } = require("typescript")

describe("unit tests for createActiveXEIDLinkStrategy", () => {

    beforeEach(() => {
        document.DemoActiveX = {
            SayHello: jest.fn()
        }
    })
    describe("general tests", () => {
        test("pendingRequests includes correlationId resolves correct response", ()=>{})
        test("pendingRequests doen't includes correlationId doesn't call callbacks", ()=>{})
        test("Request with a notOk response throws error", ()=>{})

    })
    describe("tests for getVersion", () => {
        test('getVersion calls DemoActiveX.SayHello with opperation VERSION', () => { })
        test('getVersion calls onSuccess if the minimum version is smaller than the returned version', () => { })
        test('getVersion calls onNotInstalled if there is a error', () => { })
        test('getVersion calls onNeedsUpdate if the minimum version is bigger than the returned version', () => { })
        describe("versionCheck tests", () => {
            const list = [
                ['1.0', '1.0', "onSucces"],
                ['2.0', '1.0', "onNeedsUpdate"],
                ['1.1', '1.0', "onNeedsUpdate"],
                ['1.0', '1.1', "onSucces"]
            ]
            test.each(list)("getVersion with minimum version %s return version %s calls %s",
                (minimumVersion, resultVersion, expectedResult) => { })
        })

        
    })

   

    describe("tests for getCertificate", () => { })

    describe("tests for getCertificateChain", () => { })

    describe("tests for sign", () => { })
})