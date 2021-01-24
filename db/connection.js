const mongoose = require('mongoose');

class Db {
    constructor() {

    }

    async connect(dbURL) {
        try {
            await mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });
            return "DB Connected";
        } catch (error) {
            console.error(error)
            throw "DB connection error";
        }

    }
}
let dbObj = new Db();
module.exports = dbObj;