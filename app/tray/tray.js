'use strict';


var ticketsCount = 0;
var path = require('path');
var electron = require('electron');
var tray;

var _createTray = function(mainWindow) {
	tray = new electron.Tray(path.join(__dirname, '../assets/images/acelerato-logo.png'));
	_createContextMenu();
	setInterval(() => {
		_createContextMenu();
	}, 120 * 1000);

	tray.on('click', () => {
		mainWindow.show();
	});
};

var _createContextMenu = function() {
	var unirest = require('unirest');
	var low = require('lowdb');
	const db = low('db.json')

	try {
		var configs = db.get('configs').value();

		unirest
			.get(configs.urlapi + 'demandas?listas=&tipoDeLista=&releases=&excluido=false&categorias=&tags=&timestamp='+new Date().getTime()+'&atuante=&projetos='+configs.projeto+'&ignorarArquivados=true&modelo=LISTAGEM_DE_DEMANDAS&status=PENDENTES')
			.headers(
				{
					'Cookie': configs.cookie,
					'Accept': '*/*',
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					'X-Requested-With': 'XMLHttpRequest',
					'Accept-Encoding': 'gzip, deflate, sdch'
				}
			)
			.end(response => {
				var contextMenuTemplate = [];
				if (ticketsCount !== response.body.object.length) {
					ticketsCount = response.body.object.length;
					require('node-notifier').notify({
						'title': 'Acelerato',
						'message': 'Você tem novos tickets!',
						'icon': path.join(__dirname, '../assets/images/acelerato-logo.png')
					});
				}

				for (var i = 0; i < response.body.object.length; i++) {
					(ticket => {
						contextMenuTemplate.push({
							label: ticket.ticketKey + ' - ' + ticket.titulo,
							click: () => {
								require('open')(ticket.url);
							}
						});
					})(response.body.object[i]);
				}
				contextMenuTemplate.push({
					label: 'Sair',
					click: () => {
						electron.app.quit();
					}
				});
				var contextMenu = electron.Menu.buildFromTemplate(contextMenuTemplate);
				tray.setContextMenu(contextMenu);
			}
		);
	} catch (e) {
		console.log(e);
	}
}

module.exports = {
	createTray: _createTray,
	createContextMenu: _createContextMenu
};

