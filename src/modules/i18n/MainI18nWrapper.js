import React, {Component, useEffect, useState} from 'react';
import {defineMessages, FormattedMessage, IntlProvider} from "react-intl";
import {connect} from "react-redux";
import {languages} from "../../const";
import {chooseLanguage, loadMessagesForLocale} from "./actions/i18nActions";
import {defaults, setCookie} from "../utils/helper";
import {useRouter} from "../utils/useRouter";

const dMessages = defineMessages({
	windowTitle : {
		id : 'title',
		defaultMessage : 'BOSA - Signing Document'
	}
})

const MainI18nWrapper = (props) => {
	const [stateLocale, setStateLocale] = useState();
	const [loading, setLoading] = useState();
	const [messages, setMessages] = useState({});
	const router = useRouter();
	const locale = defaults(languages.indexOf(router.query.language) > -1?router.query.language:props.locale, 'en')
	useEffect(() => {
		let mounted = true;
		if(stateLocale !== locale && !loading) {
			let _this = this;
			let localeToFetch = locale;
			setLoading(true);
			props.doLoadMessagesForLocale(localeToFetch, (messages) => {
				if(mounted){
					setMessages(messages);
					setLoading(false);
					setStateLocale(localeToFetch);
					props.chooseLanguage(localeToFetch);
					if(window && window.document){
						window.document.title = messages[dMessages.windowTitle.id];
					}
				}
			});
			setCookie('language', localeToFetch);
		}

		return function cleanup() {
			mounted = false
		}
	}, [locale]);
	if(!stateLocale){
		return false;
	}
	let translationsForUsersLocale = defaults(messages, require('../../translations/' + stateLocale + '.json'));
	return (
		<IntlProvider locale={stateLocale} messages={translationsForUsersLocale}>
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
		},
		chooseLanguage
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MainI18nWrapper);