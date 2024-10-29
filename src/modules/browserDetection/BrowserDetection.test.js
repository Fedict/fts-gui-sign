import { getBrowserInfo, browser } from "./BrowserDetection"

const ORIGINAL_window = { ...window }

describe("tests of BrowserDetection", () => {

    beforeAll(() => {
        window.configData = { minBrowserVersions: { "FIREFOX" : 115, "EDGE": 0, "CHROMIUMEDGE": 0, "CHROME": 0, "SAFARI": 0 } }
        
        Object.defineProperty(window.navigator, "userAgent", ((value) => ({
            get() { return value; },
            set(v) { value = v; }
        }))(window.navigator["userAgent"]));
    })

    test("detects chrome based on navigator.userAgent string", () => {
        window.navigator.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"

        expect(getBrowserInfo().browser).toEqual(browser.CHROME)
    })

    test("detects IE based on navigator.userAgent string", () => {
        window.navigator.userAgent = "Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko"

        expect(getBrowserInfo().browser).toEqual(browser.IE)

        window.navigator.userAgent = "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)"

        expect(getBrowserInfo().browser).toEqual(browser.IE)
    })

    test("detects Edge based on navigator.userAgent string", () => {
        window.navigator.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/129.0.2792.79"

        expect(getBrowserInfo().browser).toEqual(browser.EDGE)

        window.navigator.userAgent = "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10136"

        expect(getBrowserInfo().browser).toEqual(browser.EDGE)

        window.navigator.userAgent = "mozilla/5.0 (windows nt 10.0; win64; x64) applewebkit/537.36 (khtml, like gecko) chrome/91.0.4472.101 safari/537.36 edg/91.0.864.48"

        expect(getBrowserInfo().browser).toEqual(browser.CHROMIUMEDGE)
    })

    test("detects fireFox based on navigator.userAgent string", () => {
        window.navigator.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0"

        expect(getBrowserInfo().browser).toEqual(browser.FIREFOX)
    })

    test("detects safari based on navigator.userAgent string", () => {
        window.navigator.userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"

        expect(getBrowserInfo().browser).toEqual(browser.SAFARI)
    })

    describe("browserIsAccepted", () => {

          test("browserIsAccepted will return true if browser is supported", () => {
            window.navigator.userAgent = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/115.0.1"

            expect(getBrowserInfo().accepted).toEqual(true)
        }) 

        test("browserIsAccepted will return false if browser not is supported", () => {
            window.navigator.userAgent = "doen not exists"

            expect(getBrowserInfo().accepted).toEqual(false)
        })
    })

    afterAll(() => {
        window = ORIGINAL_window
    })
})