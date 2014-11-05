
var filter = {
	urls: ["<all_urls>"],
	types: ["main_frame"],
};
var extraInfoSpec = ['blocking'];

chrome.webRequest.onBeforeRequest.addListener(function(details) {
	if ( details.type == 'main_frame' ) {
		var nUrl = stripQuery(details.url);
		if ( nUrl ) {
			console.warn('Query Stripper did its thing on "' + details.url + '".');
			return {redirectUrl: nUrl};
		}
	}
}, filter, extraInfoSpec);
