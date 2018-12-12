var promise = require('bluebird');

var options = {
    // Initialization Options
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://miguel:12345@localhost:5432/leeve';
var db = pgp(connectionString);

// add query functions

function getAllUsers(req, res, next) {
    let geoPoint = {
        latitude: parseFloat(req.body.latitude),
        longitude: parseFloat(req.body.longitude),
        radius: parseInt(req.body.distanceFromUser) * 1000
    };

    console.log(req);
    console.log(req.body);

    db.any('SELECT * FROM users WHERE earth_distance(ll_to_earth(${latitude}, ${longitude}), ll_to_earth(users.latitude, users.longitude)) < ${radius} ORDER BY earth_distance(ll_to_earth(${latitude}, ${longitude}), ll_to_earth(users.latitude, users.longitude)) ASC;', geoPoint).then((data) => {
        res.status(200).json({
            status: 'success',
            data: data,
            message: 'GET ALL USERS !'
        });
    }).catch((err) => {
        console.error(err);
        return next(err);
    });
}

function getUser(req, res, next) {
    res.status(200).send('ok');
}

function createUser(req, res, next) {
    let user = req.body;

    db.none('INSERT INTO users(uid, firstName, visitedCountries, blockUsers, birthday, gender, description, latitude, longitude, avatarUrl, learnedLanguages, nativeLanguages, desiredLanguages, hobbyList, notificationToken, createdAt, email, distanceFromUser, inviteCode, status, inviteLeeves, statusFilter, notifsMsgs, notifsLeeves, bannedReason, cardUsersChangedAt, cardUsers, mapUsers, passedLeever, requests, leevers) ' +
        'values(${uid}, ${firstName}, ${visitedCountries}, ${blockedUsers}, ${birthday}, ${gender}, ${description}, ${latitude}, ${longitude}, ${avatarUrl}, ${learnedLanguages}, ${nativeLanguages}, ${desiredLanguages}, ${hobbyList}, ${notificationToken}, ${createdAt}, ${email}, ${distanceFromUser}, ${inviteCode}, ${status}, ${inviteLeeves}, ${statusFilter}, ${notifsMsgs}, ${notifsLeeves}, ${bannedReason}, ${cardUsersChangedAt}, ${cardUsers}, ${mapUsers}, ${passedLeever}, ${requests}, ${leevers})', user)
        .then(() => {
            res.status(200).json({
                status: 'success',
                message: 'user created !'
            });
        })
        .catch((err) => {
            console.error(err);
            return next(err);
        });
}

function updateUser(req, res, next) {
    db.none("UPDATE users SET uid = ${uid}, firstName = ${firstName}, visitedCountries = ${visitedCountries}, blockUsers = ${blockedUsers}, birthday = ${birthday}, gender = ${gender}, description = ${description}, latitude = ${latitude}, longitude = ${longitude}, avatarUrl = ${avatarUrl}, learnedLanguages = ${learnedLanguages}, nativeLanguages = ${nativeLanguages}, desiredLanguages = ${desiredLanguages}, hobbyList = ${hobbyList}, notificationToken = ${notificationToken}, createdAt = ${createdAt}, email = ${email}, distanceFromUser = ${distanceFromUser}, inviteCode = ${inviteCode}, status = ${status}, inviteLeeves = ${inviteLeeves}, statusFilter = ${statusFilter}, notifsMsgs = ${notifsMsgs}, notifsLeeves = ${notifsLeeves}, bannedReason = ${bannedReason}, cardUsersChangedAt = ${cardUsersChangedAt}, cardUsers = ${cardUsers}, mapUsers = ${mapUsers}, passedLeever = ${passedLeever}, requests = ${requests}, leevers = ${leevers} WHERE users.uid LIKE '" + req.body.uid + "'", req.body).then(() => {
        res.status(200).json({
            status: 'success',
            message: 'user updated !'
        });
    }).catch((err) => {
        console.error(err);
        return next(err);
    });
}

function removeUser(req, res, next) {
    const uids = req.url.split('/');
    const uid = uids[uids.length - 1];

    console.log(uid);
    db.none("DELETE FROM users WHERE users.uid LIKE '" + uid + "'").then(() => {
        res.status(200).json({
            status: 'success',
            message: 'user deleted !'
        });
    }).catch((err) => {
        console.error(err);
        return next(err);
    });
}

function getCardUsers(req, res, next) {
    const uids = req.url.split('/');
    const uid = uids[uids.length - 1];

    console.log(uid);
    db.any("SELECT users.cardUsers, users.latitude, users.longitude FROM users WHERE users.uid LIKE '" + uid + "'").then((data) => {
        let query = "SELECT * FROM users WHERE users.uid ~* '";
        let geoPoint = {
            latitude: parseFloat(data[0].latitude),
            longitude: parseFloat(data[0].longitude),
        };


        for (let index = 0; index < data[0].cardusers.length; index++) {
	    query += data[0].cardusers[index];
	    query += (index + 1 == data[0].cardusers.length) ? '' : '|';
	}
	query += "' ORDER BY earth_distance(ll_to_earth(" + geoPoint.latitude + ", " + geoPoint.longitude + "), ll_to_earth(users.latitude, users.longitude)) ASC;";
	db.any(query).then((users) => {
	    res.status(200).json({
		status: 'success',
		message: 'send card users !',
		data: users
	    });
	}).catch((err) => {
	    console.error(err);
	    return next(err);
	});
    }).catch((err) => {
        console.error(err);
        return next(err);
    });
}

function getMapUsers(req, res, next) {
    const uids = req.url.split('/');
    const uid = uids[uids.length - 1];

    console.log(uid);
    db.any("SELECT users.mapUsers FROM users WHERE users.uid LIKE '" + uid + "'").then((data) => {
        let query = "SELECT * FROM users WHERE users.uid ~* '";

        for (let index = 0; index < data[0].mapusers.length; index++) {
            query += data[0].mapusers[index];
            query += (index + 1 == data[0].mapusers.length) ? '' : '|';
        }
        query += "'";
        db.any(query).then((users) => {
            res.status(200).json({
                status: 'success',
                message: 'send map users !',
                data: users
            });
        }).catch((err) => {
            console.error(err);
            return next(err);
        });
    }).catch((err) => {
        console.error(err);
        return next(err);
    });
}

module.exports = {
    getAllUsers: getAllUsers,
    getUser: getUser,
    getCardUsers: getCardUsers,
    getMapUsers: getMapUsers,
    createUser: createUser,
    updateUser: updateUser,
    removeUser: removeUser
};
