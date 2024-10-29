/**
 * Enum variable with values for all browsers
 */
export const browser = {
    CHROME: "CHROME",
    FIREFOX: "FIREFOX",
    IE: "INTERNET EXPLORER",
    EDGE: "EDGE",
    CHROMIUMEDGE: "CHROMIUMEDGE",
    SAFARI: "SAFARI",
    OPERA: "OPERA",
    OTHERS: "OTHERS"
}

export const browserNames = {
    CHROME: "Chrome",
    CHROMIUMEDGE: "Edge (based on Chromium)",
    FIREFOX: "Firefox",
    OPERA: "Opera (based on Chromium)",
    EDGE: "Edge",
    SAFARI: "Safari"
}

export const getMinBrowserVersions = () => {
    return window && window.configData && window.configData.minBrowserVersions ? window.configData.minBrowserVersions : {};
}


const knownBrowsers = [
        { regex: /Firefox\/(\d+)\./,    browser: browser.FIREFOX },
        { regex: /MSIE\/(\d+)\./,       browser: browser.IE },
        { regex: /Trident\/(\d+)\./,    browser: browser.IE },
        { regex: /Edg\/(\d+)\./,        browser: browser.EDGE },
        { regex: /Edge\/(\d+)\./,       browser: browser.EDGE },
        { regex: /edg\/(\d+)\./,        browser: browser.CHROMIUMEDGE },
        { regex: /Chrome\/(\d+)\./,     browser: browser.CHROME },
        { regex: /Safari\/(\d+)\./,     browser: browser.SAFARI },
        { regex: /Opera\/(\d+)\./,      browser: browser.OPERA }
    ];

export const getBrowserInfo = () => {
    var i = 0;
    const ua = navigator.userAgent;
    while (i != knownBrowsers.length) {
        const bi = knownBrowsers[i++];
        var match = ua.match(bi.regex);
        if (match) {
            var minVersion = getMinBrowserVersions()[bi.browser];
            return { browser : bi.browser, version: match[1], accepted: minVersion != undefined && match[1] >= minVersion } 
        }
    }

    return { browser : browser.OTHERS , version: "0", accepted: false }
}
