export const OS = {
    WINDOWS: "Windows",
    MACOS: "MacOS",
    LINUX: "Linux",
    UNIX: "UNIX",
    OTHER: "other"
}
export const getOS = () => {
    if (navigator.appVersion.indexOf("Win") !== -1) {
        return OS.WINDOWS
    }
    if (navigator.appVersion.indexOf("Mac") !== -1) {
        return OS.MACOS
    }
    if (navigator.appVersion.indexOf("Linux") !== -1) {
        return OS.LINUX
    }
    return OS.OTHER
}

const browserIsAccepted = () => {
    const usedOS = getOS;
    if (usedOS === OS.OTHER) {
        return false
    }
    return true
}