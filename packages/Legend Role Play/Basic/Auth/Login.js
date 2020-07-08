const utils = require('../../Modules/Utils');
const AbstractAuth = require('./AuthAbstract');
const playersingletone = require('../Player');

class LoginSingleton extends AbstractAuth {
	async loginPlayer(player, data) {
		const password = this.hashPassword(data.password);
		const account = await utils.query(`SELECT id, username, email, password FROM users WHERE username = '${data.username}' LIMIT 1`);

		if(!account[0]) {
			return this.showError(player, 'SignIn', 'username', 'Имя пользователя не существует.');
		}

		if(account[0].password !== password) {
			return this.showError(player, 'SignIn', 'password', 'Неверный пароль');
		} else if(this.isAlreadyPlaying(account[0].username)) {
			this.showError(player, 'SignIn', 'username', 'Вы уже находитесь в игре.');
			player.loggedIn = false;
			return player.kick('Аккаунт уже в игре.');
		}
		console.log(player.socialClub)
		playersingletone.loadAccount(player, account[0].id);

	}

	isAlreadyPlaying(username) {
        const players = mp.players.toArray();
        for (const player of players) {
            if (!player.loggedIn) continue;
            if (player.username === username) return true;
        }
        return false;
    }

	async loadAccount(player, id) {
		playersingletone.loadAccount(player, id);
	}
}

const loginSingleton = new LoginSingleton();

mp.events.add({
	"loginAccount": async (player, obj) => {
		loginSingleton.loginPlayer(player, JSON.parse(obj));
	}
})