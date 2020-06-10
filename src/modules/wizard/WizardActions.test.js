import {
    navigateToStep,
    WIZARD_CHANGE_STATE,
    addRequestId,
    removeRequestId,
    WIZARD_REQUEST_ID_ADD,
    WIZARD_REQUEST_ID_REMOVE
} from "./WizardActions"


describe("WizardActions", () => {
    describe("navigateToStep", () => {
        test("navigateToStep returns a action with type WIZARD_CHANGE_STATE and payload action", () => {
            const payload = "wizard step string"
            const result = navigateToStep(payload)

            expect(result.type).toBe(WIZARD_CHANGE_STATE)
            expect(result.payload).toEqual(payload)
        })
    })
   
    
    describe("addRequestId", () => {
        test("addRequestId returns a action with type WIZARD_REQUEST_ID_ADD and payload id", () => {
            const payload = 12356
            const result = addRequestId(payload)

            expect(result.type).toBe(WIZARD_REQUEST_ID_ADD)
            expect(result.payload).toEqual(payload)
        })
    })
    describe("removeRequestId", () => {
        test("removeRequestId returns a action with type WIZARD_REQUEST_ID_REMOVE and payload id", () => {
            const payload = 12356
            const result = removeRequestId(payload)

            expect(result.type).toBe(WIZARD_REQUEST_ID_REMOVE)
            expect(result.payload).toEqual(payload)
        })
    })
})