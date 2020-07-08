const utils = require('../Modules/Utils');
const characterSingleton = require('../Character/CharacterCreator');
const clothesSingleton = require('../Character/Clothes');
const headOverlaySingleton = require('../Character/HeadOverlay');

class PlayerSingleton {
	async createUser(player, username, email, password) {
		await utils.query(`INSERT INTO users (socialclub, username, email, password) VALUES ('${player.socialClub}', '${username}', '${email}', '${password}')`);
	}

	async loadAccount(player, id) {
		const account = await utils.query(`SELECT * FROM users WHERE id = '${id}' LIMIT 1`);
		player.loggedIn = true;
		player.guid = account[0].id;
		player.email = account[0].email;
		player.dimension = 0;
		player.call('client-destroyCameraAndCEF');

		const q1 = characterSingleton.loadPlayerBody(player);
		const q2 = clothesSingleton.loadPlayerClothes(player);
		const q3 = headOverlaySingleton.loadUser(player);

		await Promise.all([q1,q2,q3]);

	}

	loadPlayerTemplate(player) {
		player.loggedIn = false;
		player.guid = false;
		player.username = false;
		player.email = false;
		
	}
}

const playerSingleton = new PlayerSingleton();
module.exports = playerSingleton;