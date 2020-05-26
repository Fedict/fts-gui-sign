import { createEIDLinkExtensionStrategy } from "./createEIDLinkExtensionStrategy";
import { createDefaultStrategy } from "./createDefaultStrategy";

/**
 * function to get the strategy when eIDLink extention is active
 */
export const getEIDLinkExtensionStrategy = () => {

    var api = new window.EIDChromeExt();
    var strategy = createEIDLinkExtensionStrategy(api);
    strategy.stop = function () {
        api.suspend();
    };
    return strategy;

}

/**
 * function to get the strategy when eIDLink extention is not active
 * - getVersion
 * - getInfo
 * - getCertificate
 * - getCertificateChain
 * - sign
 * - stop
 */
export const getDefaultStrategy = () => {
    var strategy = createDefaultStrategy()
    return strategy
}