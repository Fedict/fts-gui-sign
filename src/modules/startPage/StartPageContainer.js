import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { CardContainer } from '../components/Card/CardContainer'
import { MethodeSelectCard } from '../components/MethodSelect/MethodSelectCard'
import { resetWizard } from "../validateWizard/actions/WizardLogicActions";
import DisplayFile from '../fileUpload/components/UploadDisplayFile/UploadDisplayFile'
import { defineMessages, FormattedMessage, injectIntl } from "react-intl";

export class StartPageContainer extends React.Component {

    render() {
        const { history } = this.props
        const { resetWizard } = this.props

        return (
            <div >
                <div className={"row mx-5 mt-3"}>
                    <div className={"col col-7"}>
                        <   DisplayFile />
                    </div>
                    <div className={"col col-5"}>

                        <div className={"container"}>
                            <div class="card">
                                <div class="card-header"><FormattedMessage id="index.title" defaultMessage="Signing Box" /></div>
                                <div class="card-body">
                                    <b><FormattedMessage id="index.welcome" defaultMessage="Welcome" /></b>
                                    <br /><br />
                                    <FormattedMessage id="index.content" defaultMessage="This application will allow you to electronically sign files and validate signed files, by means of your electronic identity card (eID). " />
                                    <br />
                                    <br />
                                    <div class="row mx-5 mt-3">
                                        <div class="col col-6">
                                            <p align="center"><button style={{ minWidth: 115 }} className="btn btn-primary" id="button_install_eID" onClick={() => { resetWizard(); history.push('/sign') }}><FormattedMessage id="buttons.sign" defaultMessage="Sign" /></button></p>
                                        </div>
                                        <div class="col col-6">
                                            <p align="center"><button style={{ minWidth: 115 }} className="btn btn-primary" id="button_install_eID" onClick={() => { resetWizard(); history.push('/validate') }}><FormattedMessage id="buttons.validate" defaultMessage="Validate" /></button></p>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <b><FormattedMessage id="index.footer" defaultMessage="If you want more information about eID cards and eID readers, go to " /><a href="https://eid.belgium.be/">eid.belgium.be</a></b>
                                </div>
                            </div>
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



export default withRouter(connect(null,mapDispatchToProps)(StartPageContainer))