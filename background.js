
var filter = {
	urls: ["<all_urls>"],
	types: ["main_frame", "sub_frame"],
};
var extraInfoSpec = ['blocking'];

var tokens;
getTokens(function(stored) {
	tokens = stored;
});

chrome.webRequest.onBeforeRequest.addListener(function(details) {
	var nUrl = stripQuery(tokens, details.url);
	if ( nUrl ) {
		console.warn('Query Stripper did its thing on "' + details.url + '".');
		return {redirectUrl: nUrl};
	}
}, filter, extraInfoSpec);
