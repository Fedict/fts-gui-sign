import { navigateToStep } from "../../wizard/WizardActions"
import * as wizardActions from '../../wizard/WizardActions'
import { MESSAGE_SET_ERROR, MESSAGE_SET_INFO, showErrorMessage, showInfoMessage } from "./MessageActions"
import { WIZARD_STATE_MESSAGE } from "../../wizard/WizardConstants"

const ORIGINAL_navigateToStep = navigateToStep

describe("MessageActions", () => {
    describe("action type constants", () => {
        test("all constanst are unique in the file", () => {
            const listOfConst = [
                MESSAGE_SET_ERROR,
                MESSAGE_SET_INFO,
            ]

            const setOfConst = new Set(listOfConst)

            expect(listOfConst.length).toEqual(setOfConst.size)
        })
    })
    describe("showErrorMessage", () => {
        beforeEach(() => {
            wizardActions.navigateToStep = jest.fn()
        })
        test("showErrorMessage dispatches a action with type MESSAGE_SET_ERROR and payload messageObject", () => {
            const dispatch = jest.fn()
            const message = { message: "message", title: 'title' }

            showErrorMessage(message)(dispatch)

            expect(dispatch).toBeCalledTimes(2)
            expect(dispatch.mock.calls[0][0].type).toEqual(MESSAGE_SET_ERROR)
            expect(dispatch.mock.calls[0][0].payload).toEqual(message)
        })
        test("showErrorMessage dispatches navigate To Step WIZARD_STATE_MESSAGE", () => {
            const dispatch = jest.fn()
            const message = { message: "message", title: 'title' }

            showErrorMessage(message)(dispatch)

            expect(dispatch).toBeCalledTimes(2)
            expect(wizardActions.navigateToStep).toHaveBeenCalledTimes(1)
            expect(wizardActions.navigateToStep).toHaveBeenCalledWith(WIZARD_STATE_MESSAGE)
        })

        afterEach(() => {
            wizardActions.navigateToStep = ORIGINAL_navigateToStep
        })
    })

    describe("showInfoMessage", () => {
        beforeEach(() => {
            wizardActions.navigateToStep = jest.fn()
        })
        test("showInfoMessage dispatches a action with type MESSAGE_SET_INFO and payload messageObject", () => {
            const dispatch = jest.fn()
            const message = { message: "message", title: 'title' }

            showInfoMessage(message)(dispatch)

            expect(dispatch).toBeCalledTimes(2)
            expect(dispatch.mock.calls[0][0].type).toEqual(MESSAGE_SET_INFO)
            expect(dispatch.mock.calls[0][0].payload).toEqual(message)
        })
        test("showInfoMessage dispatches navigate To Step WIZARD_STATE_MESSAGE", () => {
            const dispatch = jest.fn()
            const message = { message: "message", title: 'title' }

            showInfoMessage(message)(dispatch)

            expect(dispatch).toBeCalledTimes(2)
            expect(wizardActions.navigateToStep).toHaveBeenCalledTimes(1)
            expect(wizardActions.navigateToStep).toHaveBeenCalledWith(WIZARD_STATE_MESSAGE)
         })
        afterEach(() => {
            wizardActions.navigateToStep = ORIGINAL_navigateToStep
        })
    })
})