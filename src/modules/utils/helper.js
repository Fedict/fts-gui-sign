//same as _.defaults
export const defaultsExcludeEmpty = function(){
	return Array.from(arguments).find((element) => element !== undefined && element !== null && element !== '');
}
export const defaults = function(){
	return Array.from(arguments).find((element) => element !== undefined && element !== null);
/* same as:
	for(let i = 0; i < arguments.length; i++){
		if(arguments[i] !== undefined) return arguments[i];
	}
	return undefined;
*/
}

export const createDelayedAction = (action, timeout) =>{
	return (dispatch) => {
	  setTimeout(() => dispatch(action), timeout);
	} /*This works thanks to thunk*/
}

export function sleep (time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

export const setCookie = (cname, cvalue) => {
	var d = new Date();
	d.setTime(d.getTime() + (3000*24*60*60*1000));
	document.cookie = `${cname}=${cvalue};expires=${d.toUTCString()}`;
}

export const getCookie = (cname) => {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

export function getStackTrace () {
	let stack;

	try {
		throw new Error('');
	}
	catch (error) {
		stack = error.stack || '';
	}

	stack = stack.split('\n').map(function (line) { return line.trim(); });
	return stack.splice(stack[0] == 'Error' ? 2 : 1);
}

const parseErrorMessagePartNames = ['ref', 'type', 'details']

/**
 * parses the error message and returns an object
 * @param errorMessage
 * @returns {
 *     ref,
 *     type,
 *     details
 * }
 */
export function parseErrorMessage(errorMessage){
	const split = (errorMessage && errorMessage.split('||')) || []
	return (1 < split.length && split.length <= parseErrorMessagePartNames.length && split.reduce((result, errorPart, errorPartIndex) => {
		if(errorPartIndex < parseErrorMessagePartNames.length){
			result[parseErrorMessagePartNames[errorPartIndex]] = errorPart;
		}
		return result;
	}, {})) || errorMessage;
}

export const getBEUrl = () => {
	return (window && window.configData) ? window.configData.BEurl : ""
}