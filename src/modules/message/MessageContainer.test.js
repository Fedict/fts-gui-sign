import React from "react";
import {Provider} from "react-redux";
import configureStore from '../../store/store';
import { render, screen } from '../testUtils/test-utils.js'
import MessageContainer from "./MessageContainer.js";
import { messageTypes, ErrorGeneral } from './MessageConstants'

describe("MessageContainer", () => {

    let TITLE = 'Title of the message'
    let MSG = 'Ze message'
    let BODY_MSG = 'Ze default body'
    let BODY = { id: "msg.body", defaultMessage: BODY_MSG }
    let MESSAGE = { type: messageTypes.INFO, hasCancelButton: true, hasNextButton: true, title: TITLE, message: MSG, body: BODY }

    test("Has Message (no store)", () => {
 
        render(<Provider store={configureStore()}><MessageContainer message={ MESSAGE } /></Provider>);
 
        expect(screen.getByText(TITLE)).toBeInTheDocument();
        expect(screen.getByText(BODY_MSG)).toBeInTheDocument();
        expect(screen.getByText(MSG)).toBeInTheDocument();
    })

    test("Has store Message", () => {
        render(<Provider store={configureStore( { message: MESSAGE })}><MessageContainer/></Provider>);
 
        expect(screen.getByText(TITLE)).toBeInTheDocument();
        expect(screen.getByText(BODY_MSG)).toBeInTheDocument();
        expect(screen.getByText(MSG)).toBeInTheDocument();
    })

    test("Has NO Message", () => {
        render(<Provider store={configureStore( { message: null } )}><MessageContainer/></Provider>);
 
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText('Something went wrong. Please reload the page and try again.')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    })
})
