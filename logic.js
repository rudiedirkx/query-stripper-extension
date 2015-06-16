qs = {
	defaultTokens: [
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
	],

	getTokens: function(callback) {
		chrome.storage.local.get('tokens', function(items) {
			var tokens = items.tokens && items.tokens.length ? items.tokens : qs.defaultTokens;
			callback(tokens);
		});
	},

	stripQuery: function(tokens, url) {
		if (url.indexOf('?') > 0 || url.indexOf('#') > 0) {
			var regex = new RegExp('([?&#])(?:' + tokens.join('|') + ')=[^&#]*', 'ig');
			var filtered = url;
			filtered = filtered.replace(regex, '$1'); // Remove `name=value`
			if ( filtered != url ) {
				filtered = filtered.replace(/([?&#])[?&#]+/g, '$1'); // Replace double ?&# by first occurring
				filtered = filtered.replace(/[?&#]+$/, ''); // Remove trailing ?&#
				return filtered;
			}
		}
	}
};
