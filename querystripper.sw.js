"use strict";

importScripts('querystripper.logic.js');

function init() {
	qs.loadRules().then(rules => console.log('rules', rules));
}

console.log('sw top level');

// chrome.runtime.onStartup.addListener(function() {
// 	console.log('sw onStartup');
// 	init();
// });

chrome.runtime.onInstalled.addListener(function() {
	console.log('sw onInstalled');
	init();
});

// https://developer.chrome.com/docs/extensions/reference/webNavigation/
// chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
// 	if (details.transitionType !== 'link') return;
// 	console.log(details.url);
// });
