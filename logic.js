function stripQuery(url) {
	var remove = [
		// Atlassian
		'atl_medium',
		'atl_camp',
		'atl_camptype',
		'atl_source',

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

		// Others
		'aff_',
		'mtrck',
		'xtor',
		'xtref',
		'xtrck',
	];

	// Generic default case where we actually have a '?' for parameters in the URL
	var q = url.split('?')[1];
	if ( q ) {
		q = '?' + q;
		var regex = new RegExp('([\?\&\#](' + remove.join('|') + ')=[^&#]*)', 'ig');
		var params = [];
		var filtered = q.replace(regex, '').replace(/^&/, '?');
		if ( filtered != q ) {
			var nUrl = url.replace(/\?.+/, function(m) {
				return filtered;
			});
			return nUrl;
		}
	} else {

		// But some sites are sneaky and avoid the above by using anchors (e.g. #xtor=XXX')
		// An example is the french news site leparisien.fr which uses this in its
		// Facebook & Twitter links.
		var r = url.split('#')[1];
		if ( r ) {
			r = '#' + r;
			var regex = new RegExp('([\?\&\#](' + remove.join('|') + ')=[^&#]*)', 'ig');
			var params = [];
			var filtered = r.replace(regex, '');
			if ( filtered != r ) {
				var nUrl = url.replace(/\#.+/, function(m) {
					return filtered;
				});
				return nUrl;
			}
		}
	}
}
