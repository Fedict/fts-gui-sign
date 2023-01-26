import React, {useState} from 'react'

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
        defaultMessage: "Sign with eId"
    }
})

const doLog = window.configData && (window.configData.BEurl === 'https://validate.ta.fts.bosa.belgium.be/signandvalidation' || window.configData.BEurl === 'http://localhost:8751/signandvalidation');

const PinInputContainer = (props) => {
    const { resetWizard, pinError, certificate, intl } = props;
    let [pin, setPin] = useState('');

    const handleSubmit = (thePin) => {
        const { navigateToStep, sign } = props
        navigateToStep(WIZARD_STATE_SIGNING_PRESIGN_LOADING)
        if(doLog){
            console.log('signing', thePin)
        }
        sign(thePin)
    }

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
                                "<b>Enter the PIN</b> and click on  <b>{signingButton}</b> to sign the documents." }
                            values={{b: boldedText, newLine : <br/>, signingButton : intl.formatMessage(messages.next)
                            }}
                        />
                    }
                </p>
                <ChangeAutoDownloadOption />
                <form className="form-inline" onSubmit={() => { handleSubmit(pin) }} >
                    <input type="password" autoFocus className="form-control" id="input_code" data-testid="input_code" translate="no" style={{width:150, marginRight:30}}
                            onChange={ (e) => {
                                var value = e.target.value;
                                if (/^\d*$/.test(value)) setPin(value)
                                else e.target.value = pin
                            }} />
                    <button type="submit" className={"btn btn-primary"} id="button_next" disabled={pin.length < 4}><FormattedMessage id={"signing.pininput.button.sign"} defaultMessage={"Sign with eId"}/></button>
                </form>

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
