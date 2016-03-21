// successful log-in
function SignInSuccess(token) {
	return {
		type: 'SIGNINSUCCESS',
		token: token
	};
};

// failed log-in
function SignInFail() {
	return {
		type: 'SIGNINFAIL'
	};
};

function SignOut () {
	document.cookie = "token=; expires=Thu, 01 Jan 1600 00:00:00 UTC";
	return {
		type: 'SUPERLOGOUT'
	};
};
// add a doctor to my doctor list state
function AddDoc (doctor, portrait) { // doctor will be an object, i believe
	return {
		type: 'ADDDOCTOR',
		doctor: {...doctor, portrait: portrait}
	};
};

function RemoveDoc (id) {
	return {
		type: 'REMOVEDOCTOR',
		id: id
	};
};

// this is for populating the doctor search api
function SetDocApi (list) {
	return {
		type: 'SETDOCAPI',
		list: list
	};
};

// this clears the doctor api list
function ClearDocApi () {
	return {
		type: 'CLEARDOCAPI'
	};
};

function SetMyInfo (info) {
	return {
		type: 'SETMYINFO',
		info: info
	};
};

function RemoveEye () {
	return {
		type: 'REMOVEEYE'
	};
};

function AddEye (eye) {
	return {
		type: 'ADDEYE',
		eyerx: eye
	};
};

module.exports = {
	SignInSuccess,
	SignInFail,
	SignOut,
	AddDoc,
	SetDocApi,
	ClearDocApi,
	SetMyInfo,
	RemoveDoc,
	RemoveEye,
	AddEye
};