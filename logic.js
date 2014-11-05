
function stripQuery(url) {
	var remove = [
		// Google
		'utm_source',
		'utm_medium',
		'utm_term',
		'utm_campaign',
		'utm_content',
		'utm_cid',
		'utm_reader',

		// Imdb
		'ref_',
	];

	var q = url.split('?')[1];
	if ( q ) {
		q = '?' + q;
		var regex = new RegExp('([\?\&](' + remove.join('|') + ')=[^&#]+)', 'ig');
		var params = [];
		var filtered = q.replace(regex, '').replace(/^&/, '?');
		if ( filtered != q ) {
			var nUrl = url.replace(/\?.+/, function(m) {
				return filtered;
			});
			return nUrl;
		}
	}
}
