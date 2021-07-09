import React, {useState} from 'react'

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
        document.addEventListener("keypress", this.test)
    }

    componentWillUnmount() {
        document.removeEventListener("keypress", this.test)
        document.removeEventListener("keyup", this.onKeyUp)
    }

    test(e){
        console.log(e)
    }

    onKeyUp(e) {
        if(!e.key && !e.keyCode){
            return;
        }
        //console.log(e)
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
                pincode = pincode.substr(0, indexCursor) + e.key + pincode.substr(indexCursor)
                this.setState({ pin: pincode, indexCursor : indexCursor + 1 })
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

    handleSubmit() {
        const { navigateToStep, sign } = this.props
        navigateToStep(WIZARD_STATE_SIGNING_PRESIGN_LOADING)
        sign(this.state.pin)
    }

    render() {
        const { resetWizard, pinError, certificate, intl } = this.props
        const { pin, indexCursor, checked } = this.state
        const pinstring = "*".repeat(pin.length)
        return (

            <CardContainer
                title={intl.formatMessage(messages.title)}
                hasNextButton={false}
                hasCancelButton
                cancelButtonText={intl.formatMessage(definedMessages.cancel)}
                onClickCancel={() => { resetWizard() }}
                nextButtonText={intl.formatMessage(messages.next)}
                onClickNext={() => { this.handleSubmit() }}
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
                                    signingButton : intl.formatMessage({id : "signing.pininput.button.sign"})
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

                        <button className={"btn btn-primary"} onClick={() => { this.handleSubmit() }} id="button_next"><FormattedMessage id={"signing.pininput.button.sign"} defaultMessage={"Sign with eId"}/></button>
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
