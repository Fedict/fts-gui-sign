//TODO create timeout system

import { createEZLinkStrategy } from "./createEZLinkStrategy";
import { createDefaultStrategy } from "./createDefaultStrategy";

export const getEIDLinkExtentionStrategy = () => {

    var api = new window.EIDChromeExt();
    var strategy = createEZLinkStrategy(api);
    strategy.stop = function () {
        api.suspend();
    };
    return strategy;

}


export const getDefaultStrategy = () => {
    console.log("deze word gegenereerd")
    var strategy = createDefaultStrategy()
    return strategy
}