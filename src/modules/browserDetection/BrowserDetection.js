/**
 * Enum variable with values for all browsers
 */
export const browser = {
    CHROME: "CHROME",
    FIREFOX: "FIREFOX",
    IE: "INTERNET EXPLORER",
    EDGE: "EDGE",
    SAFARI: "SAFARI",
    OPERA: "OPERA",
    OTHERS: "OTHERS"
}

/**
 * Function to determine the used browser based on navigator.userAgent string.
 * will see a chromium version of opera as chrome
 * @return {string} Returns a string with a value out of browser enum
 */
export const getBrowser = () => {
    // CHROME
    if (navigator.userAgent.indexOf("Chrome") !== -1) {
        return (browser.CHROME)
    }
    // FIREFOX
    else if (navigator.userAgent.indexOf("Firefox") !== -1) {
        return (browser.FIREFOX)
    }
    // INTERNET EXPLORER
    else if (navigator.userAgent.indexOf("MSIE") !== -1) {
        return (browser.IE)
    }
    else if (navigator.userAgent.indexOf("Trident/") !== -1) {
        return (browser.IE)
    }
    // EDGE
    else if (navigator.userAgent.indexOf("Edge") !== -1) {
        return (browser.EDGE)
    }
    // SAFARI
    else if (navigator.userAgent.indexOf("Safari") !== -1) {
        return (browser.SAFARI)
    }
    // OPERA
    else if (navigator.userAgent.indexOf("Opera") !== -1) {
        return (browser.OPERA)
    }
    // OTHERS
    else {
        return (browser.OTHERS)
    }
};

/**
 * Function to test if the browser is compatible
 * 
 * @return {boolean} boolean that represents if browser is supported 
 */
export const browserIsAccepted = () => {

    const usedBrowser = getBrowser()

    if (usedBrowser !== browser.IE
        && usedBrowser !== browser.EDGE
        && usedBrowser !== browser.FIREFOX
        && usedBrowser !== browser.SAFARI
        && usedBrowser !== browser.CHROME) {
        return false
    }
    return true
}


