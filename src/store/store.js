import thunk from "redux-thunk";
import { compose, applyMiddleware, combineReducers, createStore } from "redux";


import wizardReducer from '../modules/wizard/reducers/WizardReducer'
import UploadFileReducer from "../modules/wizard/reducers/UploadFileReducer";
import MessageReducer from "../modules/wizard/reducers/MessageReducer";
import CertificateReducer from "../modules/wizard/reducers/CertificateReducer";
import DigestReducer from "../modules/wizard/reducers/DigestReducer";
import SignatureReducer from "../modules/wizard/reducers/SignatureReducer";
import PinErrorReducer from "../modules/wizard/reducers/PinErrorReducer";
import ReaderReducer from "../modules/wizard/reducers/ReaderReducer";

export default function configureStore(initialState = {}) {

    const middleware = [
        thunk
    ]

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

    const enhancer = composeEnhancers(applyMiddleware(...middleware))

    const rootReducer = combineReducers({
        // i18n: i18nReducer,
        // content : contentReducer,
        wizard: wizardReducer,
        uploadFile: UploadFileReducer,
        message: MessageReducer,
        certificate: CertificateReducer,
        digest: DigestReducer,
        signature: SignatureReducer,
        pinError: PinErrorReducer,
        reader: ReaderReducer
    })

    return createStore(rootReducer, initialState, enhancer)

}