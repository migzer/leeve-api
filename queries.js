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

function getUser() {
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

function updateUser() {

}

function removeUser() {

}

module.exports = {
    getAllUsers: getAllUsers,
    getUser: getUser,
    createUser: createUser,
    updateUser: updateUser,
    removeUser: removeUser
};