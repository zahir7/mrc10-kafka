var users = require('./couchdb').use('users');

exports.create = function create(user, cb) {
	users.insert(user, user.email, cb);
};

function updtoken(user, ip, expire, renewduration, linkip, forever, autorenew, cb) {
	users.get(user, function (err, result) {
		console.log("IN HERE");
		console.log("RESULT HERE :" + JSON.stringify(result));

		var current_token = {};
		current_token.token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		let tk = current_token.token;
		if (linkip) {
			current_token.tokenip = ip;
		}
		else {
			current_token.tokenip = "nolink";
		}
		current_token.autorenew = autorenew;
		current_token.forever = forever;
		current_token.renewduration = renewduration;
		current_token.expire = Math.round(new Date().getTime() / 1000) + expire;

		if (!result.tokenlist)
			result.tokenlist = Array();
		result.tokenlist.push(current_token);
		users.insert(result, user).then(function () {
			cb(tk);
		});
	});
};

exports.updatetoken = updtoken;

exports.get = function get(id, cb) {
	users.get(id, cb);
};

exports.authByToken = function get(token, ip, cb) {

	var retour = {
		valid: false,
		username: ""
	}
	const q = {
		selector: {
			tokenlist: { $elemMatch: { token: token } },
		},
		limit: 1
	};
	users.find(q).then((doc) => {
		console.log(doc);
		if (!doc.docs[0]) {
			cb(retour);
			return;
		}
		console.log("BEARER USER : " + doc.docs[0]._id);

		//detect token position
		var position = 0;
		doc.docs[0].tokenlist.forEach(function (element) {
			console.log(element);
			if (element.token == token)
				position = doc.docs[0].tokenlist.indexOf(element);
		});


		console.log("token position :" + position);


		var bearer = doc.docs[0]._id;
		var username = doc.docs[0]._id;


		var forever = doc.docs[0].tokenlist[position].forever;
		var expireDate = doc.docs[0].tokenlist[position].expire;
		var tokenIP = doc.docs[0].tokenlist[position].tokenip;
		var autorenew = doc.docs[0].tokenlist[position].autorenew;
		var renewduration = doc.docs[0].tokenlist[position].renewduration;

			console.log("date" + Math.round(new Date().getTime() / 1000));
			console.log("expire" + expireDate);

		if (!forever && Math.round(new Date().getTime() / 1000) > expireDate) {
			//delete expired token
			console.log("expired");
			console.log("date" + Math.round(new Date().getTime() / 1000));
			console.log("expire" + expireDate);
			doc.docs[0].tokenlist.splice(position, 1);

			var result = doc.docs[0];
			users.insert(result, bearer).then(function () {
				cb(retour);
				return;
			});
		}


		if (tokenIP != "nolink" && ip != tokenIP) {
			cb(retour);
			return;
		}


		retour.valid = true;
		retour.username = username;

		if (autorenew) {
			var result = doc.docs[0];
			result.tokenlist[position].expire = Math.round(new Date().getTime() / 1000) + renewduration;

			users.insert(result, bearer).then(function () {
				cb(retour);
				return;
			});
		}
		else {
			cb(retour);
			return;
		}
	});

	/*
  users.get(user, function (err, result) {
	  console.log("IN HERE");
	  console.log("RESULT HERE :" + JSON.stringify(result));

	  result.token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	  result.tokenip = ip;
	  result.expire = Math.round(new Date().getTime()/1000) + expire;

	  users.insert(result, user, cb);

  });
  */
};

exports.comparepwd = function get(id, pwd, cb) {

	var crypto = require('crypto');
	var hash = crypto.createHash('whirlpool');
	//passing the data to be hashed
	data = hash.update(pwd, 'utf-8');
	//Creating the hash in the required format
	gen_hash = data.digest('hex');


	users.get(id, function (err, result) {
		console.log("result : " + JSON.stringify(result))
		if (!result || !result.password) {
			console.log("user not found or request problem")
			cb(err, false);
		}
		else {
			if (gen_hash == result.password) {
				console.log("pass ok")
				cb(err, true);
			}
			else {
				console.log("pass not ok")
				cb(err, false);
			}
		}
	});
};


exports.comparepwd_pub = function get(id, pwd, cb) {

	var crypto = require('crypto');
	var hash = crypto.createHash('whirlpool');
	//passing the data to be hashed
	data = hash.update(pwd, 'utf-8');
	//Creating the hash in the required format
	gen_hash = data.digest('hex');


	var retu = {
		valid: false,
		pubkey: "",
	};

	users.get(id, function (err, result) {
		console.log("result : " + JSON.stringify(result))
		if (!result || !result.password) {
			console.log("user not found or request problem")
			cb(err, retu);
		}
		else {
			if (gen_hash == result.password) {
				console.log("pass ok")
				retu.pubkey = result.pubkey;
				retu.valid = true;
				cb(err, retu);
			}
			else {
				console.log("pass not ok")
				cb(err, retu);
			}
		}
	});
};
