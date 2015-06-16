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

	elToTokens: function() {
		var $taTokens = document.querySelector('#ta-tokens');

		var tokens = [];
		$taTokens.value.split("\n").forEach(function(token) {
			if ((token = token.trim()).length) {
				tokens.push(token);
			}
		});
		return tokens;
	},

	tokensToEl: function(callback) {
		var $taTokens = document.querySelector('#ta-tokens');

		qs.getTokens(function(tokens) {
			$taTokens.value = $taTokens.defaultValue = tokens.join("\n");
			qs.ui.fixRows.call($taTokens);

			callback && callback();
		});
	},

	attachListeners: function() {
		var $formTokens = document.querySelector('#form-tokens');
		var $taTokens = document.querySelector('#ta-tokens');

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
		// @todo
	}
};

window.onload = qs.ui.init;
