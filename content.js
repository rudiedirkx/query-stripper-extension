
(function() {

	// Only for top frame
	try {
		if ( location.href != top.location.href ) {
			return;
		}
	}
	catch (ex) {
		return;
	}



	// Local logic
	var tokens;
	function replaceQuery(url) {
		var nUrl = qs.stripQuery(tokens, url);
		if ( nUrl ) {
			console.warn('Query Stripper did its thing on "' + url + '".');
			history.replaceState({}, '', nUrl);
		}
	}



	// Get tokens from storage
	qs.getTokens(function(stored) {
		tokens = stored;
	});



	// 'Listen' for URL changes (pushState, replaceState, hash)
	var href = location.href;
	function checkQuery() {
		if ( location.href != href ) {
			href = location.href;
			replaceQuery(href);
		}

		requestAnimationFrame(checkQuery);
	}
	requestAnimationFrame(checkQuery);

})();
