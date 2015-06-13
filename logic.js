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

	if (url.indexOf('?') > 0 || url.indexOf('#') > 0) {
		var q = url;
		var regex = new RegExp('([\?\&\#](' + remove.join('|') + ')=[^&#]*)', 'ig');
		var params = [];
		var filtered = q.replace(regex, '').replace(/(?:\?|\&)/, '?');
		if ( filtered != q ) {
			return filtered;
		} else {
			return q;
		}
	} 
}
