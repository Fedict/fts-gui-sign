import packageJson from '../../../package.json';

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

const DEFAULT_LOCALE  = 'en-US';

export const getCurrentLocaleFrom = function(state){
	let result;
	if(state && state.main && typeof state.main.get === 'function'){
		result = defaults(state.main.get('locale'), window.DEFAULT_LOCALE, DEFAULT_LOCALE);
		if(result === 'en-US' || result === 'fr-BE' || result === 'nl-BE'){
			return result;
		}
	}
	if(state && typeof state.get === 'function'){
		result = defaults(state.get('locale'), window.DEFAULT_LOCALE, DEFAULT_LOCALE);
		if(result === 'en-US' || result === 'fr-BE' || result === 'nl-BE'){
			return result;
		}
	}
	return DEFAULT_LOCALE;
}

export const getCurrentLocale = function(){
	return window.location.pathname.substr(packageJson.homepage.length,2);
}

export const toURIParameters = function(parameters, joinChar){
	let result = Object.keys(parameters).filter((key) => parameters[key] !== undefined && parameters[key] !== '').map((key) => (encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key])));
	return result.join(joinChar?joinChar:'&');
}

export function tryParseJSON (jsonString, valueParseFailed = false){
    try {
        let o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object", 
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }

    return valueParseFailed;
}

export function createMessageWithConfigValues(intl, messageKey){
	let messages = intl.messages;
	if(messages[messageKey]){
		let descriptor       = {
				id : messageKey,
				description : messageKey,
				defaultMessage : messageKey
		};
		let formattedMessage = intl.formatMessage(descriptor, window.config[messageKey]);
		return formattedMessage;
	}
	return undefined;
}

export function getEnvironment(){
	if(window.config && window.config.environment){
		return window.config.environment;
	}
	return undefined;
}

// pass in array and receive a unique array in return
//http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array
// in: array, function to retrieve the key of an item (result must be a string or number)
export function uniqBy(a, key) {
	if(!a){
		return a;
	}
    let seen = {};
    return a.filter(function(item) {
        let k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
}

//converting a file to a dataURL in ES6
//pass url and params 
//returns a promise
export const toDataURL = (url, params) => fetch(url, params)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    }))
	

export const createDelayedAction = (action, timeout) =>{
	return (dispatch) => {
	  setTimeout(() => dispatch(action), timeout);
	} /*This works thanks to thunk*/
}

export function sleep (time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

export function toJS(o) {
	if(o && typeof o.toJS === 'function'){
		return o.toJS();
	}
	return o;
}
export function getLanguage(){
	let language=navigator.languages
		? navigator.languages[0]
		: (navigator.language || navigator.userLanguage)
	return language.substring(0,2);
}

export function initCap(s){
	if(!s || typeof s !== 'string') return s;
	return s.substr(0,1).toLocaleUpperCase() + s.substr(1);
}

export function isEmpty(value){
	return value === undefined || value === '' || value === null;
}

export function removeEmptyMembers(o){
	return Object.keys(o).filter(k => !isEmpty(o[k])).reduce((result, k) => {
		result[k] = o[k];
		return result;
	}, {})
}
export function uuidv4() {
	return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	);
}

/**
 * @param {HTMLImageElement} image - Image File Object
 * @param {Object} crop - crop Object
 * @param {String} fileName - Name of the returned file in Promise
 */
export const getCroppedImg = (image, crop, fileName) => {
	if(crop.unit === '%'){
		crop.width = Math.round(image.width * crop.width / 100);
		crop.height = Math.round(image.height * crop.height / 100);
	}
	console.log('getCroppedImg', crop);
	const canvas = document.createElement('canvas');
	const scaleX = image.naturalWidth / image.width;
	const scaleY = image.naturalHeight / image.height;
	canvas.width = crop.width;
	canvas.height = crop.height;
	const ctx = canvas.getContext('2d');

	ctx.drawImage(
		image,
		crop.x * scaleX,
		crop.y * scaleY,
		crop.width * scaleX,
		crop.height * scaleY,
		0,
		0,
		crop.width,
		crop.height,
	);

	// As Base64 string
	// const base64Image = canvas.toDataURL('image/jpeg');

	// As a blob
	return new Promise((resolve, reject) => {
		canvas.toBlob(blob => {
			blob.name = fileName;
			resolve(blob);
		}, 'image/jpeg', 1);
	});
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