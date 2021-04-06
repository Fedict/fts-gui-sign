import thunk from "redux-thunk";
import {
    compose,
    applyMiddleware,
    combineReducers,
    createStore
} from "redux";
import wizardReducer from '../modules/wizard/WizardReducer'
import UploadFileReducer from "../modules/fileUpload/reducers/UploadFileReducer";
import MessageReducer from "../modules/message/reducers/MessageReducer";
import CertificateReducer from "../modules/signWizard/reducers/CertificateReducer";
import DigestReducer from "../modules/signWizard/reducers/DigestReducer";
import SignatureReducer from "../modules/signWizard/reducers/SignatureReducer";
import PinErrorReducer from "../modules/signWizard/reducers/PinErrorReducer";
import ReaderReducer from "../modules/signWizard/reducers/ReaderReducer";
import ValidationReducer from "../modules/validateWizard/reducers/ValidationReducer";
import ControlIdReducer from "../modules/controlIds/common/ControlIdReducer";
import i18nReducer from "../modules/i18n/reducers/i18nReducer";
import TokenReducer from "../modules/signByTokenWizard/reducers/tokenReducers";

export default function configureStore(initialState = {}) {

    const middleware = [
        thunk
    ]

    const composeEnhancers = (process.env.NODE_ENV !== "production") ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose

    const enhancer = composeEnhancers(applyMiddleware(...middleware))

    const rootReducer = combineReducers({
        wizard: wizardReducer,
        uploadFile: UploadFileReducer,
        tokenFile: TokenReducer,
        i18n: i18nReducer,
        message: MessageReducer,
        certificate: CertificateReducer,
        digest: DigestReducer,
        signature: SignatureReducer,
        pinError: PinErrorReducer,
        reader: ReaderReducer,
        validation: ValidationReducer,
        controlId: ControlIdReducer
    })

    return createStore(rootReducer, initialState, enhancer)
}