const utils = require('../Modules/Utils');
const clothesSingleton = require('./Clothes');
const headOverlaySingleton = require('./HeadOverlay');


const maleSkin = mp.joaat("mp_m_freemode_01");
const fameleSkin = mp.joaat("mp_f_freemode_01");

class CharCreator {
	constructor() {
		this.dimension = 2;
		
		mp.events.add({
			'Browser-CharacterChange': async (player, obj) => {
				const data = JSON.parse(obj);
				if(data.title == 'sex') {
					if(data.changes.sex == 0) {
						player.model = maleSkin;
					} else {
						player.model = fameleSkin;
					}

					this.changeTabNames(player);

					const q1 = clothesSingleton.loadPlayerClothes(player);
					const q2 = headOverlaySingleton.loadUser(player);

					await Promise.all([q1, q2]);

				} else if(data.title == 'dnk') {
					const skinOption = {
						father: data.changes.father,
						mother: data.changes.mother,
						skinColor: data.changes.skinColor,
						shapeMix: data.changes.similarity
					}

					player.setHeadBlend(skinOption.father, skinOption.mother, 0, skinOption.father, skinOption.mother, 0, skinOption.shapeMix, skinOption.skinColor, 0);
				} else if(data.title == 'clothes') {
					const clothes = {
						title: data.changes.title,
						headdress: data.changes.headdress,
						tshort: data.changes.tshort,
						pants: data.changes.pants,
						footwear: data.changes.footwear
					}

					clothesSingleton.setClothes(player, clothes);
				} else if(data.title == 'face') {
					const face = {
						noseWitdh: data.changes.noseWitdh,
						noseHeight: data.changes.noseHeight,
						noseLength: data.changes.noseLength,
						noseBridge: data.changes.noseBridge,
						eyeIncision: data.changes.eyeIncision,
						lipVolume: data.changes.lipVolume
					}

					this.setFace(player, JSON.stringify(face));
				} else if(data.title == 'facestruct') {
					const faceStruct = {
						javWitdh: data.changes.javWitdh,
						javHeight: data.changes.javHeight,
						chinLength: data.changes.chinLength,
						chinOffset: data.changes.chinOffset,
						chinWidth: data.changes.chinWidth,
						chinForm: data.changes.chinForm,
						chinGirth: data.changes.chinGirth,
					}
					

					this.setFaceStruct(player, JSON.stringify(faceStruct));
				} else if(data.title == 'appearance') {
					const appearance = {
						defects: data.changes.defects,
						skinDamages: data.changes.skinDamages,
						spots: data.changes.spots,
						skinStruct: data.changes.skinStruct
					}

					headOverlaySingleton.setAppereance(player, appearance);
				} else if(data.title == 'makeup') {

					switch (data.changes.eyeColor) {
						case '#64B8E6':
							data.changes.eyeColor = 3;
							break;
						case '#B5958A':
							data.changes.eyeColor = 10;
							break;
						case '#17815D':
							data.changes.eyeColor = 25
							break;
						case '#9F9F9F':
							data.changes.eyeColor = 39;
							break;
						case '#BCA284':
							data.changes.eyeColor = 31
							break;
						case '#78ACB3':
							data.changes.eyeColor = 12;
							break;
						default:
							data.changes.eyeColor = 0;
							break;
					}

					const makeupAr = {
						blush: data.changes.blush - 1,
						lipstick: data.changes.lipstick - 1,
						moles: data.changes.moles - 1
					}

					player.call('Client-CharCreator-SetEyeColor', [data.changes.eyeColor]);
					headOverlaySingleton.setMakeup(player, makeupAr);

				} else if(data.title == 'beard') {	
					const beardData = {
						hairstyle: data.changes.hairstyle,
						beard: data.changes.beard,
						eyebrow: data.changes.eyebrow,
						title: data.changes.title,
						lipstick: data.changes.lipstick
					}

					headOverlaySingleton.setBeard(player, beardData);
				}
			},
			'Server-SaveAllData': async(player, strJSON) => {
				const data = JSON.parse(strJSON);


				const saveClothes = {
					hats: data.clothes.headdress,
					tops: data.clothes.tshort,
					legs: data.clothes.pants,
					feet: data.clothes.footwear
				}

				const saveHeadOverlay = {
					hair: data.beard.hairstyle,
					brow: data.beard.eyebrow,
					beard: data.beard.beard
				}

				const saveBody = {
					gender: data.dnk.gender,
					skinData: {
						father: data.dnk.father,
						mather: data.dnk.mother,
						shapeMix: data.dnk.similarity,
						skinColor: data.dnk.skinColor
					},
					faceData: {
						face: {
							noseWitdh: data.face.noseWitdh,
							noseHeight: data.face.noseHeight,
							noseLength: data.face.noseLength,
							noseBridge: data.face.noseBridge,
							eyeIncision: data.face.eyeIncision,
							lipVolume: data.face.lipVolume
						},
						faceStruct: {
							javWitdh: data.facestruct.javWitdh,
							javHeight: data.facestruct.javHeight,
							chinLength: data.facestruct.chinLength,
							chinOffset: data.facestruct.chinOffset,
							chinWidth: data.facestruct.chinWidth,
							chinForm: data.facestruct.chinForm,
							chinGirth: data.facestruct.chinGirth
						}
					},
					appearance: {
						defects: data.appearance.defects,
						skinDamages: data.appearance.skinDamages,
						spots: data.appearance.spots,
						skinStruct: data.appearance.skinStruct
					},
					makeup: {
						eyeColor: data.makeup.eyeColor,
						blush: data.makeup.blush - 1,
						lipstick: data.makeup.lipstick - 1,
						moles: data.makeup.moles - 1
					}
				}

				const q1 = clothesSingleton.saveClothes(player, saveClothes);
				const q2 = headOverlaySingleton.saveHeadOverlay(player, saveHeadOverlay)
				const q3 = this.saveBody(player, saveBody);
				

				await Promise.all([q1, q2, q3]);

				player.call('client-destroyCameraAndCEF');
				player.dimension = 0;
				player.spawn(new mp.Vector3(-425.517, 1123.620, 325.8544));
				
			},
			'Server-FirstRandom': async(player, strJSON) => {
				const data = JSON.parse(strJSON);

				if(!utils.randomNumber(0,1)) {
					player.model = maleSkin;
				} else {
					player.model = fameleSkin;
				}

				this.changeTabNames(player);

				const q1 = clothesSingleton.loadPlayerClothes(player);
				const q2 = headOverlaySingleton.loadUser(player);

				await Promise.all([q1, q2]);

				
				player.setHeadBlend(utils.randomNumber(0,20), utils.randomNumber(21, 41), 0, utils.randomNumber(0,20), utils.randomNumber(21, 41), 0, data.dnk.shapeMix, data.dnk.skinColor, 0);
				this.setFace(player, JSON.stringify(data.face));
				this.setFaceStruct(player, JSON.stringify(data.facestruct));
				headOverlaySingleton.setAppereance(player, data.appearance);

				const beard = {
					hairstyle: utils.randomNumber(0, 6),
					eyebrow: utils.randomNumber(0, 6),
					beard: utils.randomNumber(0, 6)
				}

				const clothes = {
					headdress: utils.randomNumber(0, 6),
					tshort: utils.randomNumber(0, 6),
					pants: utils.randomNumber(0, 6),
					footwear: utils.randomNumber(0, 6)
				}

				if(player.model == maleSkin) {
					headOverlaySingleton.setBeard(player, beard);
				}

				clothesSingleton.setClothes(player, clothes);	
			},
			'Server-Random': async(player) => {
				if(!utils.randomNumber(0,1)) {
					player.model = maleSkin;
				} else {
					player.model = fameleSkin;
				}

				this.changeTabNames(player);

				const q1 = clothesSingleton.loadPlayerClothes(player);
				const q2 = headOverlaySingleton.loadUser(player);

				await Promise.all([q1, q2]);

				
				player.setHeadBlend(utils.randomNumber(0,20), utils.randomNumber(21, 41), 0, utils.randomNumber(0,20), utils.randomNumber(21, 41), 0, 0.3, 0.7, 0);
				
				const beard = {
					hairstyle: utils.randomNumber(0, 6),
					eyebrow: utils.randomNumber(0, 6),
					beard: utils.randomNumber(0, 6)
				}

				const clothes = {
					headdress: utils.randomNumber(0, 6),
					tshort: utils.randomNumber(0, 6),
					pants: utils.randomNumber(0, 6),
					footwear: utils.randomNumber(0, 6)
				}

				const face = {
					noseWitdh: -0.08,
					noseHeight: -0.1,
					noseLength: -0.3,
					noseBridge: -0.6,
					eyeIncision: 0.5,
					lipVolume: -0.1
				}

				const facestruct = {
					javWitdh: -0.1,
					javHeight: -0.8,
					chinLength: -1,
					chinOffset: 0.3,
					chinWidth: -0.6,
					chinForm: 0.7,
					chinGirth: 0.4
				}

				if(player.model == maleSkin) {
					headOverlaySingleton.setBeard(player, beard);
				}

				this.setFaceStruct(player, JSON.stringify(facestruct));
				this.setFace(player, JSON.stringify(face));
				clothesSingleton.setClothes(player, clothes);	
			}
		});
	}

