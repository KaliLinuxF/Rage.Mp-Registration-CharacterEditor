const mysql = require('./MySql');

class UtilsSingleton {
	dbquery(query) {
		return new Promise((res, rej) => {
			mysql.query(query, null, (err, data) => {
				if(err) {
					console.log(`[DATABASE]: ${query}`);
					return rej(err);
				}
				res(data);
			})
		})
	}

	async query(query) {
		const start = new Date().getTime(); 
		const data = await this.dbquery(query);
		const time = new Date().getTime() - start;
		if (time >= 500) {
			console.log(`'[DATABASE]: ${query}' ends with: ${time / 1000}s`);
		}
		else {
			console.log(`'[DATABASE]: ${query}' ends with: ${time / 1000}s`);
		}
		return data;
	}

	randomNumber(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}

const utilsSingleton = new UtilsSingleton();
module.exports = utilsSingleton;