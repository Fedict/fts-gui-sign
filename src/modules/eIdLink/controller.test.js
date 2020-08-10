import { isChromeExtensionDetected } from "./detect";
import { getEIDLinkExtensionStrategy, getDefaultStrategy } from "./strategies/index.js";

import * as detect from './detect'
import * as strategy from './strategies/index.js'
import { controller } from "./controller";

const ORIGINAL_isChromeExtensionDetected = isChromeExtensionDetected
const ORIGINAL_getEIDLinkExtensionStrategy = getEIDLinkExtensionStrategy
const ORIGINAL_getDefaultStrategy = getDefaultStrategy

describe("controller tests", () => {

    beforeEach(() => {
        detect.isChromeExtensionDetected = jest.fn(() => true);
        strategy.getEIDLinkExtensionStrategy = jest.fn(() => {
            return {
                getVersion: () => { },
                getCertificate: () => { },
                getCertificateChain: () => { },
                sign: () => { },
                stop: () => { }
            }
        });
        strategy.getDefaultStrategy = jest.fn(() => {
            return {
                getVersion: () => { },
                getCertificate: () => { },
                getCertificateChain: () => { },
                sign: () => { },
                stop: () => { }
            }
        });

    })
    test("controller returns correct functions", () => {
        const result = controller
        expect(result.instance).toBeFalsy();
        expect(result.getInstance).toBeTruthy();
        expect(typeof result.getInstance).toEqual('function');
        expect(result.getNewInstance).toBeTruthy();
        expect(typeof result.getNewInstance).toEqual('function');
    })
    test("controller getInstance returns EIDlinkStrategy when isChromeExtensionDetected is true ", () => {
        detect.isChromeExtensionDetected = jest.fn(() => true);
        const result = controller;
        result.getNewInstance()
        expect(strategy.getEIDLinkExtensionStrategy).toBeCalledTimes(1)
        expect(strategy.getDefaultStrategy).toBeCalledTimes(0)
    })
    test("controller getInstance returns DefaultStrategy when isChromeExtensionDetected is false ", () => {
        detect.isChromeExtensionDetected = jest.fn(() => false);
        const result = controller;
        result.getNewInstance()
        expect(strategy.getEIDLinkExtensionStrategy).toBeCalledTimes(0)
        expect(strategy.getDefaultStrategy).toBeCalledTimes(1)
    })
    test("controller getInstance doen't create new instance of object ", () => {
        detect.isChromeExtensionDetected = jest.fn(() => true);
        const result = controller;
        const resultStrategy1 = result.getNewInstance()
        const resultStrategy2 = result.getInstance()
        expect(resultStrategy1).toBe(resultStrategy2)
        expect(resultStrategy2).toBe(resultStrategy1)
        expect(strategy.getEIDLinkExtensionStrategy).toBeCalledTimes(1)
    })
    test("controller getNewInstance create new instance of object ", () => {
        detect.isChromeExtensionDetected = jest.fn(() => true);
        const result = controller;
        const resultStrategy1 = result.getNewInstance()
        const resultStrategy2 = result.getNewInstance()
        expect(resultStrategy1).not.toBe(resultStrategy2)
        expect(resultStrategy2).not.toBe(resultStrategy1)
        expect(strategy.getEIDLinkExtensionStrategy).toBeCalledTimes(2)
    })

    afterEach(() => {
        detect.isChromeExtensionDetected = ORIGINAL_isChromeExtensionDetected
        strategy.getEIDLinkExtensionStrategy = ORIGINAL_getEIDLinkExtensionStrategy
        strategy.getDefaultStrategy = ORIGINAL_getDefaultStrategy
    })
})