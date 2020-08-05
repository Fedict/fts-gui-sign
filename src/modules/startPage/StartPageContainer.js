import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { CardContainer } from '../components/Card/CardContainer'
import { MethodeSelectCard } from '../components/MethodSelect/MethodSelectCard'


export class StartPageContainer extends React.Component {

    render() {

        const { history } = this.props

        return (

            <div className={"container"}>
                <CardContainer
                    title="Select the method to sign"
                >
                    <MethodeSelectCard
                        index={0}
                        id={"MethodSelect"}
                        name={"eID"}
                        onClick={() => { history.push('/sign') }}
                        imgSrc={"./img/SignIcons/personIcon.svg"} />
                    <MethodeSelectCard
                        index={1}
                        id={"MethodSelect"}
                        name={"something else"}
                        url={"https://www.google.com/"}
                        imgSrc={"./img/SignIcons/emailIcon.svg"} />
                </CardContainer>
            </div>
        )
    }


}
const mapStateToProps = (state) => {
    return (state) => ({
        reader: state.reader
    })
}
const mapDispatchToProps = ({
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StartPageContainer))