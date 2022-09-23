"use strict";

const qs = {
	PATTERN_GROUP_MAX_LENGTH: 110,

	DEFAULT_TOKENS: [
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

	async loadRules() {
		const tokens = await qs.getTokens();

		const groups = [''];
		let group = 0;
		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i];
			if (groups[group].length + 1 + token.length > qs.PATTERN_GROUP_MAX_LENGTH) {
				groups.push('');
				group++;
			}

			groups[group] += `|${token}`;
		}

		const rules = groups.map((group, i) => {
			const regex = `([\\?\\#\\&])(${group.substr(1)})(=[^&#]*)?`;
			return {
				id: i + 1,
				priority: 3,
				action: {
					type: 'redirect',
					redirect: {
						regexSubstitution: '\\1',
					},
				},
				condition: {
					regexFilter: regex,
					isUrlFilterCaseSensitive: false,
					resourceTypes: ['main_frame', 'sub_frame'],
				},
			};
		});
		await chrome.declarativeNetRequest.updateDynamicRules({
			removeRuleIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
			addRules: rules,
		});
		return rules;
	},

	async getTokens() {
		const items = await chrome.storage.local.get('tokens');
		return items.tokens && items.tokens.length ? items.tokens : qs.DEFAULT_TOKENS;
	},

	save(tokens) {
		return chrome.storage.local.set({tokens});
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
