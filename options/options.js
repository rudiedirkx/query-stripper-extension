qs.ui = {
	async init() {
		console.time('Options init');
		await qs.ui.tokensToEl();
		qs.ui.attachListeners();
		console.timeEnd('Options init');
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

	async tokensToEl() {
		const $taTokens = document.getElementById('ta-tokens');
		const tokens = await qs.getTokens();
		$taTokens.value = $taTokens.defaultValue = tokens.join("\n");
		qs.ui.fixRows.call($taTokens);
	},

	attachListeners: function() {
		var $formTokens = document.getElementById('form-tokens');
		var $taTokens = document.getElementById('ta-tokens');
		var $formTest = document.getElementById('form-test');
		var $inpTestUrl = document.getElementById('inp-test-url');
		var $msgTestResult = document.getElementById('msg-test-result');
		var savedTimer;

		function saveTokens() {
			var tokens = qs.ui.elToTokens($taTokens);

			function next() {
				$formTokens.classList.add('saved');

				// Update textarea with current tokens
				qs.ui.tokensToEl();
			}

			qs.save(tokens).then(x => qs.loadRules()).then(rules => console.log('rules', rules));

			// Notify user
			$formTokens.classList.add('saved');
			clearTimeout(savedTimer);
			savedTimer = setTimeout(function() {
				$formTokens.classList.remove('saved');
			}, 1500);
		}

		// Save tokens
		$formTokens.addEventListener('submit', function(e) {
			e.preventDefault();
			saveTokens();
		});
		$formTokens.addEventListener('keydown', function(e) {
			if (e.ctrlKey && !e.shiftKey && !e.altKey && e.code === 'KeyS') {
				e.preventDefault();
				saveTokens();
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
