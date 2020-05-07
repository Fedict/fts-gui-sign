export const browser = {
    CHROME: "CHROME",
    FIREFOX: "FIREFOX",
    IE: "INTERNET EXPLORER",
    EDGE: "EDGE",
    SAFARI: "SAFARI",
    OPERA: "OPERA",
    OTHERS: "OTHERS"
}

export const getBrowser = () => {
    // CHROME
    if (navigator.userAgent.indexOf("Chrome") != -1) {
        return (browser.CHROME)
    }
    // FIREFOX
    else if (navigator.userAgent.indexOf("Firefox") != -1) {
        return (browser.FIREFOX)
    }
    // INTERNET EXPLORER
    else if (navigator.userAgent.indexOf("MSIE") != -1) {
        return (browser.IE)
    }
    // EDGE
    else if (navigator.userAgent.indexOf("Edge") != -1) {
        return (browser.EDGE)
    }
    // SAFARI
    else if (navigator.userAgent.indexOf("Safari") != -1) {
        return (browser.SAFARI)
    }
    // OPERA
    else if (navigator.userAgent.indexOf("Opera") != -1) {
        return (browser.OPERA)
    }
    // OTHERS
    else {
        return(browser.OTHERS)
    }
};

export const checkBrowserFunction = () =>{
    //TODO create check on browser featurs 
    // - FILE api
    
}