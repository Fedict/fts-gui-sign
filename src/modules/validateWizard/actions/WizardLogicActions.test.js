import { resetStore } from "../../../store/storeActions"
import * as storeActions from "../../../store/storeActions";
import { setNewFlowId } from "../../controlIds/flowId/FlowIdActions";
import * as flowIdActions from "../../controlIds/flowId/FlowIdActions";
import { navigateToStep } from "../../wizard/WizardActions";
import * as wizardActions from "../../wizard/WizardActions";
import { resetWizard } from "./WizardLogicActions";
import { WIZARD_STATE_START } from "../../wizard/WizardConstants";


const ORIGINAL_resetStore = resetStore
const ORIGINAL_setNewFlowId = setNewFlowId
const ORIGINAL_navigateToStep = navigateToStep

describe("WizardLogicActions", () => {
    describe("resetWizard", () => {

        beforeEach(() => {
            storeActions.resetStore = jest.fn()
            flowIdActions.setNewFlowId = jest.fn()
            wizardActions.navigateToStep = jest.fn()
        })

        afterEach(() => {
            storeActions.resetStore = ORIGINAL_resetStore
            flowIdActions.setNewFlowId = ORIGINAL_setNewFlowId
            wizardActions.navigateToStep = ORIGINAL_navigateToStep
        })

        test("resetWizard resets store", () => {
            const mockDispatch = jest.fn()
            resetWizard()(mockDispatch)

            expect(storeActions.resetStore).toBeCalledTimes(1)
        })

        test("resetWizard creates a new flowId", () => {
            const mockDispatch = jest.fn()
            resetWizard()(mockDispatch)

            expect(flowIdActions.setNewFlowId).toBeCalledTimes(1)
        })

        test("resetWizard navigates to WIZARD_STATE_START", () => {
            const mockDispatch = jest.fn()
            resetWizard()(mockDispatch)

            expect(wizardActions.navigateToStep).toBeCalledTimes(1)
            expect(wizardActions.navigateToStep).toBeCalledWith(WIZARD_STATE_START)
        })
    })

    describe("validateDocument", () => {
        test("validateDocument calls validateSignatureAPI", () => { })
        test("validateDocument calls handleFlowIdError", () => { })
        test("validateDocument success set validation Indications", () => { })
        test("validateDocument success navigates to WIZARD_STATE_RESULT", () => { })
        test("signDocument error shows ErrorGeneral", () => { })
        test("signDocument error INCORECT_FLOW_ID does nothing", () => { })
    })

})