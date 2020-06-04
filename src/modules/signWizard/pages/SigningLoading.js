import React from 'react'
import { CardLoading } from '../../components/Card/CardLoading'
import { connect } from 'react-redux'
import { resetWizard } from '../actions/WizardLogicActions'

export class SigningLoadingContainer extends React.Component {

    componentDidMount() {

    }

    render() {

        const { resetWizard } = this.props
        return (
            
                <CardLoading title={"Sign document"}
                    hasCancelButton
                    cancelButtonText="Cancel"
                    onClickCancel={() => { resetWizard() }}
                >

                </CardLoading>
            
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