import { isChromeExtensionDetected } from "./detect";
import { getEIDLinkExtensionStrategy, getDefaultStrategy } from "./strategies/index.js";

export const controller = (() => {

    let strategy

    const initSignStrategy = () => {
        if (isChromeExtensionDetected()) {
            console.log("ChromeExt - Chrome extension detected");
            return getEIDLinkExtensionStrategy();
        }
        //todo firefox strategy
        //todo safari strategy
        return getDefaultStrategy()
    }

    const getInstance = () => {
        if (!strategy) {
            strategy = initSignStrategy()
        }
        return strategy
    }

    const getNewInstance = () => {
        console.log("get New instance")
        strategy = initSignStrategy()
        return strategy
    }
    return {
        getInstance,
        getNewInstance
    }
})()