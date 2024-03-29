import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { sendLogInfo } from "../communication/communication"
import { resetWizard } from "../validateWizard/actions/WizardLogicActions";
import DisplayFile from '../fileUpload/components/UploadDisplayFile/UploadDisplayFile'
import { defineMessages, FormattedMessage, injectIntl } from "react-intl";

const messages = defineMessages({
    "language" : {
        id : "language",
        defaultMessage : "en"
    }
})
export class StartPageContainer extends React.Component {
    componentDidMount(){
        document.title = "BOSA - Signing Box"
    }

    render() {
        
        const { history } = this.props
        const { resetWizard, intl } = this.props
        //Todo: Research a better way to do this
        const language= intl.formatMessage(messages["language"])
        return (
            <div >
                <div className={"row mx-5 mt-3"}>
                    <div className={"col col-sm-6"} style={{ minWidth: '320px' }}>
                        <   DisplayFile />
                    </div>
                    <div className={"col col-sm-6"}>

                        <div className={"container"}>
                            <main className="card">
                                <div className="card-header"><FormattedMessage id="index.title" defaultMessage="Signing Box" /></div>
                                <div className="card-body">
                                    <FormattedMessage id="index.welcome" defaultMessage="The online signature service 'Signing box' is offered by the Federal Public Service Policy and Support." />
                                    <br /><br />
                                    <FormattedMessage id="index.content" defaultMessage="With this service you can digitally sign your documents (pdf or xml) or check the validity of the signature on a document (pdf or xml). With 'Signing box' you are sure that your document is signed correctly!" />
                                    <br />
                                    <br />
                                    <div className="row mx-5 mt-3">
                                        <div className="col col-6">
                                            <p align="center"><button style={{ minWidth: 115 }} className="btn btn-primary" id="button_install_eID"
                                            onClick={() => { resetWizard(); history.push({pathname:'/sign', search: "?language=" + language });sendLogInfo('UI - I WANT TO SIGN Click')}}>
                                                <FormattedMessage id="buttons.sign" defaultMessage="I want to sign" /></button></p>
                                        </div>
                                        <div className="col col-6">
                                            <p align="center"><button style={{ minWidth: 115 }} className="btn btn-primary" id="button_install_eID"
                                            onClick={() => { resetWizard(); history.push({pathname:'/validate', search: "?language=" + language }); sendLogInfo('UI - I WANT TO VALIDATE Click')}}>
                                                <FormattedMessage id="buttons.validate" defaultMessage="I want to validate" /></button></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <FormattedMessage id="index.footer" defaultMessage="If you want more information about eID cards and card readers, you can find it here: " /><a href="https://eid.belgium.be/">eid.belgium.be</a>
                                    <br/><br/>
                                    <FormattedMessage id="index.footer2a" defaultMessage="If you experience problems with the signing or the installation of software, you can find more information here: "/>
                                    <FormattedMessage id="error.faq.URL" defaultMessage="https://bosa.belgium.be/en/federal-trust-services-frequently-asked-questions">{ link =>
                                        <a href={link} rel="noreferrer" target="_blank"><FormattedMessage id="index.footer2b" defaultMessage="Frequently asked questions signing service"/></a> }
                                    </FormattedMessage>
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = ({
    resetWizard
})



export default withRouter(connect(null,mapDispatchToProps)(injectIntl(StartPageContainer)))
