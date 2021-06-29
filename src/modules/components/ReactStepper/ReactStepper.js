import React, {Component} from 'react';

const Header = (props) => (
    <div className="bs-stepper-header">
        {props.children.map((headerStep, index) => (
            <React.Fragment key={index}>
                {headerStep}
                {index < props.children.length - 1 && <div className={props.lineClassname?props.lineClassname:"line"} />}
            </React.Fragment>
            )
        )}
    </div>
)

const HeaderStep = (props) => (
    <div className={"step" + (props.done?" done":(props.active?" active":" inactive"))}>
        <span className="step-trigger" disabled={props.disabled} id={props.buttonId}>
            <span className="bs-stepper-circle" >{props.done?<i className="bi bi-check"></i>:props.number}</span>
            <span className="bs-stepper-label" id={props.label.length>0?props.label.split(" ").join(""):""}>{props.label}</span>
        </span>
    </div>
)

const Content = (props) => (
    <div>
        {props.children && props.children.map && props.children.map((stepContent, index) => (
            <div className={"content" + (props.activeStep === (index + 1)?" active":"")} key={index}>
                {stepContent}
            </div>
        ))
        }
    </div>
)

class ReactStepper extends Component {
    render() {
        return <div className={"bs-stepper " + (this.props.vertical?"vertical":"")} style={this.props.style}>
            {this.props.children}
        </div>
    }
}

ReactStepper.Header = Header;
ReactStepper.HeaderStep = HeaderStep;
ReactStepper.Content = Content;

export default ReactStepper;
