import React, {useEffect, useState} from 'react'

import { connect } from 'react-redux';
import { CardContainer } from '../../components/Card/CardContainer';
import { sign, resetWizard } from '../actions/WizardLogicActions'
import {navigateToStep} from '../../wizard/WizardActions';
import { WIZARD_STATE_SIGNING_PRESIGN_LOADING } from '../../wizard/WizardConstants';
import {defineMessages, FormattedMessage, injectIntl} from "react-intl";
import {definedMessages} from "../../i18n/translations";
import {defaults} from "../../utils/helper";
import {boldedText} from "../../utils/reactIntlUtils";
import ChangeAutoDownloadOption from "../../components/ChangeAutoDownloadOption/ChangeAutoDownloadOption";

const messages = defineMessages({
    title: {
        id: "signing.pininput.title",
        defaultMessage: "Enter pin code"
    },
    next: {
        id: "signing.pininput.button.sign",
        defaultMessage: "Sign with eId"
    }
})
/*
export class PinInputContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            pin: "",
            indexCursor : 0
        }

        this.onKeyUp = this.onKeyUp.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        document.addEventListener("keyup", this.onKeyUp)
    }

    componentWillUnmount() {
        document.removeEventListener("keyup", this.onKeyUp)
    }

    onKeyUp(e) {
        if(!e.key && !e.keyCode){
            console.log('unidentified keyEvent', e)
            return;
        }
        console.log(e)
        let pincode = defaults(this.state.pin, "") + "";
        let indexCursor = this.state.indexCursor;
        let stopEventPropagation = true;
        if (e.keyCode === 13) { //Enter
            if (pincode.length >= 4) {
                this.handleSubmit()
            }
        } else if (e.keyCode === 8) { //Backspace
            pincode = pincode.substr(0, indexCursor - 1) + pincode.substr(indexCursor)
            this.setState({ pin: pincode, indexCursor : Math.max(indexCursor - 1, 0) })
        }else if (e.keyCode === 46){ //Delete
            pincode = pincode.substr(0, indexCursor) + pincode.substr(indexCursor + 1)
            this.setState({ pin: pincode, indexCursor })
        }else if (e.keyCode === 37){ //Left
            this.setState({indexCursor : Math.max(0, indexCursor - 1)})
        }else if (e.keyCode === 39){ //Right
            this.setState({indexCursor : Math.min(pincode.length, indexCursor + 1)})
        }else if (e.key && e.key.length === 1) {
            if (pincode.length < 12) {
                if(isNaN(parseInt(e.key))){
                    console.log("The value typed is NaN");
                    stopEventPropagation = false;
                }else{
                    pincode = pincode.substr(0, indexCursor) + e.key + pincode.substr(indexCursor)
                    this.setState({ pin: pincode, indexCursor : indexCursor + 1 })
                }
            }
        } else {
            stopEventPropagation = false;
        }
        if(stopEventPropagation){
            e.stopPropagation();
            e.preventDefault();
        }

    }

    onchange(e) {
        const pin = e.target.value
        this.setState({ pin: pin })
    }
*/

