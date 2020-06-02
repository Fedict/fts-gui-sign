import { OS, getOS } from "./OSDetection";

describe("tests of BrowserDetection", () => {

    beforeAll(() => {
        Object.defineProperty(window.navigator, "appVersion", ((value) => ({
            get() { return value; },
            set(v) { value = v; }
        }))(window.navigator["appVersion"]));
    })
    test("detects Windows based on navigator.appVersion string", () => {
        const navigatorappVersionString = "Windows"

        window.navigator.appVersion = navigatorappVersionString
        const result = getOS()

        expect(result).toEqual(OS.WINDOWS)
    })

    test("detects MAC based on navigator.appVersion string", () => {
        const navigatorappVersionString = "Mac OS"

        window.navigator.appVersion = navigatorappVersionString
        const result = getOS()

        expect(result).toEqual(OS.MACOS)
    })
    test("detects linux on navigator.appVersion string", () => {
        const navigatorappVersionString = "Linux"

        window.navigator.appVersion = navigatorappVersionString
        const result = getOS()

        expect(result).toEqual(OS.LINUX)
    })

    



})