const jwt = require('jsonwebtoken');

class Auth {
    constructor() { }

    verifyRoleTeacher(req, res, next) {
        const token = req.cookies.jwt || "";
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded && decoded.role == 'teacher') {
                res.locals.username = decoded.username;
                res.locals.role = decoded.role;
                next();
            } else {
                return res.status(401).send({ "message": "unauthorized" })
            }
        } catch (error) { return res.status(401).send({ "message": "unauthorized" }) }
    }

    verifyLoggedIn(req, res, next) {
        const token = req.cookies.jwt || "";
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded) {
                res.locals.username = decoded.username;
                res.locals.role = decoded.role;
                next();
            } else {
                return res.redirect('/')
            }
        } catch (error) { return res.redirect('/') }

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
    verifyRoleTeacher: authObj.verifyRoleTeacher

}