import { MESSAGE_SET_ERROR } from "../../message/actions/MessageActions"
import { createEIDLinkExtensionStrategy, isUptodate } from "./createEIDLinkExtensionStrategy"

describe("unit tests for createEIDLinExtensionStrategy", () => {

    describe("tests for getVersion", () => {

        let api = { getVersion: () => { } }

        test("createEIDLinkExtensionStrategy returns function getVersion", () => {
            const result = createEIDLinkExtensionStrategy(api)

            expect(result).toBeTruthy();
            expect(result.getVersion).toBeTruthy();
            expect(typeof result.getVersion).toBe("function")
        })

        describe("onCorrectVersion", () => {

            test("onCorrectVersion is valid function", async () => {
                const value = {version:"2.0"}
                api.getVersion = jest.fn(()=>{return new Promise((resolve, reject) => {
                    resolve({version:"2.0"})
                })})
                const onMock = jest.fn()

                const strategy = createEIDLinkExtensionStrategy(api)
                strategy.getVersion("2.0", onMock, null, null)

                await new Promise(process.nextTick);

                expect(onMock.mock.calls.length).toBe(1);
                expect(onMock.mock.calls[0][0]).toEqual(value)
            })

            test("onCorrectVersion is NOT valid function", () => {
                const value = 'testvalue'
                api.getVersion = jest.fn().mockResolvedValue({ version:"2.0"})
                const onMock1 = "not a function"
                const onMock2 = undefined
                const onMock3 = null

                const strategy = createEIDLinkExtensionStrategy(api)
                strategy.getVersion("2.0", onMock1, null, null)
                strategy.getVersion("2.0", onMock2, null, null)
                strategy.getVersion("2.0", onMock3, null, null)

            })
        })

        describe("onNotInstalled", () => {

            test("onNotInstalled is valid function", async () => {
                const value = 'testvalue'
                api.getVersion = jest.fn().mockRejectedValue(value)
                const onMock = jest.fn()

                const strategy = createEIDLinkExtensionStrategy(api)
                strategy.getVersion(null, null, onMock, null)

                await new Promise(process.nextTick);

                expect(onMock.mock.calls.length).toBe(1);
                expect(onMock.mock.calls[0][0]).toEqual(undefined)
            })

            test("onCorrectVersion is NOT valid function", () => {
                const value = 'testvalue'
                api.getVersion = jest.fn(()=>{return new Promise((resolve, reject) => {
                    //reject ({message : 'unsupported_reader', report : 'Card error from mock'})
                    resolve({version:"2.0"})
                })})
                const onMock1 = "not a function"
                const onMock2 = undefined
                const onMock3 = null

                const strategy = createEIDLinkExtensionStrategy(api)
                strategy.getVersion(null, null, onMock1, null)
                strategy.getVersion(null, null, onMock2, null)
                strategy.getVersion(null, null, onMock3, null)

            })
        })

        describe("onNeedsUpdate", () => {

            test("onNeedsUpdate is valid function", async () => {
                const value = {version:"2.0"}
                api.getVersion = jest.fn(()=>{return new Promise((resolve, reject) => {
                    resolve({version:"2.0"})
                })})
                const onMock = jest.fn()

                const strategy = createEIDLinkExtensionStrategy(api)
                strategy.getVersion("3.0", null, null, onMock)
                
                await new Promise(process.nextTick);

                expect(onMock.mock.calls.length).toBe(1);
                expect(onMock.mock.calls[0][0]).toEqual(value)
            })

            test("onCorrectVersion is NOT valid function", () => {
                const value = 'testvalue'
                api.getVersion = jest.fn().mockResolvedValue({ version:"2.0"}) 
                const onMock1 = "not a function"
                const onMock2 = undefined
                const onMock3 = null

                const strategy = createEIDLinkExtensionStrategy(api)
                strategy.getVersion("3.0", null, null, onMock1)
                strategy.getVersion("3.0", null, null, onMock2)
                strategy.getVersion("3.0", null, null, onMock3)

            })
        })

        describe("isUpToDate", () => {

            test("isUpToDate 2.1 vs 2.0", async () => {
                expect(isUptodate("2.1", "2.0")).toBe(false);
            })
            test("isUpToDate 2.0 vs 2.5", async () => {
                expect(isUptodate("2.0", "2.5")).toBe(true);
            })

            test("isUpToDate 2.0 vs 2.10", async () => {
                expect(isUptodate("2.0", "2.10")).toBe(true);
            })

            test("isUpToDate 3.2 vs 10.1", async () => {
                expect(isUptodate("3.2", "10.1")).toBe(true);
            })
        })
    })

    describe("tests for getCertificate", () => {
        let api = { getUserCertificates: () => { } }

        test("createEIDLinkExtensionStrategy returns function getCertificate ", () => {
            const result = createEIDLinkExtensionStrategy(api)

            expect(result).toBeTruthy();
            expect(result.getCertificate).toBeTruthy();
            expect(typeof result.getCertificate).toBe("function")
        })
    })

    describe("tests for getCertificateChain", () => {
        let api = { getUserCertificateChain: () => { } }

        test("createEIDLinkExtensionStrategy returns function getCertificateChain", () => {
            const result = createEIDLinkExtensionStrategy(api)

            expect(result).toBeTruthy();
            expect(result.getCertificateChain).toBeTruthy();
            expect(typeof result.getCertificateChain).toBe("function")
        })
    })

    describe("tests for sign", () => {
        let api = { sign: () => { } }

        test("createEIDLinkExtensionStrategy returns function sign", () => {
            const result = createEIDLinkExtensionStrategy(api)

            expect(result).toBeTruthy();
            expect(result.sign).toBeTruthy();
            expect(typeof result.sign).toBe("function")
        })
    })
})