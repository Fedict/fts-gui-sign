import {FormattedMessage, injectIntl} from "react-intl";
import React, {useState} from "react";
import {connect} from "react-redux";
import {changeOptionAutoDownloadDocument} from "../../wizard/WizardActions";

const ChangeAutoDownloadOption = (props) => {
    const [checked, setChecked] = useState(true);

    function changeChecked(c){
        setChecked(c);
        props.changeOptionAutoDownloadDocument(c);
    }

    return <p className="form-check">
        <input type="checkbox" onChange={(e) => {changeChecked(e.target.checked); }} className="form-check-input" id="downloadDocument" value={checked} defaultChecked={checked}/>
        <label className="form-check-label" htmlFor="downloadDocument"><FormattedMessage id="signing.autodownload" defaultMessage="Download document after signing"/></label>
    </p>
}

const mapStateToProps = (state) => {
    return (state) => ({
    })
}
const mapDispatchToProps = ({
    changeOptionAutoDownloadDocument
})

export default connect(mapStateToProps, mapDispatchToProps)(ChangeAutoDownloadOption);