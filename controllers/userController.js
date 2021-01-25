const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserDAOClass = require('../db/userDAO');
const UserDAO = new UserDAOClass();

class UserController {

    constructor() {
    }

    async create(req, res) {
        try {

            let { username, password, role } = req.body;

            let hash = bcrypt.hashSync(password, 7);
            let userObj = { username, password: hash, role }

            let status = await UserDAO.save(userObj);
            if (status) {
                res.status(201).send({ "message": "user registered" });
            }
            else {
                res.status(400).send({ "message": "user not registered (status false)", "error": status })
            }

        } catch (error) {
            res.status(400).send({ "message": "user not registered", "error": error.message })
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            let user = await UserDAO.findOne({ "username": username });
            if (user) {
                let hash = user.password;
                let passwordMatched = bcrypt.compareSync(password, hash);
                if (passwordMatched) {

                    let token = jwt.sign({ "username": user.username, "role": user.role }, process.env.JWT_SECRET, { expiresIn: '1h' })
                    res.cookie('jwt', token, { httpOnly: true, secure: false, maxAge: 3600000 })
                    res.status(200).send({ "message": "Login Success" });

                } else {
                    res.status(401).send({ "message": "Wrong creds" })
                }
            } else {
                res.status(401).send({ "message": "Wrong creds" })
            }
        } catch (error) {
            // console.error(error)
            res.status(400).send({ "message": "Login error", "error": error.message })
        }

    }
}

module.exports = UserController;