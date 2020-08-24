import { isChromeExtensionDetected } from "./detect"

const ORIGINAL_window = { ...window }

describe("isChromeExtensionDetected ", () => {

    test('isChromeExtensionDetected fails', () => {
        const result = isChromeExtensionDetected()

        expect(result).toBe(false)
    })

    test('isChromeExtensionDetected success', () => {
        Object.defineProperty(window, "EIDChromeExt", ((value) => ({
            get() { return value; },
            set(v) { value = v; }
        }))(window.EIDChromeExt));

        const result = isChromeExtensionDetected()

        expect(result).toBe(true)

        window = ORIGINAL_window
    })
})