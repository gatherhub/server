var md5 = require('crypto-js/md5');
var Base = require('msgsrouter/base');
var Peer = Base.Peer;
var Message = Base.Message;
var validateCredential = Base.validateCredential;
var validateMessage = Base.validateMessage;
var lang = navigator.language || navigator.userLanguage;
var label = null;

switch (lang.toLowerCase()) {
	case 'cn':
	case 'zh-cn':
		lang = 'cn';
		break;
	case 'tw':
	case 'zh-tw':
		lang = 'tw';
		break;
	default:
		lang = 'en';
}

if (getCookie('lang')) lang = getCookie('lang');

$.get('/label/' + lang, function(e){
	label = JSON.parse(e);
	if (Object.keys(label).length) {
		Object.keys(label).forEach(function(k) {
			$('#lbl-' + k).html(label[k]);
		});
		setCookie('lang', lang);
	}
});

$('#logo').attr('src', 'images/ghub-logo-c.png');

var msrc = require('msgsrouter/client');
msrc.server = require('./uri');

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function(pos){
		if (pos) {
			msrc.location.coords = {latitude: pos.coords.latitude, longitude: pos.coords.longitude};
		}
		console.dir(msrc.location);
	});
}

msrc.onmessage = function(msg) {
	switch(msg.subject) {
		case 'register':
			switch (msg.content.status) {
				case 200:
					console.log('Login successed');
					setCookie('sessid', msrc.sessid);
					break;
				case 400:
				case 401:
				case 402:
				case 403:
				case 404:
				case 405:
					setCookie('sessid', 0);
					setCookie('autologin', false);
					console.dir(msg.value());
				    logout();
					break;
			}
			break;
		default:
			console.dir(msg.value());
			break;
	}
};

msrc.onclose = function() { logout(); };

var pub = {
	Base: Base,
	Peer: Peer,
	Message: Message,
	validateMessage: validateMessage,
	validateCredential: validateCredential,
	msrc: msrc,
	send: msrc.send,
	logout: logout,
	getCookie: getCookie,
	setCookie: setCookie,
	showDiv: showDiv,
	loadParts: loadParts,
	unloadParts: unloadParts
};

Object.keys(pub).forEach(function(k) { window[k] = pub[k]; });

function showDiv(flag) {
	if (flag) {
		$('div').css({'border-style': 'dotted', 'border-width': '1px'});
	}
	else {
		$('div').css({'border-style': '', 'border-width': ''});
	}
}

function loadParts(parts, parent, next) {
	$.get('/parts/' + parts + '/index.html').then(function(data) {
		try {
			var parts = $(data);
			if (parts.length) $(parent).append(parts);
			next();
		}
		catch (e) {
			console.trace(e);
		}
	});
}

function unloadParts(parts) {
	$('#' + parts).remove();
}

loadParts('mainpage', '#layer1');
loadParts('mainmenu', '#bottomrow', () => {
	mainmenu.setTask(mainmenu.items[3], ()=>{logout();});
});
$('#layer0').show();
$('#layer1').hide();
init();

function init() {
    // load values from cookies if available
    if (getCookie('name')) { $('#name').val(getCookie('name')); }
    if (getCookie('contact')) { $('#contact').val(getCookie('contact')); }
    if (getCookie('remember')) { $('#remember').prop('checked', eval(getCookie('remember'))); }
    if (getCookie('autologin')) { $('#autologin').prop('checked', eval(getCookie('autologin'))); }
    if (getCookie('hidden')) { $('#hidden').prop('checked', eval(getCookie('hidden'))); }

	// auto-login
    if (eval(getCookie('autologin')) && getCookie('sessid') != null) {
    	login();
    	return;
    }

    // Disable button 'Enter' by default
    $('#enter').attr('disabled', true).on('click', function() { login(); });

    $('#name').on('keyup', keyupHandle);
    $('#contact').on('keyup', keyupHandle);
    $('#secret').on('keyup', keyupHandle);
    $('#remember').on('keyup', keyupHandle);
    $('#autologin').on('keyup', keyupHandle);
    $('#hidden').on('keyup', keyupHandle);

    if ($('#name').val().length == 0) {
	   	$('#name').focus().select();
    }
    else if ($('#contact').val().length == 0) {
    	$('#contact').focus().select();
    }
    else {
    	$('#secret').focus().select();
    }

    function keyupHandle(e) {
        if (validate() && e.keyCode == 13) { login(); }
    }

    function validate() {
    	var ret = !!($('#name').val().length && $('#contact').val().length && $('#secret').val().length > 5);
    	$('#enter').attr('disabled', !ret);
    	return ret;
    }
}

function logout() {
	setCookie('autologin', false);
	msrc.send('', 'bye');
	location.reload();
}

function login() {
    // set/clear cookies
    if ($('#remember').is(':checked')) {
        setCookie('name', $('#name').val());
        setCookie('contact', $('#contact').val());
        setCookie('remember', $('#remember').is(':checked'));
        setCookie('autologin', $('#autologin').is(':checked'));
        setCookie('hidden', $('#hidden').is(':checked'));
    }
    else {
        setCookie('name', '');
        setCookie('contact', '');
    }

    // configure peer/hub
    msrc.name = $('#name').val();
    msrc.contact = $('#contact').val();
    if ($('#secret').val().length) msrc.secret = $('#secret').val();
    msrc.sessid = getCookie('sessid') || 0;
    msrc.hidden = getCookie('hidden') == 'true';

    // connect to MSR
    msrc.connect();

    // hide login screen and show communicator screen
    $('#layer0').hide();
    $('#layer1').show();
}

function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}