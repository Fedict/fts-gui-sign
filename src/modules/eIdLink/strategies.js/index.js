import { createEIDLinkExtentionStrategy } from "./createEIDLinkExtentionStrategy";
import { createDefaultStrategy } from "./createDefaultStrategy";

export const getEIDLinkExtentionStrategy = () => {

    var api = new window.EIDChromeExt();
    var strategy = createEIDLinkExtentionStrategy(api);
    strategy.stop = function () {
        api.suspend();
    };
    return strategy;

}


export const getDefaultStrategy = () => {
    var strategy = createDefaultStrategy()
    return strategy
}