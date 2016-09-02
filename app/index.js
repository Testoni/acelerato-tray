'use strict';
const electron = require('electron');
const app = electron.app;
var tray = require('./tray/tray.js');
var path = require('path');

require('electron-debug')();

let mainWindow;

function onClosed() {
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 600,
		height: 400
	});

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {

});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});



app.on('ready', () => {
	mainWindow = createMainWindow();
	tray.createTray(mainWindow);

	require('node-notifier').notify({
		'title': 'Acelerato',
		'message': 'Seus tickets aparecerão no Tray',
		'icon': path.join(__dirname, 'assets/images/acelerato-logo.png')
	});
});

