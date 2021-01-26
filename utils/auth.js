const jwt = require('jsonwebtoken');

const ParticipantDAOClass = require('../db/participantDAO');
const ParticipantDAO = new ParticipantDAOClass();

const SECRET = process.env.JWT_SECRET;
class Auth {
    constructor() { }

    async checkParticipation(req, res, next) {
        try {
            let { shortId } = req.params;
            let { username } = res.locals;

            // console.log("checkParticipation", shortId, username)

            let data = await ParticipantDAO.findOne({ username });
            if (data) {
                if (data.shortId != shortId) { //in different class
                    return res.status(401).send({ "message": "Attending another class" })
                } else { //already in same class
                    next();
                }
            } else { //not yet participated
                next();
            }

        } catch (error) {
            console.log(error.message);
            return res.status(500).send({ "message": "error" }); //unknown error
        }
    }

    verifyRoleTeacher(req, res, next) {
        const token = req.cookies.jwt || "";

        if (token) {
            try {
                const decoded = jwt.verify(token, SECRET);
                if (decoded.role == 'teacher') {
                    res.locals.username = decoded.username;
                    res.locals.role = decoded.role;
                    next();
                } else {
                    return res.status(401).send({ "message": "unauthorized (u3)" });//invalid role
                }

            } catch (error) {
                res.clearCookie("jwt");
                console.log(error.message);
                return res.status(401).send({ "message": "unauthorized (u2)" });//invalid token
            }

        } else {
            return res.status(401).send({ "message": "unauthorized (u1)" }) //no token
        }

    }

    verifyLoggedIn(req, res, next) {

        const token = req.cookies.jwt || "";

        if (token) {

            try {
                const decoded = jwt.verify(token, SECRET);
                res.locals.username = decoded.username;
                res.locals.role = decoded.role;
                next();
            } catch (error) {
                res.clearCookie("jwt");
                console.log(error.message);
                return res.status(401).send({ "message": "unauthorized (u2)" }); //invalid token
            }

        } else {
            return res.status(401).send({ "message": "unauthorized (u1)" }); // no token 
        }
    }

    verifyLoggedOut(req, res, next) {
        const token = req.cookies.jwt || "";
        if (!token) {
            next();
        } else { return res.redirect("/users/dashboard"); }
    }


}

let authObj = new Auth()

module.exports = {
    verifyLoggedIn: authObj.verifyLoggedIn,
    verifyLoggedOut: authObj.verifyLoggedOut,
    verifyRoleTeacher: authObj.verifyRoleTeacher,
    checkParticipation: authObj.checkParticipation

}