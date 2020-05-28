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
 * Function to determine the used os based on navigator.appVersion string.
 * 
 * @return {string} Returns a string with a value out of os enum
 */
export const getOS = () => {
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

/**
 * Function to test if the os is compatible
 * 
 * @return {boolean} boolean that represents if os is supported 
 */
export const OSIsAccepted = () => {
    const usedOS = getOS;
    if (usedOS === OS.OTHER) {
        return false
    }
    return true
}