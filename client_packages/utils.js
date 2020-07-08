const player = mp.players.local;
const browserPath = "package://Browser/index.html";
let browser = null;
let camera = null;

// CEF 
function settingsBeforCEF() {
	mp.gui.cursor.visible = true;
	mp.game.ui.displayRadar(false);
	mp.gui.chat.show(false);

}

function loadCEF() {
	if(browser) {
		browser.destroy();
	}
	
	browser = mp.browsers.new(browserPath);
}

function destroyCEF() {
	if(browser) {
		browser.destroy();
		browser = null;
	}

	mp.gui.cursor.visible = false;
	mp.game.ui.displayRadar(true);
	mp.gui.chat.show(true);

}

function toggleInterface(name, state) {
	if(!browser) {
		return;
	} else {
		browser.execute(`toggleInterface('${name}', '${state}');`);
	}
}

function showError(cefinterface, control, text) {
	if(!browser) {
		return;
	} else {
		browser.execute(`getInterface('${cefinterface}').setError('${control}', '${text}');`);
	}
}


// Camera
function createCamera(x, y, z, rx, ry, rz, angle) {
	camera = mp.cameras.new("Camera", {x, y, z}, {x :rx, y: ry, z: rz}, angle);
	camera.setActive(true);
	mp.game.cam.renderScriptCams(true, true, 20000000000000000000000000, false, false);
}

function destroyCamera() {
	if(!camera) {
		return;
	} else {
		camera.setActive(false);
		mp.game.cam.renderScriptCams(false, true, 0, true, true);
		camera.destroy();
		camera = null;
	}
}

function UpdateStaticParams(control, tab, name, jsonParams) {
	if(!browser) return;
	browser.execute(`getInterface('${control}').updateStaticParams('${tab}', '${name}', '${jsonParams}');`);
}

function UpdateInterfaceParams()

exports.toggleInterface = toggleInterface;
exports.destroyCamera = destroyCamera;
exports.createCamera = createCamera;
exports.destroyCEF = destroyCEF;
exports.loadCEF = loadCEF;
exports.settingsBeforCEF = settingsBeforCEF;

mp.events.add({
	'client-DestroyCEF': () => destroyCEF(),

	'client-DestoryCamera': () => destroyCamera(),

	'client-destroyCameraAndCEF': () => {
		destroyCamera();
		destroyCEF();
	},

	'client-ChangeHeading': (angle) => player.setHeading(angle),

	'playerRegister': (strJSON) => mp.events.callRemote('createAccount', strJSON),

	'playerLogin': (strJSON) => mp.events.callRemote('loginAccount', strJSON),

	'showError' : (cefinterface, control, text) => showError(cefinterface, control, text),

	'UpdateStaticParams': (control, tab, name, jsonParams) => {
		UpdateStaticParams(control, tab, name, jsonParams);
	},
	'UpdateInterfaceParams': () => {
		
	}
})