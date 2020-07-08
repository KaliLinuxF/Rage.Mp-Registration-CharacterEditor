const utils = require('../Modules/Utils');
const maleSkin = mp.joaat("mp_m_freemode_01");

class HeadOverlaySingletone {

	constructor() {
		this.manHairs = [
			{id: 0},
			{id: 2},
			{id: 4},
			{id: 11},
			{id: 8},
			{id: 16},
			{id: 51}
		];

		this.womanHairs = [
			{id: 1},
			{id: 10},
			{id: 14},
			{id: 22},
			{id: 41},
			{id: 13},
			{id: 3}
		]

		this.beards = [
			{id: 0},
			{id: 3},
			{id: 2},
			{id: 6},
			{id: 8},
			{id: 9},
			{id: 1}
		]
	}

	setAppereance(player, data) {
		player.setHeadOverlay(0, [data.defects, 1, 0, 0]);
		player.setHeadOverlay(7, [data.skinDamages, 1, 0, 0]);
		player.setHeadOverlay(11, [data.spots, 1, 0, 0]);
		player.setHeadOverlay(3, [data.skinStruct, 1, 0, 0]);
	} 

	setMakeup(player, data) 
	{
		if(player.model != maleSkin) {
			player.setHeadOverlay(8, [data.lipstick, 1, 0, 0]);

			player.setHeadOverlay(5, [data.blush, 1, 0, 0]);
			player.setHeadOverlay(9, [data.moles, 1, 0, 0]);
		}	
	}

	setBeard(player, data) {

		if(!data.title) {
			if(player.model == maleSkin) {
				player.setClothes(2, this.manHairs[data.hairstyle].id, 0,0);
			} else {
				player.setClothes(2, this.womanHairs[data.hairstyle].id, 0,0);
			}

			if(player.model == maleSkin) {
				player.setHeadOverlay(1, [this.beards[data.beard].id, 1,0,0]);
			} else {
				player.setHeadOverlay(1, [-1, 1,0,0]);
			}	

			player.setHeadOverlay(2, [data.eyebrow, 1, 0, 0]);
		}

		if(data.title == 'hairstyle') {
			if(player.model == maleSkin) {
				player.setClothes(2, this.manHairs[data.hairstyle].id, 0,0);
			} else {
				player.setClothes(2, this.womanHairs[data.hairstyle].id, 0,0);
			}
		} else if(data.title == 'beard') {
			if(player.model == maleSkin) {
				player.setHeadOverlay(1, [this.beards[data.beard].id, 1,0,0]);
			} else {
				player.setHeadOverlay(1, [-1, 1,0,0]);
			}	
		} else if(data.title == 'eyebrow') {
			player.setHeadOverlay(2, [data.eyebrow, 1, 0, 0]);
		}	
		
	}

	async saveHeadOverlay(player, data) {
		await utils.query(`UPDATE usersHeadOverlay SET hair = '${data.hair}', brow = '${data.brow}', beard = '${data.beard}' WHERE id = ${player.guid}`);
	}


	async loadUser(player) {

			const data = await utils.query(`SELECT * FROM usersHeadOverlay WHERE id = ${player.guid}`);

			if(player.model == maleSkin) {
				player.setClothes(2, this.manHairs[data[0].hair].id, 0, 0 );
				player.setHeadOverlay(1, [this.beards[data[0].beard].id, 1,0,0]);
			} else {
				player.setClothes(2, this.womanHairs[data[0].hair].id, 0, 0);
			}

			
			player.setHeadOverlay(2, [data[0].brow, 1, 0, 0]);
	}

	async createNewUser(id) {
		const hair = 0;
		const hairColor = 0
		const brow = 0
		const beard = 0
		await utils.query(`INSERT INTO usersHeadOverlay (id, hair, hairColor, brow, beard) VALUES ('${id}', '${hair}', '${hairColor}', '${brow}', '${beard}');`);
	}
}
const headOverlaySingletone = new HeadOverlaySingletone();
module.exports = headOverlaySingletone;