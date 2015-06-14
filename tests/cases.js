// Paste into background script console and manually check results
([
	// Examples
	'http://example.com/?utm_source=foo&bar=keep',
	'http://example.com/?bar=keep&utm_source=foo',
	'http://example.com/?utm_source=foo&utm_medium=bar&keep=1',
	'http://example.com/#utm_source=foo&utm_medium=bar&keep=1',
	'http://example.com/?utm_source=foo&utm_medium=bar&keep=1#utm_source=foo&utm_medium=bar&keep=1',

	// Real life
	'https://css-tricks.com/color-filters-can-turn-your-gray-skies-blue/?utm_source=CSS-Weekly&utm_campaign=&utm_medium=email',
	'http://www.imdb.com/title/tt1964157/?ref_=ttep_ep1#xtref=evil',
	'http://www.leparisien.fr/foo/bar.php#xtor=AD-1481423552&xtref=https%3A%2F%2Fwww.facebook.com%2F&keep=1',
]).forEach(function(url) {
	console.log(stripQuery(url));
});
