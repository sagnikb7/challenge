const jwt = require('jsonwebtoken');

const ParticipantDAOClass = require('../db/participantDAO');
const ParticipantDAO = new ParticipantDAOClass();

class Auth {
    constructor() { }

    async checkParticipation(req, res, next) {
        //check if user active in one class 
        const token = req.cookies.jwt || "";
        try {
            let { shortId } = req.params;

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            let { username, role } = decoded;
            let data = await ParticipantDAO.findOne({ username });
            if (data) {
                if (data.shortId != shortId) {
                    return res.status(401).send({ "message": "Attending another class" })
                } else {
                    // return res.status(401).send({ "message": "Already inside the class" })
                    next();
                }
            } else {
                next();
            }
        } catch (error) {
            console.error(error)
            return res.status(500).send({ "message": "unknow error", "error": error.message });
        }

    }

    verifyRoleTeacher(req, res, next) {
        const token = req.cookies.jwt || "";

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded && decoded.role == 'teacher') {
                res.locals.username = decoded.username;
                res.locals.role = decoded.role;
                next();
            } else {
                return res.status(401).send({ "message": "unauthorized (u2)" });
            }
        } else {
            return res.status(401).send({ "message": "unauthorized (u1)" })
        }

    }

    verifyLoggedIn(req, res, next) {

        const token = req.cookies.jwt || "";

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded) {
                res.locals.username = decoded.username;
                res.locals.role = decoded.role;
                next();
            } else {
                return res.status(401).send({ "message": "unauthorized (u2)" });
            }
        } else {
            return res.status(401).send({ "message": "unauthorized (u1)" });
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