const doLog = window.configData.BEurl === 'https://validate.ta.fts.bosa.belgium.be/signandvalidation' || window.configData.BEurl === 'http://localhost:8751/signandvalidation';
let globalPin = '';
let globalIndex = 0;
const PinInputContainer = (props) => {
    const { resetWizard, pinError, certificate, intl } = props;
    let [pin, setPin] = useState('');
    let [indexCursor, setIndexCursor] = useState(0);
    const pinstring = "*".repeat(pin.length);

    const handleSubmit = () => {
        const { navigateToStep, sign } = props
        navigateToStep(WIZARD_STATE_SIGNING_PRESIGN_LOADING)
        sign(pin)
    }

    const onKeyUp = (e) => {
        // we need a globalVar for the onKeyUp function I think because the function is bound to the document and thus the scope
        // of the variable is a bit messed up
        if(!e.key && !e.keyCode){
            console.log('unidentified keyEvent', e)
            return;
        }
        if(doLog){
            console.log(e)
        }
        let pincode = globalPin;
        let newIndexCursor = globalIndex;
        let stopEventPropagation = true;
        if (e.keyCode === 13) { //Enter
            if (pincode.length >= 4) {
                handleSubmit();
            }else{
                stopEventPropagation = false;
            }
        } else if (e.keyCode === 8) { //Backspace
            pincode = pincode.substr(0, newIndexCursor - 1) + pincode.substr(newIndexCursor)
            newIndexCursor = Math.max(newIndexCursor - 1, 0);
        }else if (e.keyCode === 46){ //Delete
            pincode = pincode.substr(0, newIndexCursor) + pincode.substr(newIndexCursor + 1)
        }else if (e.keyCode === 37){ //Left
            newIndexCursor = Math.max(0, newIndexCursor - 1);
        }else if (e.keyCode === 39){ //Right
            newIndexCursor = Math.min(pincode.length, newIndexCursor + 1);
        }else if (e.key && e.key.length === 1) {
            if (pincode.length < 12) {
                if(isNaN(parseInt(e.key))){
                    console.log("The value typed is NaN");
                    stopEventPropagation = false;
                }else{
                    pincode = pincode.substr(0, newIndexCursor) + e.key + pincode.substr(newIndexCursor)
                    newIndexCursor++;
                }
            }else{
                stopEventPropagation = false;
            }
        } else {
            stopEventPropagation = false;
        }
        if(stopEventPropagation){
            setPin(pincode);
            setIndexCursor(newIndexCursor);

            globalPin = pincode;
            globalIndex = newIndexCursor;
            if(doLog){
                console.log('TEST --- ','pincode', pincode, 'newIndexCursor', newIndexCursor);
            }
            e.stopPropagation();
            e.preventDefault();
        }
    }
    useEffect(() => {
        document.addEventListener("keyup", onKeyUp)
    }, [])

    useEffect(() => {
        return () => {
            //wil be called on Destroy
            document.removeEventListener("keyup", onKeyUp)
        }
    }, [])
    useEffect(() => {
        if (doLog) {
            console.log('pincode', pin, 'newIndexCursor', indexCursor)
        }
    }, [pin, indexCursor])

    return (

        <CardContainer
            title={intl.formatMessage(messages.title)}
            hasNextButton={false}
            hasCancelButton
            cancelButtonText={intl.formatMessage(definedMessages.cancel)}
            onClickCancel={() => { resetWizard() }}
            nextButtonText={intl.formatMessage(messages.next)}
            onClickNext={() => { handleSubmit() }}
            nextButtonIsDisabled={pin.length < 4}>

            <div className="form-group">
                <p>
                    {(certificate && certificate.certificateSelected && certificate.certificateSelected.commonName && false)
                        ? <FormattedMessage id="signing.pininput.textCommonName" defaultMessage="Enter the PIN for {commonName}" values={{commonName : certificate.certificateSelected.commonName}}/>
                        : <FormattedMessage
                            id="signing.pininput.text"
                            defaultMessage="Enter the PIN"
                            values={{b: boldedText,
                                newLine : <br/>,
                                signingButton : intl.formatMessage(messages.next)
                            }}
                        />
                    }
                </p>
                <ChangeAutoDownloadOption />
                <div className="form-inline">
                    <div
                        className="form-control"
                        id="input_code"
                        data-testid="input_code"
                        style={{width:150, marginRight:30}}
                    >{pinstring.substr(0, indexCursor)}<span className="blinking-cursor">|</span>{pinstring.substr(indexCursor)}</div>

                    <button className={"btn btn-primary"} onClick={() => { handleSubmit() }} id="button_next" disabled={pin.length < 4}><FormattedMessage id={"signing.pininput.button.sign"} defaultMessage={"Sign with eId"}/></button>
                </div>

                {(pinError && pinError.message)
                    ? (
                        <div className="text-center" style={{marginTop : 10}}>
                            <div className="alert alert-danger">
                                {pinError.message.id?intl.formatMessage(pinError.message):pinError.message}
                            </div>
                        </div>)
                    : null}
            </div>
        </CardContainer>
    )
}


const mapStateToProps = (state) => {
    return (state) => ({
        pinError: state.pinError,
        certificate: state.certificate
    })
}

const mapDispatchToProps = ({
    sign,
    resetWizard,
    navigateToStep
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(PinInputContainer))
