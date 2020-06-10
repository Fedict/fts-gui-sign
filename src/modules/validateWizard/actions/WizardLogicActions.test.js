describe("WizardLogicActions", () => {
    describe("resetWizard", () => {
        test("resetWizard resets store", () => { })
        test("resetWizard creates a new flowId", () => { })
        test("resetWizard navigates to WIZARD_STATE_START", () => { })
    })

    describe("handleFlowIdError", () => {
        test("handleFlowIdError returns response if flowID in the store is the same as the flowID in att", () => { })
        test("handleFlowIdError throws error if flowID in the store is not the same as the flowID in att", () => { })
    })

    describe("validateDocument", () => {
        test("validateDocument calls validateSignatureAPI", () => { })
        test("validateDocument calls handleFlowIdError", () => { })
        test("validateDocument succes set validation Indications", () => { })
        test("validateDocument succes navigates to WIZARD_STATE_RESULT", () => { })
        test("signDocument error shows ErrorGeneral", () => { })
        test("signDocument error INCORECT_FLOW_ID does nothing", () => { })
    })

})