//TODO create timeout system

import { createEZLinkStrategy } from "./createEZLinkStrategy";

export const createChromeEZLinkStrategy = () => {

    var api = new window.EIDChromeExt();
    var strategy = createEZLinkStrategy(api);
    strategy.stop = function () {
        api.suspend();
    };
    return strategy;

}


