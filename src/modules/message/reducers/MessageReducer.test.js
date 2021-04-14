import MessageReducer, { initialState } from "./MessageReducer"
import { MESSAGE_SET_ERROR, MESSAGE_SET_INFO } from "../actions/MessageActions"
import { messageTypes } from "../MessageConstants"
import { STORE_RESET } from "../../../store/storeActions"

describe("MessageReducer", () => {

    describe("reducer", () => {

        describe('MESSAGE_SET_ERROR', () => {

            test('MESSAGE_SET_ERROR creates a message with type ERROR', () => {
                const startState = { ...initialState }
                const action = {
                    type: MESSAGE_SET_ERROR, payload: {
                        title: "title",
                        message: "message",
                    }
                }
                const result = MessageReducer(startState, action)

                expect(result.type).toEqual(messageTypes.ERROR)
            })

            test('MESSAGE_SET_ERROR puts action.payload in the state object', () => {
                const startState = { ...initialState }
                const action = {
                    type: MESSAGE_SET_ERROR, payload: {
                        title: "title",
                        message: "message",
                        body: "body",
                        nextButton: {
                            text: "text",
                            isVisible: false,
                            nextPage: "test"
                        },
                        hasCancelButton: false
                    }
                }
                const result = MessageReducer(startState, action)
                expect(result).toMatchObject(action.payload)

            })
        })

        describe('MESSAGE_SET_INFO', () => {

            test('MESSAGE_SET_INFO creates a message with type INFO', () => {
                const startState = { ...initialState }
                const action = {
                    type: MESSAGE_SET_INFO, payload: {
                        title: "title",
                        message: "message",
                    }
                }
                const result = MessageReducer(startState, action)

                expect(result.type).toEqual(messageTypes.INFO)
            })
            
            test('MESSAGE_SET_INFO puts action.payload in the state object', () => {
                const startState = { ...initialState }
                const action = {
                    type: MESSAGE_SET_INFO, payload: {
                        title: "title",
                        message: "message",
                        body: "body",
                        nextButton: {
                            text: "text",
                            isVisible: false,
                            nextPage: "test"
                        },
                        hasCancelButton: false
                    }
                }
                const result = MessageReducer(startState, action)
                expect(result).toMatchObject(action.payload)
            })
        })

        describe('STORE_RESET', () => {

            test("action with type STORE_RESET resets back to initial state", () => {
                const startState = {
                    title: "title",
                    message: "message",
                    body: "body",
                    nextButton: {
                        text: "text",
                        isVisible: false,
                        nextPage: "test"
                    },
                    hasCancelButton: false
                }
                const action = { type: STORE_RESET }

                const result = MessageReducer(startState, action)

                expect(result).toEqual(initialState)
            })
        })
    })
})