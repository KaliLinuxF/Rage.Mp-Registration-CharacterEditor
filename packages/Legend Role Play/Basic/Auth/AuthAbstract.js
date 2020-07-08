const crypto = require('crypto');

class AbstractAuth {
	showError(player, cefinterface, control, text) {
		player.call('showError', [cefinterface, control, text]);
	}

	hashPassword(str) {
        const cipher = crypto.createCipher('aes192', 'a pass');
        let encrypted = cipher.update(str, 'utf8', 'hex'); 
        encrypted += cipher.final('hex');
        return encrypted;
    }
}

module.exports = AbstractAuth;