	async saveBody(player, data) {
		let gender = null;

		if(data.gender == 0) {
			gender = 'm';
		} else {
			gender = 'w';
		}

		const skinData = JSON.stringify(data.skinData);
		const face = JSON.stringify(data.faceData.face);
		const faceStruct = JSON.stringify(data.faceData.faceStruct);
		const appearance = JSON.stringify(data.appearance);
		const makeup = JSON.stringify(data.makeup);

		await utils.query(`UPDATE usersBody SET gender = '${gender}', skindata = '${skinData}', facedata = '${face}', facestruct = '${faceStruct}', appearance = '${appearance}', makeup = '${makeup}' WHERE id = ${player.guid}`);
	}

	async createNewUser(id) {
		await utils.query(`INSERT INTO usersBody (id, gender) VALUES ('${id}', NULL);`);
	}
	
	changeDimenstion() {
		this.dimension++
		if (this.dimension === 500)	this.dimension = 2;
	}

	changeTabNames(player) {
		if(player.model == maleSkin) {
			const headdressNames = ['Ничего', 'Шапка', 'Белая шапка', 'Панамка', 'Синяя шапка', 'Кепка'];
			const tshortsNames = ['Белая', 'Лакоста', 'Рубашка', 'Серая', 'Синяя рубашка', 'В полоску'];
			const pantsNames = ['Обычные', 'Белые', 'Модные', 'Джинсы', 'Шорты', 'Коричневые шорты', 'Адидас'];
			const footwearNames = ['Чёрные кросовки', 'Синие кросовки', 'Белоснежные кросовки', 'Шлёпки', 'Туфли', 'Золотые кросовки', 'Кеды'];

			player.call('UpdateStaticParams', ['CharacterEditor', 'clothes', 'headresses', JSON.stringify(headdressNames)]);
			player.call('UpdateStaticParams', ['CharacterEditor', 'clothes', 'tshorts', JSON.stringify(tshortsNames)]);
			player.call('UpdateStaticParams', ['CharacterEditor', 'clothes', 'pants', JSON.stringify(pantsNames)]);
			player.call('UpdateStaticParams', ['CharacterEditor', 'clothes', 'footwears', JSON.stringify(footwearNames)]);

		} else {
			const headdressNames = ['Ничего', 'Шапка', 'Кепка', 'Шляпа', 'Ковбойская шляпа', 'Синяя шапка'];
			const tshortsNames = ['Белая', 'Рубашка', 'Топик', 'Толстовка', 'Рубашка', 'Простая'];
			const pantsNames = ['Обычные', 'Штаны', 'Въетнамские штаны', 'Шортики', 'Каво', 'Лосины', 'С подкатами'];
			const footwearNames = ['Чёрные кросовки', 'Синие кросовки', 'Белоснежные кросовки', 'Шлёпки', 'Туфли', 'Золотые кросовки', 'Кеды'];

			player.call('UpdateStaticParams', ['CharacterEditor', 'clothes', 'headresses', JSON.stringify(headdressNames)]);
			player.call('UpdateStaticParams', ['CharacterEditor', 'clothes', 'tshorts', JSON.stringify(tshortsNames)]);
			player.call('UpdateStaticParams', ['CharacterEditor', 'clothes', 'pants', JSON.stringify(pantsNames)]);
			player.call('UpdateStaticParams', ['CharacterEditor', 'clothes', 'footwears', JSON.stringify(footwearNames)]);
		}
	}

