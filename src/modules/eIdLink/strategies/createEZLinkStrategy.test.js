import { createEIDLinkExtensionStrategy } from "./createEIDLinkExtensionStrategy"

describe("unit tests for createEIDLinExtensionStrategy", () => {

    describe("tests for getVersion", () => {

        let api = { checkVersion: () => { } }

        test("createEIDLinkExtensionStrategy returns function getVersion", () => {
            const result = createEIDLinkExtensionStrategy(api)

            expect(result).toBeTruthy();
            expect(result.getVersion).toBeTruthy();
            expect(typeof result.getVersion).toBe("function")
        })

        describe("onCorrectVersion", () => {

            test("onCorrectVersion is valid function", () => {
                const value = 'testvalue'
                api.checkVersion = jest.fn((minimumVersion, onCorrectVersion, onNotInstalled, onNeedsUpdate) => { onCorrectVersion(value) })
                const onMock = jest.fn()

                const strategy = createEIDLinkExtensionStrategy(api)
                strategy.getVersion(null, onMock, null, null)

                expect(onMock.mock.calls.length).toBe(1);
                expect(onMock.mock.calls[0][0]).toEqual(value)
            })

            test("onCorrectVersion is NOT valid function", () => {
                const value = 'testvalue'
                api.checkVersion = jest.fn((minimumVersion, onCorrectVersion, onNotInstalled, onNeedsUpdate) => { onCorrectVersion(value) })
                const onMock1 = "not a function"
                const onMock2 = undefined
                const onMock3 = null

                const strategy = createEIDLinkExtensionStrategy(api)
                strategy.getVersion(null, onMock1, null, null)
                strategy.getVersion(null, onMock2, null, null)
                strategy.getVersion(null, onMock3, null, null)

            })


        })

        describe("onNotInstalled", () => {

            test("onNotInstalled is valid function", () => {
                const value = 'testvalue'
                api.checkVersion = jest.fn((minimumVersion, onCorrectVersion, onNotInstalled, onNeedsUpdate) => { onNotInstalled(value) })
                const onMock = jest.fn()

                const strategy = createEIDLinkExtensionStrategy(api)
                strategy.getVersion(null, null, onMock, null)

                expect(onMock.mock.calls.length).toBe(1);
                expect(onMock.mock.calls[0][0]).toEqual(value)
            })

            test("onCorrectVersion is NOT valid function", () => {
                const value = 'testvalue'
                api.checkVersion = jest.fn((minimumVersion, onCorrectVersion, onNotInstalled, onNeedsUpdate) => { onNotInstalled(value) })
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

            test("onNeedsUpdate is valid function", () => {
                const value = 'testvalue'
                api.checkVersion = jest.fn((minimumVersion, onCorrectVersion, onNotInstalled, onNeedsUpdate) => { onNeedsUpdate(value) })
                const onMock = jest.fn()

                const strategy = createEIDLinkExtensionStrategy(api)
                strategy.getVersion(null, null, null, onMock)

                expect(onMock.mock.calls.length).toBe(1);
                expect(onMock.mock.calls[0][0]).toEqual(value)
            })

            test("onCorrectVersion is NOT valid function", () => {
                const value = 'testvalue'
                api.checkVersion = jest.fn((minimumVersion, onCorrectVersion, onNotInstalled, onNeedsUpdate) => { onNeedsUpdate(value) })
                const onMock1 = "not a function"
                const onMock2 = undefined
                const onMock3 = null

                const strategy = createEIDLinkExtensionStrategy(api)
                strategy.getVersion(null, null, null, onMock1)
                strategy.getVersion(null, null, null, onMock2)
                strategy.getVersion(null, null, null, onMock3)

            })


        })
    })


    describe("tests for getInfo", () => {
        let api = { getInfo: () => { } }

        test("createEIDLinkExtensionStrategy returns function getInfo", () => {
            const result = createEIDLinkExtensionStrategy(api)

            expect(result).toBeTruthy();
            expect(result.getInfo).toBeTruthy();
            expect(typeof result.getInfo).toBe("function")
        })

    })

    describe("tests for getCertificate", () => {
        let api = { getUserCertificates: () => { } }

        test("createEIDLinkExtensionStrategy returns function getInfo", () => {
            const result = createEIDLinkExtensionStrategy(api)

            expect(result).toBeTruthy();
            expect(result.getCertificate).toBeTruthy();
            expect(typeof result.getCertificate).toBe("function")
        })

    })

    describe("tests for getCertificateChain", () => {
        let api = { getUserCertificateChain: () => { } }

        test("createEIDLinkExtensionStrategy returns function getInfo", () => {
            const result = createEIDLinkExtensionStrategy(api)

            expect(result).toBeTruthy();
            expect(result.getCertificateChain).toBeTruthy();
            expect(typeof result.getCertificateChain).toBe("function")
        })

    })

    describe("tests for sign", () => {
        let api = { sign: () => { } }

        test("createEIDLinkExtensionStrategy returns function getInfo", () => {
            const result = createEIDLinkExtensionStrategy(api)

            expect(result).toBeTruthy();
            expect(result.sign).toBeTruthy();
            expect(typeof result.sign).toBe("function")
        })

    })
})