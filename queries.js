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
    const uids = req.url.split('/');
    const uid = uids[uids.length - 1];

    db.any("SELECT * FROM users WHERE users.uid LIKE '" + uid + "'")
        .then((user) => {
            res.status(200).json({
                status: 'success',
                message: 'get user !',
                data: user[0]
            });
        })
        .catch((err) => {
            console.error(err);
            return next(err);
        });
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
    db.any("SELECT users.cardUsers FROM users WHERE users.uid LIKE '" + uid + "'").then((data) => {
        let query = "SELECT * FROM users WHERE users.uid ~* '";

        if (!data[0].cardusers.length) {
            console.warn("no card users");
            res.status(200).json({
                status: 'success',
                message: 'send card users but empty..!',
                data: []
            });
            return;
        }
        for (let index = 0; index < data[0].cardusers.length; index++) {
            query += data[0].cardusers[index];
            query += (index + 1 == data[0].cardusers.length) ? '' : '|';
        }
        query += "'";
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

        if (!data[0].mapusers.length) {
            console.warn("no map users");
            res.status(200).json({
                status: 'success',
                message: 'send map users but empty..!',
                data: []
            });
            return;
        }
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

function getAllConversations(req, res, next) {
    const userUid = req.body.uid;

    db.any("SELECT chatconversations.uid AS \"conversationUid\", chatconversations.seenby, chatconversations.members, chatconversations.timestamp, chatconversations.lastmessage, users.uid AS \"userUid\", users.firstname, users.birthday, users.visitedcountries, users.blockusers, users.gender, users.description, users.latitude, users.longitude, users.avatarurl, users.learnedlanguages, users.nativelanguages, users.desiredlanguages, users.hobbylist, users.notificationtoken, users.createdat, users.email, users.distancefromuser, users.invitecode, users.status, users.inviteleeves, users.statusfilter, users.notifsmsgs, users.notifsleeves, users.bannedreason, users.carduserschangedat, users.cardusers, users.passedleever, users.requests, users.leevers FROM chatconversations LEFT JOIN users ON users.uid = CASE WHEN chatconversations.members[1] = '" + userUid + "' THEN chatconversations.members[2] ELSE chatconversations.members[1] END WHERE members @> ARRAY['" + userUid + "']::varchar[] ORDER BY chatconversations.timestamp DESC;")
        .then((conversations) => {
            res.status(200).json({
                status: 'success',
                message: 'send conversations !',
                data: conversations
            });
        })
        .catch((err) => {
            console.error(err);
            return next(err);
        });
}

function getConversation(req, res, next) {
    const uids = req.url.split('/');
    const uid = uids[uids.length - 1];

    db.any("SELECT * FROM chatconversations WHERE chatconversations.uid LIKE '" + uid + "'")
        .then((conversation) => {
            res.status(200).json({
                status: 'success',
                message: 'get conversation !',
                data: conversation[0]
            });
        })
        .catch((err) => {
            console.error(err);
            return next(err);
        });
}

function createConversation(req, res, next) {
    let conversation = req.body;

    if (conversation.uid && conversation.lastMessage) {
        db.none('INSERT INTO chatconversations(uid, seenBy, members, timestamp, lastMessage) ' +
            'values(${uid}, ${seenBy}, ${members}, ${timestamp}, ${lastMessage})', conversation)
            .then(() => {
                res.status(200).json({
                    status: 'success',
                    message: 'conversation created !'
                });
            })
            .catch((err) => {
                console.error(err);
                return next(err);
            });
    } else {
        const err = "no uid yet !";
        console.error(err);
        return next(err);
    }
}

function updateConversation(req, res, next) {
    db.none("INSERT INTO chatconversations(uid, seenBy, members, timestamp, lastMessage) " +
        "values(${uid}, ${seenBy}, ${members}, ${timestamp}, ${lastMessage}) " +
        "ON CONFLICT (uid)" +
        "DO UPDATE SET uid = ${uid}, seenBy = ${seenBy}, members = ${members}, timestamp = ${timestamp}, lastMessage = ${lastMessage} WHERE chatconversations.uid LIKE '" + req.body.uid + "'", req.body).then(() => {
        res.status(200).json({
            status: 'success',
            message: 'conversation updated !'
        });
    }).catch((err) => {
        console.error(err);
        return next(err);
    });
}

function removeConversation(req, res, next) {
    const uids = req.url.split('/');
    const uid = uids[uids.length - 1];

    console.log(uid);
    db.none("DELETE FROM chatconversations WHERE chatconversations.uid LIKE '" + uid + "'").then(() => {
        res.status(200).json({
            status: 'success',
            message: 'conversation deleted !'
        });
    }).catch((err) => {
        console.error(err);
        return next(err);
    });
}

function getMessagesByConversation(req, res, next) {
    let conversationUid = req.body.conversationUid;

    db.any("SELECT * FROM chatmessages WHERE chatmessages.conversationuid LIKE '" + conversationUid + "' ORDER BY chatmessages.timestamp ASC;")
        .then((messages) => {
            res.status(200).json({
                status: 'success',
                message: 'related conv messages sended !',
                data: messages
            });
        })
        .catch((err) => {
            console.error(err);
            return next(err);
        })
}

function getMessage(req, res, next) {
    const uids = req.url.split('/');
    const uid = uids[uids.length - 1];

    db.any("SELECT * FROM chatmessages WHERE chatmessages.uid LIKE '" + uid + "'")
        .then((msg) => {
	    if (msg) {
                res.status(200).json({
                    status: 'success',
                    message: 'message sended !',
		    data: msg[0]
                });
	    } else {
		res.status(202).json({
		    status: 'success',
		    message: 'message does not exist'
		});
	    }
        })
        .catch((err) => {
            console.error(err);
            return next(err);
        });
}

function createMessage(req, res, next) {
    let message = req.body;

    if (message.uid) {
        db.none("INSERT INTO chatmessages(uid, conversationuid, sender, timestamp, reactions, text) " +
            "values(${uid}, ${conversationUid}, ${from}, ${timestamp}, ${reactions}, ${text});", message)
            .then(() => {
                res.status(200).json({
                    status: 'success',
                    message: 'message created !'
                });
            })
            .catch((err) => {
                console.error(err);
                return next(err);
            });
    } else {
        const err = "no uid yet !";
        console.error(err);
        return next(err);
    }

}

function updateMessage(req, res, next) {
    let message = req.body;

    db.none("INSERT INTO chatmessages(uid, conversationuid, sender, timestamp, reactions, text) " +
        "values(${uid}, ${conversationUid}, ${from}, ${timestamp}, ${reactions}, ${text}) " +
        "ON CONFLICT (uid)" +
        "DO UPDATE SET uid = ${uid}, conversationuid = ${conversationUid}, sender = ${from}, timestamp = ${timestamp}, reactions = ${reactions}, text = ${text} WHERE chatmessages.uid LIKE '" + message.uid + "'", message)
        .then(() => {
            res.status(200).json({
                status: 'success',
                message: 'message created !'
            });
        })
        .catch((err) => {
            console.error(err);
            return next(err);
        });
}

function removeMessage(req, res, next) {
    const uids = req.url.split('/');
    const uid = uids[uids.length - 1];

    db.none("DELETE FROM chatmessages WHERE chatmessages.uid LIKE '" + uid + "';")
        .then(() => {
            res.status(200).json({
                status: 'success',
                message: 'message deleted !'
            });
        })
        .catch((err) => {
            console.error(err);
            return next(err);
        })
}

module.exports = {
    getAllUsers: getAllUsers,
    getUser: getUser,
    getCardUsers: getCardUsers,
    getMapUsers: getMapUsers,
    createUser: createUser,
    updateUser: updateUser,
    removeUser: removeUser,
    getAllConversations: getAllConversations,
    getConversation: getConversation,
    createConversation: createConversation,
    updateConversation: updateConversation,
    removeConversation: removeConversation,
    getMessagesByConversation: getMessagesByConversation,
    getMessage: getMessage,
    createMessage: createMessage,
    updateMessage: updateMessage,
    removeMessage: removeMessage
};
