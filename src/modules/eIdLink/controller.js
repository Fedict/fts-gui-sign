import { isChromeExtensionDetected } from "./detect";
import { createChromeEZLinkStrategy } from "./strategies.js";

export const controller = (() => {

    let strategie

    const initSignStrategy = () => {
        if (isChromeExtensionDetected()) {
            console.log("ChromeExt - Chrome extension detected");
            return createChromeEZLinkStrategy();
        }
        return {
            getVersion: () => { },
            getInfo: () => { },
            getCertificate: () => { },
            getCertificateChain: () => { },
            sign: () => { },
            stop: () => { }
        }
    }

    const getInstance = () => {
        if (!strategie) {
            strategie = initSignStrategy()
        }
        return strategie
    }

    return {
        getInstance
    }
})()