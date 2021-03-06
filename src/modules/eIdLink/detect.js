/** 
 * function that checks if the eIDLink is active
 */
export const isChromeExtensionDetected = () => {
    return "EIDChromeExt" in window;
}

/** 
 * function that checks if the activeX extension is active
 */
export const isActiveXControlDetected = () => {
    console.log("activeX", document.DemoActiveX)
    try {
        var obj = document.DemoActiveX;
        if (obj) {
            console.log("activeX", obj.IsPresent)
            return obj.IsPresent();
        }
    } catch (ex) {
        console.log("eIDLink ActiveX control not in window");
    }
    return false;
}