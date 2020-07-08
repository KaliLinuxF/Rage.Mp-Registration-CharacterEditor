const utils = require('./utils.js');
const player = mp.players.local;

mp.events.add({
	'Client-CharCreator-Open': () => {
		utils.settingsBeforCEF();
		utils.loadCEF();
		utils.createCamera(402.1, -999.1, -98.32, 0, 0, 358, 75);
		utils.toggleInterface('CharacterEditor');
	},
	'Client-CharCreator-SetEyeColor': (eyeColor) => {		
		player.setEyeColor(eyeColor);
	},
	'SaveAllData': (strJSON) => {
		mp.events.callRemote('Server-SaveAllData', strJSON);
	},
	'FirstRandom': (strJSON) => {
		mp.events.callRemote('Server-FirstRandom', strJSON);
	},
	'selectTab': (nowIndex, choseIndex) => {

		if(choseIndex == 0) {
			utils.createCamera(402.1, -998.75, -98.32, 0, 0, 358, 75);
		} else if(nowIndex == 1) {
			utils.createCamera(402.1, -998.75, -98.32, 0, 0, 358, 25);
		} else if(nowIndex == 2) {
			utils.createCamera(402.1, -998.75, -98.32, 0, 0, 358, 25);
		} else if(nowIndex == 3) {
			utils.createCamera(402.1, -998.75, -98.32, 0, 0, 358, 25);
		} else if(nowIndex == 4) {
			utils.createCamera(402.1, -998.75, -98.32, 0, 0, 358, 75);
		}
	},
	'Random': () => {
		mp.events.callRemote('Server-Random');
	},
	'method': (obj) => {
		mp.events.callRemote('Browser-CharacterChange', obj);
	}
})