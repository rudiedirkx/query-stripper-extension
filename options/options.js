qs.ui = {
	init: function() {
		console.time('Options init');
		qs.ui.tokensToEl(function() {
			qs.ui.attachListeners();
			console.timeEnd('Options init');
		});
	},

	fixRows: function() {
		var min = 5;
		this.rows = min;
		while ( this.clientHeight < this.scrollHeight ) {
			this.rows++;
		}
		this.rows++;
	},

	strToTokens: function(str) {
		var tokens = [];
		str.split("\n").forEach(function(token) {
			if ((token = token.trim()).length) {
				tokens.push(token);
			}
		});
		return tokens;
	},

	elToTokens: function() {
		var $taTokens = document.getElementById('ta-tokens');
		return qs.ui.strToTokens($taTokens.value);
	},

	tokensToEl: function(callback) {
		var $taTokens = document.getElementById('ta-tokens');

		qs.getTokens(function(tokens) {
			$taTokens.value = $taTokens.defaultValue = tokens.join("\n");
			qs.ui.fixRows.call($taTokens);

			callback && callback();
		});
	},

	attachListeners: function() {
		var $formTokens = document.getElementById('form-tokens');
		var $taTokens = document.getElementById('ta-tokens');
		var $formTest = document.getElementById('form-test');
		var $inpTestUrl = document.getElementById('inp-test-url');
		var $msgTestResult = document.getElementById('msg-test-result');

		// Save tokens
		$formTokens.addEventListener('submit', function(e) {
			e.preventDefault();

			var tokens = qs.ui.elToTokens($taTokens);

			function next() {
				$formTokens.classList.add('saved');

				// Update textarea with current tokens
				qs.ui.tokensToEl();

				// Trigger bg script reload
				chrome.runtime.sendMessage({RELOAD: true}, function(response) {
					console.timeEnd('Saved and reloaded');

					setTimeout(function() {
						$formTokens.classList.remove('saved');
					}, 1000);
				});
			}

			// Reset to defaults
			console.time('Saved and reloaded');
			if (!tokens.length) {
				chrome.storage.local.remove('tokens', next);
			}
			// Save custom tokens
			else {
				chrome.storage.local.set({"tokens": tokens}, next);
			}
		});

		// Tokens textarea size
		$taTokens.addEventListener('keyup', function(e) {
			if (this.lastValue === undefined) {
				this.lastValue = this.defaultValue;
			}

			if (this.value != this.lastValue) {
				qs.ui.fixRows.call(this);
			}
		});

		// Test URL
		$formTest.addEventListener('submit', function(e) {
			e.preventDefault();

			function result(msg) {
				$formTest.classList.add('result');
				$msgTestResult.innerHTML = msg;

				setTimeout(function() {
					$formTest.classList.remove('result');
				}, 1000);
			}

			var tokens = qs.ui.strToTokens($taTokens.value);
			if ( !tokens.length ) {
				return result('No tokens, no filtering');
			}

			var url = $inpTestUrl.value.trim();
			var nUrl = qs.stripQuery(tokens, url);
			if ( !nUrl ) {
				return result('Okay. Nothing in this URL was filtered out.');
			}

			return result('MATCH. Params were filtered. New URL: <code>' + nUrl + '</code>');
		});
	}
};

window.onload = qs.ui.init;