	openEditor(player) {
		player.model = maleSkin;
		player.position = new mp.Vector3(402.55, -996.37, -99.01);
		player.heading = 180;
		player.dimension = this.dimension;
		this.changeDimenstion();

		player.call("Client-CharCreator-Open");

		this.changeTabNames(player);
	}

	async loadPlayerBody(player) {
		const data = await utils.query(`SELECT * FROM usersBody WHERE id = '${player.guid}'`);

		if (!data[0].gender) return this.openEditor(player);
		if (data[0].gender === 'm') player.model = maleSkin;
		else if (data[0].gender === 'w') player.model = fameleSkin;

		this.setBody(player, data[0].skindata);
		this.setFace(player, data[0].facedata);
		this.setFaceStruct(player, data[0].facestruct);
		this.setAppearance(player, data[0].appearance);
		this.setMakeup(player, data[0].makeup);
	}

	setBody(player, strJSON) {
		const skindata = JSON.parse(strJSON);
		player.setHeadBlend(skindata.father, skindata.mather, 0, skindata.father, skindata.mather, 0, skindata.skinColor, 0, false);
	}

	setFace(player, strJSON) {
		const facedata = JSON.parse(strJSON);
		
		player.setFaceFeature(0, facedata.noseWitdh);
		player.setFaceFeature(1, facedata.noseHeight);
		player.setFaceFeature(2, facedata.noseLength);
		player.setFaceFeature(3, facedata.noseBridge);
		player.setFaceFeature(11, facedata.eyeIncision);
		player.setFaceFeature(12, facedata.lipVolume);
		
	}

