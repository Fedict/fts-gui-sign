import { createDefaultStrategy } from "./createDefaultStrategy"

describe("unit tests for createDefaultStrategy", () => {

    describe("tests for getVersion", () => {

        let api = { checkVersion: () => { } }

        test("createDefaultStrategy returns function getVersion", () => {
            const result = createDefaultStrategy(api)

            expect(result).toBeTruthy();
            expect(result.getVersion).toBeTruthy();
            expect(typeof result.getVersion).toBe("function")
        })

        describe("onNoExtensionInstalled", () => {

            test("onNoExtensionInstalled is valid function", () => {
                const value = 'testvalue'
                const onMock = jest.fn()

                const strategy = createDefaultStrategy()
                strategy.getVersion(null, null, null, null, onMock)

                expect(onMock.mock.calls.length).toBe(1);
            })

            test("onCorrectVersion is NOT valid function", () => {
                const onMock1 = "not a function"
                const onMock2 = undefined
                const onMock3 = null

                const strategy = createDefaultStrategy()
                strategy.getVersion(null, null, null, null, onMock1)
                strategy.getVersion(null, null, null, null, onMock2)
                strategy.getVersion(null, null, null, null, onMock3)

            })


        })
    })




    describe("tests for getCertificate", () => {


        test("createDefaultStrategy returns function getCertificate", () => {
            const result = createDefaultStrategy()

            expect(result).toBeTruthy();
            expect(result.getCertificate).toBeTruthy();
            expect(typeof result.getCertificate).toBe("function")
        })

        test("getCertificate returns rejected promise", async () => {
            expect.assertions(1)
            const result = createDefaultStrategy()

            expect(result).toBeTruthy();

        })
    })



    describe("tests for getCertificateChain", () => {


        test("createDefaultStrategy returns function getCertificateChain", () => {
            const result = createDefaultStrategy()

            expect(result).toBeTruthy();
            expect(result.getCertificateChain).toBeTruthy();
            expect(typeof result.getCertificateChain).toBe("function")
        })

        test("getCertificateChain returns rejected promise", async () => {
            expect.assertions(4)
            const result = createDefaultStrategy()

            expect(result).toBeTruthy();
            expect(result.getCertificateChain).toBeTruthy();
            expect(typeof result.getCertificateChain).toBe("function")

            await result.getCertificateChain().catch(e => {
                expect(e).toBe("NO_EXTENSION_ACTIVE")

            })
        })

    })

    describe("tests for sign", () => {


        test("createDefaultStrategy returns function sign", () => {
            const result = createDefaultStrategy()

            expect(result).toBeTruthy();
            expect(result.sign).toBeTruthy();
            expect(typeof result.sign).toBe("function")
        })

        test("sign returns rejected promise", async () => {
            expect.assertions(4)
            const result = createDefaultStrategy()

            expect(result).toBeTruthy();
            expect(result.sign).toBeTruthy();
            expect(typeof result.sign).toBe("function")

            await result.sign().catch(e => {
                expect(e).toBe("NO_EXTENSION_ACTIVE")

            })
        })

    })
})