'use strict'

const utils = require('./utils.js');

class Auth {
	constructor() {
		mp.events.add({
			'client-ShowLoginWindow' : () => {
				utils.settingsBeforCEF();
				utils.loadCEF();
				utils.createCamera(3223, 5349, 14, 0, 0, 218, 20);
				utils.toggleInterface('SignUp', false);
				utils.toggleInterface('SignIn', true);
			},

			'client-ShowRegisterWindow' : () => {
				utils.prepareToCef();
				utils.createCam(3223, 5349, 14, 0, 0, 218, 20);
				utils.toggleInterface('SignIp', false);
				utils.toggleInterface('SignUp', true);
			}
		});
	}
}

const auth = new Auth();