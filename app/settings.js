(() => {
	'use strict';
	var low = require('lowdb');
	const db = low('db.json')
	var config;
	try {
		config = db.get('configs').value();
		document.getElementById('cookie').value = config.cookie;
		document.getElementById('projeto').value = config.projeto;
		document.getElementById('urlapi').value = config.urlapi;
	} catch(e) {
		console.log(e);
	}

	document.getElementById('cookie').onblur = () => {
		db.set('configs.cookie', document.getElementById('cookie').value).value();
	};

	document.getElementById('projeto').onblur = () => {
		db.set('configs.projeto', document.getElementById('projeto').value).value();
	};

	document.getElementById('urlapi').onblur = () => {
		db.set('configs.urlapi', document.getElementById('urlapi').value).value();
	};
})();
