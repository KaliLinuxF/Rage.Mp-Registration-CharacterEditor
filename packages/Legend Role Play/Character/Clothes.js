const utils = require('../Modules/Utils');

const maleSkin = mp.joaat("mp_m_freemode_01");

class ClothesSingletone {
	constructor() {
		this.manTops = [
			{id: 0, under: 15, torso: 0},
			{id: 9, under: 15, torso: 0},
			{id: 13, under: 15, torso: 11},
			{id: 16, under: 15, torso: 0},
			{id: 26, under: 15, torso: 11},
			{id: 33, under: 15, torso: 0},
			{id: 34, under: 15, torso: 0}
		];

		this.womanTops = [
			{id: 0, under: 0, torso: 15},
			{id: 9, under: 9, torso: 9},
			{id: 5, under: 15, torso: 4},
			{id: 78, under: 15, torso: 3},
			{id: 74, under: 15, torso: 15},
			{id: 119, under: 9, torso: 15},
			{id: 2, under: 15, torso: 2},
		];

		this.manHats = [
			{id: 8},
			{id: 5},
			{id: 7},
			{id: 20},
			{id: 28},
			{id: 45},
			{id: 58},
		];

		this.womanHats = [
			{id: 57},
			{id: 5},
			{id: 9},
			{id: 13},
			{id: 20},
			{id: 29},
			{id: 101},
		];

		this.manLegs = [
			{id: 0},
			{id: 3},
			{id: 5},
			{id: 8},
			{id: 15},
			{id: 17},
			{id: 55}
		];

		this.womanLegs = [
			{id: 0},
			{id: 6},
			{id: 11},
			{id: 16},
			{id: 20},
			{id: 31},
			{id: 4}
		];

		this.manFeet = [
			{id: 1},
			{id: 4},
			{id: 9},
			{id: 16},
			{id: 20},
			{id: 29},
			{id: 42}
		];

		this.womanFeet = [
			{id: 1},
			{id: 3},
			{id: 5},
			{id: 6},
			{id: 13},
			{id: 27},
			{id: 31}
		];

	};


		

		setClothes(player, data) {
			if (!player.loggedIn) return;
			if (player.model == maleSkin) {
				this.setManClothes(player, data.title, data);
			}
			else {
				this.setWomanClothes(player, data.title, data);
			}
		}

		

		setManClothes(player, title, data) {

			if(!title) {
				player.setProp(0, this.manHats[data.headdress].id, 0);
				player.setClothes(11, this.manTops[data.tshort].id, 0, 0);
				player.setClothes(3, this.manTops[data.tshort].torso, 0, 0);
				player.setClothes(8, this.manTops[data.tshort].under, 0, 0);
				player.setClothes(4, this.manLegs[data.pants].id, 0, 0);
				player.setClothes(6, this.manFeet[data.footwear].id, 0, 0);
			}

			if (title == "headdress") {
				player.setProp(0, this.manHats[data.headdress].id, 0);
			}
			else if (title == "tshort") {
				player.setClothes(11, this.manTops[data.tshort].id, 0, 0);
				player.setClothes(3, this.manTops[data.tshort].torso, 0, 0);
			    player.setClothes(8, this.manTops[data.tshort].under, 0, 0);
			}
			else if (title === "pants") {
				player.setClothes(4, this.manLegs[data.pants].id, 0, 0);
			}
			else if (title == "footwear") {
				player.setClothes(6, this.manFeet[data.footwear].id, 0, 0);
			}
		}

		setWomanClothes(player, title, data) {
			if(!title) {
				player.setProp(0, this.womanHats[data.headdress].id, 0);
				player.setClothes(11, this.womanTops[data.tshort].id, 0, 0);
				player.setClothes(3, this.womanTops[data.tshort].torso, 0, 0);
			    player.setClothes(8, this.womanTops[data.tshort].under, 0, 0);
				player.setClothes(4, this.womanLegs[data.pants].id, 0, 0);
				player.setClothes(6, this.manFeet[data.footwear].id, 0, 0);
				player.setClothes(6, this.womanFeet[data.footwear].id, 0, 0);
			}

			if (title == "headdress") {
				player.setProp(0, this.womanHats[data.headdress].id, 0);
			}
			else if (title == "tshort") {
				player.setClothes(11, this.womanTops[data.tshort].id, 0, 0);
				player.setClothes(3, this.womanTops[data.tshort].torso, 0, 0);
			    player.setClothes(8, this.womanTops[data.tshort].under, 0, 0);
			}
			else if (title === "pants") {
				player.setClothes(4, this.womanLegs[data.pants].id, 0, 0);
			}
			else if (title == "footwear") {
				player.setClothes(6, this.womanFeet[data.footwear].id, 0, 0);
			}
		}

		async saveClothes(player, data) {
			await utils.query(`UPDATE usersClothes SET hats = '${data.hats}', tops = '${data.tops}', legs = '${data.legs}', feet = '${data.feet}' WHERE id = ${player.guid}`);
		}

		async createNewUser(id) {
			await utils.query(`INSERT INTO usersClothes (id, hats, glasses, tops, legs, feet) VALUES ('${id}', '0', '0', '0', '0', '0');`);
		}

		async loadPlayerClothes(player) {
			const data = await utils.query(`SELECT hats, tops, legs, feet FROM usersClothes WHERE id = '${player.guid}'`);
			
			if(player.model == maleSkin) {
				if(data[0].hats) {
					player.setProp(0, this.manHats[data[0].hats].id, 0);
				}
				
				if (data[0].tops) {
					player.setClothes(11, this.manTops[data[0].tops].id, 0, 0);
					player.setClothes(3, this.manTops[data[0].tops].torso, 0, 0);
					player.setClothes(8, this.manTops[data[0].tops].under, 0, 0);
				}
			
				if (data[0].legs) {
					player.setClothes(4, this.manLegs[data[0].legs].id, 0, 0);
				}
				
				if (data[0].feet) {
					player.setClothes(6, this.manFeet[data[0].feet].id, 0, 0);
				}
			} else {
				if(data[0].hats) {
					player.setProp(0, this.womanHats[data[0].hats].id, 0);
				}
				
				if (data[0].tops) {
					player.setClothes(11, this.womanTops[data[0].tops].id, 0, 0);
					player.setClothes(3, this.womanTops[data[0].tops].torso, 0, 0);
					player.setClothes(8, this.womanTops[data[0].tops].under, 0, 0);
				}
			
				if (data[0].legs) {
					player.setClothes(4, this.womanLegs[data[0].legs].id, 0, 0);
				}
				
				if (data[0].feet) {
					player.setClothes(6, this.womanFeet[data[0].feet].id, 0, 0);
				}
			}
			
		}
}

const clothesSingletone = new ClothesSingletone();
module.exports = clothesSingletone;