	setFaceStruct(player, strJSON) {
		const faceStruct = JSON.parse(strJSON);
		player.setFaceFeature(13, faceStruct.javWitdh);
		player.setFaceFeature(14, faceStruct.javHeight);
		player.setFaceFeature(15, faceStruct.chinLength);
		player.setFaceFeature(16, faceStruct.chinOffset);
		player.setFaceFeature(17, faceStruct.chinWidth);
		player.setFaceFeature(18, faceStruct.chinForm);
		player.setFaceFeature(19, faceStruct.chinGirth);
	}

	setAppearance(player, strJSON) {
		const appearance = JSON.parse(strJSON);

		player.setHeadOverlay(0, [ appearance.defects, 1, 0, 0 ]);
		player.setHeadOverlay(7, [ appearance.skinDamages, 1, 0, 0 ]);
		player.setHeadOverlay(11,[ appearance.spots, 1, 0, 0 ]);
		player.setHeadOverlay(3, [ appearance.skinStruct, 1, 0, 0 ]);
	}

	setMakeup(player, strJSON) {
		const makeup = JSON.parse(strJSON);

		player.setHeadOverlay(8, [ makeup.lipstick, 1, 0, 0 ]);

		player.setHeadOverlay(5, [ makeup.blush, 1, 0, 0 ]);
		player.setHeadOverlay(9, [ makeup.moles, 1, 0, 0 ]);
	}

}

const charCreator = new CharCreator();
module.exports = charCreator;