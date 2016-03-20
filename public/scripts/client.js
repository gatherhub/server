var proto = require('msgsrouter/proto');
var md5 = require('crypto-js/md5');

var offset = 0;
var hub = 'lobby';
var name = 'Quark Li';
var email = 'quarkli@gmail.com';
var secret = md5(Date.now().toString()).toString();
var credential = md5(JSON.stringify({hub: hub, name: name, email: email, secret: secret})).toString();

// var peer = new proto.peer({credential: credential, hub: hub, name: name, secret: Date.now().toString(), contact: {email: email}});
var peer = new proto.peer({credential: credential, hub: hub, name: name, secret: secret, contact: {email: email}});

var ws = new WebSocket('wss://localhost:55688');
var send = function() {};

ws.onopen = function(e) {
	console.log('connection opened');

	window.send = send = function(subject, content, to) {
		var msg = new proto.message(peer);
		msg.subject = subject;	
		msg.content = content;
		msg.to = to || [];
		msg.timestamp -= offset;
		ws.send(msg.toString());
	};
};

ws.onclose = function(e) {
	console.log('connection closed');
};

ws.onmessage = function(msg) {
	var message;

    // filter incorrect message, only accept message data in JSON
    try {
        message = new proto.message(JSON.parse(msg.data));
    }
    catch (e) {
        return;
    }

	switch (message.subject) {
		case 'ho':
			var now = Date.now();
			offset = now - message.timestamp + (0 | (now - message.content.orgTS) / 2);
			console.log(offset);
			break;
		case 'peer':
			console.log(message.content);
			break;
		default:
			console.log(message.value());
			break;
	}
};

navigator.geolocation.getCurrentPosition(function(e){
	var coords = e.coords;
	peer.location = {latitude: coords.latitude, longitude: coords.longitude};
	send('hi', peer);
}, function(err) {
	console.log(err);
	peer.location = {latitude: null, longitude: null};
	send('hi', peer);
});
