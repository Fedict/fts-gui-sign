import * as navigation from "../../wizard/actions/WizardActions"
import { navigateToStep } from "../../wizard/actions/WizardActions"
import { navigateToSign } from "./WizardLogicActions"
import {  WIZARD_STATE_PIN_INPUT, WIZARD_STATE_SIGNING_PRESIGN_LOADING } from "../../wizard/wizard/WizardConstants"


const ORIGINAL_navigateToStep = navigateToStep

describe("Pinpad support", () => {

    beforeEach(() => {
        navigation.navigateToStep = jest.fn()

        // Object.defineProperty(window, 'configData', {BEurl: ""})
        global.window.configData = { BEurl: "" }
    })
    test("navigateToSign : navigation to pinpad page", () => {
        const store = {
            certificate: {
                certificateSelected: {
                    readerType: "pinpad"
                }
            }
        }

        const dispatch = jest.fn()
        const getStore = () => { return store }

        navigateToSign()(dispatch, getStore)

        expect(navigation.navigateToStep.mock.calls.length).toBe(1)
        expect(navigation.navigateToStep.mock.calls[0][0]).toBe(WIZARD_STATE_SIGNING_PRESIGN_LOADING)

        expect(dispatch.mock.calls.length).toBe(2)

    })

    test("navigateToSign : navigation to pin input page", () => {
        const store = {
            certificate: {
                certificateSelected: {
                    readerType: "noPinpad"
                }
            }
        }

        const dispatch = jest.fn()
        const getStore = () => { return store }

        navigateToSign()(dispatch, getStore)

        expect(navigation.navigateToStep.mock.calls.length).toBe(1)
        expect(navigation.navigateToStep.mock.calls[0][0]).toBe(WIZARD_STATE_PIN_INPUT)
        expect(dispatch.mock.calls.length).toBe(1)
    })

    afterEach(() => {
        navigation.navigateToStep = ORIGINAL_navigateToStep
    })
})