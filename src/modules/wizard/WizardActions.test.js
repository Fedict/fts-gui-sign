import {
    navigateToStep,
    WIZARD_CHANGE_STATE,
} from "./WizardActions"


describe("WizardActions", () => {
    
    describe("navigateToStep", () => {

        test("navigateToStep returns a action with type WIZARD_CHANGE_STATE and payload action", () => {
            const payload = "wizard step string"
            const result = navigateToStep(payload)[1]

            expect(result.type).toBe(WIZARD_CHANGE_STATE)
            expect(result.payload).toEqual(payload)
        })
    })
})