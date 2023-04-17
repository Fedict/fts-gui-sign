import { resetStore } from "../../../store/storeActions"
import * as storeActions from "../../../store/storeActions";
import { setNewFlowId } from "../../controlIds/flowId/FlowIdActions";
import * as flowIdActions from "../../controlIds/flowId/FlowIdActions";
import { navigateToStep } from "../../wizard/WizardActions";
import * as wizardActions from "../../wizard/WizardActions";
import { resetWizard, validateDocument } from "./WizardLogicActions";
import { WIZARD_STATE_START, WIZARD_STATE_RESULT } from "../../wizard/WizardConstants";
import { validateSignatureAPI } from "../../communication/communication";
import * as communication from "../../communication/communication";
import { handleFlowIdError, INCORECT_FLOW_ID } from "../../controlIds/flowId/FlowIdHelpers";
import * as FlowIdHelpers from "../../controlIds/flowId/FlowIdHelpers";
import { validationSet } from "./ValidationActions";
import * as ValidationActions from "./ValidationActions";
import { showErrorMessage } from "../../message/actions/MessageActions";
import * as  MessageActions from "../../message/actions/MessageActions";
import { ErrorGeneral } from "../../message/MessageConstants";
import {setImmediate} from 'timers'

const ORIGINAL_resetStore = resetStore
const ORIGINAL_setNewFlowId = setNewFlowId
const ORIGINAL_navigateToStep = navigateToStep
const ORIGINAL_validateSignatureAPI = validateSignatureAPI
const ORIGINAL_handleFlowIdError = handleFlowIdError
const ORIGINAL_validationSet = validationSet
const ORIGINAL_showErrorMessage = showErrorMessage

function flushPromises() {
    return new Promise(resolve => setImmediate(resolve));
}

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
        beforeEach(() => {
            communication.validateSignatureAPI = jest.fn()
            FlowIdHelpers.handleFlowIdError = jest.fn()
            ValidationActions.validationSet = jest.fn()
            wizardActions.navigateToStep = jest.fn()
            MessageActions.showErrorMessage = jest.fn()
        })
        afterEach(() => {
            communication.validateSignatureAPI = ORIGINAL_validateSignatureAPI
            FlowIdHelpers.handleFlowIdError = ORIGINAL_handleFlowIdError
            ValidationActions.validationSet = ORIGINAL_validationSet
            wizardActions.navigateToStep = ORIGINAL_navigateToStep
            MessageActions.showErrorMessage = ORIGINAL_showErrorMessage
        })
        test("validateDocument calls validateSignatureAPI", async () => {

            communication.validateSignatureAPI = jest.fn(() => { return Promise.resolve() })

            const uploadFile = { file: { type: "xml", name: "filename" } }
            const controlId = { flowId: 5555 }
            const startStore = { uploadFile: uploadFile, controlId: controlId }

            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => { return startStore })

            FlowIdHelpers.handleFlowIdError = jest.fn(() => (val) => { return val })

            validateDocument()(mockDispatch, mockGetStore)
            await flushPromises()

            expect(communication.validateSignatureAPI).toBeCalledTimes(1)
            expect(communication.validateSignatureAPI).toHaveBeenCalledWith(uploadFile.file)

        })
        test("validateDocument calls handleFlowIdError", async () => {
            communication.validateSignatureAPI = jest.fn(() => { return Promise.resolve() })

            const uploadFile = { file: { type: "xml", name: "filename" } }
            const controlId = { flowId: 5555 }
            const startStore = { uploadFile: uploadFile, controlId: controlId }

            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => { return startStore })

            FlowIdHelpers.handleFlowIdError = jest.fn(() => (val) => { return val })

            validateDocument()(mockDispatch, mockGetStore)
            await flushPromises()

            expect(FlowIdHelpers.handleFlowIdError).toBeCalledTimes(1)
            expect(FlowIdHelpers.handleFlowIdError).toHaveBeenCalledWith(controlId.flowId, mockGetStore)
        })
        test("validateDocument success set validation Indications", async () => {
            const response = {
                report: "report",
                diagnosticData: "diagnosticData",
                normalizedReport: "normalizedReport"
            }
            communication.validateSignatureAPI = jest.fn(() => { return Promise.resolve(response) })

            const uploadFile = { file: { type: "xml", name: "filename" } }
            const controlId = { flowId: 5555 }
            const startStore = { uploadFile: uploadFile, controlId: controlId }

            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => { return startStore })

            FlowIdHelpers.handleFlowIdError = jest.fn(() => (val) => { return val })

            validateDocument()(mockDispatch, mockGetStore)
            await flushPromises()

            expect(ValidationActions.validationSet).toBeCalledTimes(1)
            expect(ValidationActions.validationSet).toHaveBeenCalledWith(response)
        })
        test("validateDocument success navigates to WIZARD_STATE_RESULT", async () => {
            const response = {
                report: "testvalue",
                diagnosticData: "testValue",
                normalizedReport: "normalizedReport"
            }
            communication.validateSignatureAPI = jest.fn(() => { return Promise.resolve(response) })

            const uploadFile = { file: { type: "xml", name: "filename" } }
            const controlId = { flowId: 5555 }
            const startStore = { uploadFile: uploadFile, controlId: controlId }

            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => { return startStore })

            FlowIdHelpers.handleFlowIdError = jest.fn(() => (val) => { return val })

            validateDocument()(mockDispatch, mockGetStore)
            await flushPromises()

            expect(wizardActions.navigateToStep).toBeCalledTimes(1)
            expect(wizardActions.navigateToStep).toHaveBeenCalledWith(WIZARD_STATE_RESULT)

        })
        test("signDocument error shows ErrorGeneral", async () => {

            communication.validateSignatureAPI = jest.fn(() => { return Promise.reject() })

            const uploadFile = { file: { type: "xml", name: "filename" } }
            const controlId = { flowId: 5555 }
            const startStore = { uploadFile: uploadFile, controlId: controlId }

            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => { return startStore })

            FlowIdHelpers.handleFlowIdError = jest.fn(() => (val) => { return val })

            validateDocument()(mockDispatch, mockGetStore)
            await flushPromises()

            expect(MessageActions.showErrorMessage).toBeCalledTimes(1)
            expect(MessageActions.showErrorMessage).toHaveBeenCalledWith(ErrorGeneral)
            expect(ValidationActions.validationSet).toBeCalledTimes(0)

        })
        test("signDocument error INCORECT_FLOW_ID does nothing", async () => {
            communication.validateSignatureAPI = jest.fn(() => { return Promise.resolve() })

            const uploadFile = { file: { type: "xml", name: "filename" } }
            const controlId = { flowId: 5555 }
            const startStore = { uploadFile: uploadFile, controlId: controlId }

            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => { return startStore })

            FlowIdHelpers.handleFlowIdError = jest.fn(() => (val) => { return Promise.reject(INCORECT_FLOW_ID) })

            validateDocument()(mockDispatch, mockGetStore)
            await flushPromises()

            expect(MessageActions.showErrorMessage).toBeCalledTimes(0)
            expect(ValidationActions.validationSet).toBeCalledTimes(0)
         })
    })

})