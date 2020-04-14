import React from 'react'
import { CardLoading } from '../../components/CardLoading/CardLoading'
import { connect } from 'react-redux'
import { resetWizard } from '../actions/WizardLogicActions'

export class SigningLoadingContainer extends React.Component {

    componentDidMount() {

    }

    render() {

        const { resetWizard } = this.props
        return (
            <div className="row mt-3">
                <CardLoading title={"Tekenen"}
                    hasCancelButton
                    cancelButtonText="Cancel"
                    onClickCancel={() => { resetWizard() }}
                >

                </CardLoading>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return (state) => ({

    })
}
const mapDispatchToProps = ({
     resetWizard
})

export default connect(mapStateToProps, mapDispatchToProps)(SigningLoadingContainer)