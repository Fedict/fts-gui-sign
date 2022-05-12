/**
 * Enum variable with values for operating systems. 
 */
export const OS = {
    WINDOWS: "Windows",
    MACOS: "MacOS",
    LINUX: "Linux",
    UNIX: "UNIX",
    OTHER: "other"
}

/**
 * Function to determine the used OS based on navigator.appVersion string.
 * 
 * @return {string} Returns a string with a value out of os enum
 */
export const getOS = () => {
    // if(true && process.env.NODE_ENV === 'development'){
    //     return OS.LINUX
    // }
    if (navigator.appVersion.indexOf("Win") !== -1) {
        return OS.WINDOWS
    }
    if (navigator.appVersion.indexOf("Mac") !== -1) {
        return OS.MACOS
    }
    if (navigator.appVersion.indexOf("X11") !== -1) {
        return OS.LINUX
    }
    if (navigator.appVersion.indexOf("Linux") !== -1) {
        return OS.LINUX
    }
    return OS.OTHER
}

