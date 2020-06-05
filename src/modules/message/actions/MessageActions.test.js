import { navigateToStep } from "../../wizard/WizardActions"
import * as wizardActions from '../../wizard/WizardActions'

const ORIGINAL_navigateToStep = navigateToStep

describe("MessageActions", () => {
    describe("action type constants", () => {
        test("all constanst are unique in the file", () => { })
    })
    describe("showErrorMessage", () => {
        test("showErrorMessage dispatches a action with type MESSAGE_SET_ERROR and payload messageObject", () => { })
        test("showErrorMessage dispatches navigate To Step WIZARD_STATE_MESSAGE", () => { })
    })

    describe("showInfoMessage", () => {
        test("showInfoMessage dispatches a action with type MESSAGE_SET_INFO and payload messageObject", () => { })
        test("showInfoMessage dispatches navigate To Step WIZARD_STATE_MESSAGE", () => { })
    })
})