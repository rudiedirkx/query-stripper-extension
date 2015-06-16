
// Load & cache tokens from storage
var tokens;
function loadTokens() {
	qs.getTokens(function(stored) {
		tokens = stored;
	});
}



// Attach URL filter
var filter = {
	urls: ["<all_urls>"],
	types: ["main_frame", "sub_frame"],
};
var extraInfoSpec = ['blocking'];
chrome.webRequest.onBeforeRequest.addListener(function(details) {
	var nUrl = qs.stripQuery(tokens, details.url);
	if ( nUrl ) {
		console.warn('Query Stripper did its thing on "' + details.url + '".');
		return {redirectUrl: nUrl};
	}
}, filter, extraInfoSpec);



// Listen for config changes from options page
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	// Options page saved tokens
	if ( msg && msg.RELOAD ) {
		loadTokens();
		console.log('Incoming RELOAD event handled from options page');

		sendResponse();
	}
});
