import React, {useEffect, useState, useRef} from 'react'
import { connect } from 'react-redux';
import { CardContainer } from '../../components/Card/CardContainer';
import { sign, resetWizard } from '../actions/WizardLogicActions'
import {navigateToStep} from '../../wizard/WizardActions';
import { WIZARD_STATE_SIGNING_PRESIGN_LOADING } from '../../wizard/WizardConstants';
import {defineMessages, FormattedMessage, injectIntl} from "react-intl";
import {definedMessages} from "../../i18n/translations";
import {boldedText} from "../../utils/reactIntlUtils";
import ChangeAutoDownloadOption from "../../components/ChangeAutoDownloadOption/ChangeAutoDownloadOption";

const messages = defineMessages({
    title: {
        id: "signing.pininput.title",
        defaultMessage: "Enter pin code"
    },
    next: {
        id: "signing.pininput.button.sign",
        defaultMessage: "Sign with eID"
    }
})

const doLog = window.configData && (window.configData.BEurl === 'https://validate.ta.fts.bosa.belgium.be/signandvalidation' || window.configData.BEurl === 'http://localhost:8751/signandvalidation');

if(!window.PinInputContainerData){
    window.PinInputContainerData = class {
        #pin = '';
        constructor(){
            this.#pin = '';
            this.index = 0;
        }
        setPin(p){
            this.#pin = p;
        }
        getPin() {return this.#pin;}
        setIndex(i) {
            this.index = i;
        }
        getIndex(){return this.index;}
        reset() {
            this.#pin = '';
            this.index = 0;
        }
    }
}

const PinInputContainer = (props) => {
    const { resetWizard, pinError, certificate, intl } = props;
    const nextBtnRef = useRef(null);
    const pinInputRef = useRef(null);
    let [pin, setPin] = useState('');
    let [indexCursor, setIndexCursor] = useState(0);
    const pinstring = "*".repeat(pin.length);

    const handleSubmit = (thePin) => {
        const { navigateToStep, sign } = props
        navigateToStep(WIZARD_STATE_SIGNING_PRESIGN_LOADING)
        if(doLog){
            console.log('signing', thePin)
        }
        if(thePin && thePin.length >= 4){
            sign(thePin, intl.locale)
        }
    }

    const onKeyUp = (pinInputContainerData, e) => {
        // we need a globalVar for the onKeyUp function I think because the function is bound to the document and thus the scope
        // of the variable is a bit messed up
        if(!e.key && !e.keyCode){
            console.log('unidentified keyEvent', e)
            return;
        }
        if(doLog){
            console.log(e)
        }
        let pincode = pinInputContainerData.getPin();
        let newIndexCursor = pinInputContainerData.getIndex();
        let stopEventPropagation = true;
        if (e.keyCode === 13) { //Enter
            if (pincode.length >= 4) {
                handleSubmit(pinInputContainerData.getPin());
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

            pinInputContainerData.setPin(pincode);
            pinInputContainerData.setIndex(newIndexCursor);
            if (pincode.length < 4 && pinInputRef.current) pinInputRef.current.focus();
            if(doLog){
                console.log('TEST --- ','pincode', pincode, 'newIndexCursor', newIndexCursor);
            }
            e.stopPropagation();
            e.preventDefault();
        }
        //setT(new Date().getTime());
    }

    useEffect(() => {
        console.log('Adding new event listener')
        if(window.PinCodeFunction){
            console.error('Document unmount did not happen');
            document.removeEventListener("keyup", window.PinCodeFunction)
        }
        window.PinCodeFunction = onKeyUp.bind(undefined, new window.PinInputContainerData())
        document.addEventListener("keyup", window.PinCodeFunction)
    }, [])

    useEffect(() => {
        if (pinInputRef.current) pinInputRef.current.focus();
        return () => {
            console.log('removing event listener')
            //wil be called on Destroy
            document.removeEventListener("keyup", window.PinCodeFunction)
            window.PinCodeFunction = undefined;
        }
    }, [])
    useEffect(() => {
        if (doLog) {
            console.log('pincode', pin, 'newIndexCursor', indexCursor)
        }
    }, [pin, indexCursor])

    useEffect(() => {
        if (nextBtnRef.current) nextBtnRef.current.focus();
      });

    return (
        <CardContainer
            title={intl.formatMessage(messages.title)}
            hasNextButton={false}
            hasCancelButton
            cancelButtonText={intl.formatMessage(definedMessages.cancel)}
            onClickCancel={() => { resetWizard() }}
            nextButtonText={intl.formatMessage(messages.next)}
            onClickNext={() => { handleSubmit(pin) }}
            nextButtonIsDisabled={pin.length < 4}>

            <div className="form-group">
                <p>
                    {(certificate && certificate.certificateSelected && certificate.certificateSelected.commonName && false)
                        ? <FormattedMessage id="signing.pininput.textCommonName" defaultMessage="Enter the PIN for {commonName}" values={{commonName : certificate.certificateSelected.commonName}}/>
                        : <FormattedMessage
                            id={ props.isMultifile ? "signing.pininput.multiFile.text" : "signing.pininput.text" }
                            defaultMessage={ props.isMultifile ? "<b>Enter the PIN</b> and click on  <b>{signingButton}</b> to sign the documents." :
                                "<b>Enter the PIN</b> and click on  <b>{signingButton}</b> to sign the document." }
                                values={{ b: boldedText, newLine : <br/>, signingButton : intl.formatMessage(messages.next) }}
                        />
                    }
                </p>
                { props.downloadSelector && <ChangeAutoDownloadOption /> }
                <form className="form-inline" onSubmit={() => { handleSubmit(pin) }} >
                    <div className="form-control" id="input_code" data-testid="input_code" tabIndex="0" translate="no" style={{width:150, marginRight:30}} ref={ pinInputRef }>
                        {pinstring.substr(0, indexCursor)}<span className="blinking-cursor">|</span>{pinstring.substr(indexCursor)}
                    </div>
                    <button type="submit" className={"btn btn-primary"} id="button_next" disabled={pin.length < 4} ref={ nextBtnRef }>
                        <FormattedMessage id={messages.next.id} defaultMessage={messages.next.defaultMessage}/>
                    </button>
                </form>

                {(pinError && pinError.message)
                    ? (
                        <div className="text-center" style={{marginTop : 10}}>
                            <div className="alert alert-danger" role="alert">
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
        isMultifile: state.tokenFile.inputs !== undefined && state.tokenFile.inputs.length > 1,
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
