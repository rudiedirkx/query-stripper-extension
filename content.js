
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

	function replaceQuery(url) {
		var nUrl = stripQuery(url);
		if ( nUrl ) {
			console.warn('Query Stripper did its thing on "' + url + '".');
			history.replaceState({}, '', nUrl);
		}
	}

	// Immediately
	replaceQuery(location.href);

	// When the URL changes (only via pushState & replaceState?)
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
