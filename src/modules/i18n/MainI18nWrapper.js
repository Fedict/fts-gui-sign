import React, {Component, useEffect, useState} from 'react';
import {FormattedMessage, IntlProvider} from "react-intl";
import {connect} from "react-redux";
import {languages} from "../../const";
import {loadMessagesForLocale} from "./actions/i18nActions";
import {defaults, setCookie} from "../utils/helper";

const MainI18nWrapper = (props) => {
	let [stateLocale, setStateLocale] = useState();
	let [loading, setLoading] = useState();
	let [messages, setMessages] = useState({});
	let {locale} = props;

	useEffect(() => {
		if(stateLocale !== props.locale && !loading) {
			let _this = this;
			let localeToFetch = props.locale;
			setLoading(true);
			props.doLoadMessagesForLocale(localeToFetch, (messages) => {
				setMessages(messages);
				setLoading(false);
				setStateLocale(localeToFetch);
			});
			setCookie('language', localeToFetch);
		}
	}, [props.locale]);
	if(locale){
		locale = locale.toLowerCase();
	}
	if(!locale || languages.indexOf(locale) < 0){
		locale = languages[0];
	}
	if(stateLocale && stateLocale !== locale){
		locale = stateLocale;
	}
	let translationsForUsersLocale = defaults(messages, require('../../translations/' + locale + '.json'));
	return (
		<IntlProvider locale={locale} messages={translationsForUsersLocale}>
			{props.children}
		</IntlProvider>
	);
}

function mapStateToProps(state) {
	return {
		locale : state.i18n.language
	}
}

const mapDispatchToProps = dispatch => {
	return {
		doLoadMessagesForLocale : (locale, callback) => {
			dispatch(loadMessagesForLocale(locale, callback));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MainI18nWrapper);