qs.ui = {
	init: function() {
		console.time('Options init');
		qs.ui.loadTokens(function() {
			qs.ui.attachListeners();
			console.timeEnd('Options init');
		});
	},

	loadTokens: function(callback) {
		var $taTokens = document.querySelector('#ta-tokens');

		qs.getTokens(function(tokens) {
			$taTokens.value = tokens.join("\n");

			callback();
		});
	},

	attachListeners: function() {
		var $formTokens = document.querySelector('#form-tokens');
		var $taTokens = document.querySelector('#ta-tokens');

		function fixRows(e) {
			var min = 5;
			this.rows = min;
			while ( this.clientHeight < this.scrollHeight ) {
				this.rows++;
			}
			this.rows++;
		}

		// Save tokens
		$formTokens.addEventListener('submit', function(e) {
			e.preventDefault();

			var tokens = [];
			$taTokens.value.split("\n").forEach(function(token) {
				if ((token = token.trim()).length) {
					tokens.push(token);
				}
			});

			function next() {
				$formTokens.classList.add('saved');

				// Update textarea with current tokens
				qs.getTokens(function(tokens) {
					$taTokens.value = tokens.join("\n");
					fixRows.call($taTokens);
				});

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
		$taTokens.addEventListener('keyup', fixRows);
		fixRows.call($taTokens);

		// Test URL
		// @todo
	}
};

window.onload = qs.ui.init;
