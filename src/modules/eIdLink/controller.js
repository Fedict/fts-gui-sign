import { isChromeExtensionDetected } from "./detect";
import { getEIDLinkExtensionStrategy, getDefaultStrategy } from "./strategies/index.js";

export const controller = (() => {

    let strategy

    const initSignStrategy = () => {
        if (isChromeExtensionDetected()) {
            //console.log("ChromeExt - Chrome extension detected");
            return getEIDLinkExtensionStrategy();
        }
        return getDefaultStrategy()
    }

    /**
     * function that returns a object with the folowing functions :
    * - getVersion
    * - getCertificate
    * - getCertificateChain
    * - sign
    * - stop
     */
    const getInstance = () => {
        if (!strategy) {
            strategy = initSignStrategy()
        }
        return strategy
    }

    /**
     * function that creates a new strategy object and retuns the new object
     */
    const getNewInstance = () => {
        //console.log("get New instance")
        strategy = initSignStrategy()
        return strategy
    }

    return {
        getInstance,
        getNewInstance
    }
    
})()

