/** 
 * function that checks if the eIDLink is active
 */
export const isChromeExtensionDetected = () => {
    return "EIDChromeExt" in window;
}