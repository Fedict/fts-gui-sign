import { createEIDLinkExtensionStrategy } from "./createEIDLinkExtensionStrategy";
import { createDefaultStrategy } from "./createDefaultStrategy";

export const getEIDLinkExtensionStrategy = () => {

    var api = new window.EIDChromeExt();
    var strategy = createEIDLinkExtensionStrategy(api);
    strategy.stop = function () {
        api.suspend();
    };
    return strategy;

}


export const getDefaultStrategy = () => {
    var strategy = createDefaultStrategy()
    return strategy
}