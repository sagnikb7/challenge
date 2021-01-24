// const mongoose = require('mongoose')

class Base {

    constructor(model) {
        // this.collectionName = collectionName;
        // this.dbModel = mongoose.model(collectionName)
        this.dbModel = model;
    }

    async save(newObject) {
        try {
            let obj = new this.dbModel(newObject)
            let status = await obj.save();
            return status;
        } catch (error) {
            console.error("Object not saved");
            throw error
        }

    }

    async findOne(filter) {
        try {
            let data = await this.dbModel.findOne(filter)
            return data;
        } catch (error) {
            console.error("Coundn't findOne");
            throw error;
        }
    }

    async findOneAndUpdate(filter, updates) {
        try {
            let status = await this.dbModel.findOneAndUpdate(filter, updates, { runValidators: true })
            return status;
        } catch (error) {
            console.error("Coundn't findone and update");
            throw error;
        }
    }

    async updateOne(filter, updates) {
        try {
            let status = await this.dbModel.updateOne(filter, updates)
            return status;
        } catch (error) {
            console.error("Coundn't update one");
            throw error;
        }
    }
}

module.exports = Base;