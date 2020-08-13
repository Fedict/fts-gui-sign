import { getBrowser, browser } from "./BrowserDetection"

const ORIGINAL_window = { ...window }
describe("tests of BrowserDetection", () => {

    beforeAll(() => {
        Object.defineProperty(window.navigator, "userAgent", ((value) => ({
            get() { return value; },
            set(v) { value = v; }
        }))(window.navigator["userAgent"]));
    })

    test("detects chrome based on navigator.userAgent string", () => {
        const navigatorUserAgentString = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"

        window.navigator.userAgent = navigatorUserAgentString
        const result = getBrowser()

        expect(result).toEqual(browser.CHROME)
    })

    test("detects fireFox based on navigator.userAgent string", () => {
        const navigatorUserAgentString = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0"

        window.navigator.userAgent = navigatorUserAgentString
        const result = getBrowser()

        expect(result).toEqual(browser.FIREFOX)
    })
    
    test("detects safari based on navigator.userAgent string", () => {
        const navigatorUserAgentString = "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"

        window.navigator.userAgent = navigatorUserAgentString
        const result = getBrowser()

        expect(result).toEqual(browser.SAFARI)
    })

    afterAll(() => {
        window = ORIGINAL_window
    })
})