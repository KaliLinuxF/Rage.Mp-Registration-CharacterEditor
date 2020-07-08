const AbstractAuth = require('./AuthAbstract');
const utils = require('../../Modules/Utils');
const playerSingleton = require('../Player');
const characterSingleton = require('../../Character/CharacterCreator');
const clothesSingleton = require('../../Character/Clothes');
const headOverlaySingleton = require('../../Character/HeadOverlay');

class RegisterSingleton extends AbstractAuth {
	async checkUser(player, data) {

		const userExist = await utils.query(`SELECT username FROM users WHERE username = '${data.username}' LIMIT 1`);
		if(userExist[0]) {
			this.showError(player, 'SignUp', 'username', 'Такой пользователь существует.');
			return false;
		}

		const emailExist = await utils.query(`SELECT email FROM users WHERE email = '${data.email}' LIMIT 1`);
		if(emailExist[0]) {
			this.showError(player, 'SignUp', 'email', 'Такая почта уже зарегистрирована.');
			return false;
		}

		return true;
	}

	async createAccount(player, data) {
		if(await this.checkUser(player, data)) {
			

			const password = this.hashPassword(data.password);
			await playerSingleton.createUser(player, data.username, data.email, password);

			const id = await utils.query('SELECT id FROM users ORDER BY id DESC LIMIT 1');

			const q1 = characterSingleton.createNewUser(id[0].id);
			const q2 = clothesSingleton.createNewUser(id[0].id);
			const q3 = headOverlaySingleton.createNewUser(id[0].id);

			

			await Promise.all([q1, q2, q3]);

			playerSingleton.loadAccount(player, id[0].id);
		}
	}
}

const registerSingleton = new RegisterSingleton();

mp.events.add({
	"playerReady": async (player) => {
		player.spawn(new mp.Vector3(3222, 5376,20));
		player.dimension = 1001;
		playerSingleton.loadPlayerTemplate(player);
		player.call('client-ShowLoginWindow');

		const sb = await utils.query(`SELECT username FROM users WHERE socialclub = '${player.socialClub}'`);
		console.log(';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;')
		if(sb[0]) {
			console.log('cavo')
		}
	},
	"createAccount": async (player, obj) => {
		registerSingleton.createAccount(player, JSON.parse(obj));
	}
})
