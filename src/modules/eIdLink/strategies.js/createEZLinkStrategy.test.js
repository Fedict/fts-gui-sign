import { createEZLinkStrategy } from "./createEZLinkStrategy"

describe("unit tests for createEZLinkStrategy", () => {

    describe("tests for getVersion", () => {

        let api = { checkVersion: () => { } }

        test("createEZLinkStrategy returns function getVersion", () => {
            const result = createEZLinkStrategy(api)

            expect(result).toBeTruthy();
            expect(result.getVersion).toBeTruthy();
            expect(typeof result.getVersion).toBe("function")
        })

        describe("onCorrectVersion", () => {

            test("onCorrectVersion is valid function", () => {
                const value = 'testvalue'
                api.checkVersion = jest.fn((minimumVersion, onCorrectVersion, onNotInstalled, onNeedsUpdate) => { onCorrectVersion(value) })
                const onMock = jest.fn()

                const strategy = createEZLinkStrategy(api)
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

                const strategy = createEZLinkStrategy(api)
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

                const strategy = createEZLinkStrategy(api)
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

                const strategy = createEZLinkStrategy(api)
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

                const strategy = createEZLinkStrategy(api)
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

                const strategy = createEZLinkStrategy(api)
                strategy.getVersion(null, null, null, onMock1)
                strategy.getVersion(null, null, null, onMock2)
                strategy.getVersion(null, null, null, onMock3)

            })


        })
    })


    describe("tests for getInfo", () => {
        let api = { getInfo: () => { } }

        test("createEZLinkStrategy returns function getInfo", () => {
            const result = createEZLinkStrategy(api)

            expect(result).toBeTruthy();
            expect(result.getInfo).toBeTruthy();
            expect(typeof result.getInfo).toBe("function")
        })

    }) 
    
    describe("tests for getCertificate", () => {
        let api = { getUserCertificates: () => { } }

        test("createEZLinkStrategy returns function getInfo", () => {
            const result = createEZLinkStrategy(api)

            expect(result).toBeTruthy();
            expect(result.getCertificate).toBeTruthy();
            expect(typeof result.getCertificate).toBe("function")
        })

    })
    
    describe("tests for getCertificateChain", () => {
        let api = { getUserCertificateChain: () => { } }

        test("createEZLinkStrategy returns function getInfo", () => {
            const result = createEZLinkStrategy(api)

            expect(result).toBeTruthy();
            expect(result.getCertificateChain).toBeTruthy();
            expect(typeof result.getCertificateChain).toBe("function")
        })

    })
    
    describe("tests for sign", () => {
        let api = { sign: () => { } }

        test("createEZLinkStrategy returns function getInfo", () => {
            const result = createEZLinkStrategy(api)

            expect(result).toBeTruthy();
            expect(result.sign).toBeTruthy();
            expect(typeof result.sign).toBe("function")
        })

    })
})