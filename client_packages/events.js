mp.events.add('playerDeath', (player) => {
    player.spawn({ "x": -425.517, "y": 1123.620, "z": 325.8544 });
    player.health = 100;
});

mp.events.addCommand("weapon", (player, fullText, weapon, ammo) => {
	let weaponHash = mp.joaat(weapon);
	player.giveWeapon(weaponHash, parseInt(ammo) || 10000);
  });

  mp.events.addCommand('veh', (player, fulltext, model) => {
	mp.vehicles.new(mp.joaat(model), player.position, {
        numberPlate: "ADMIN",
        color: [[0, 255, 0],[0, 255, 0]]
    });
})