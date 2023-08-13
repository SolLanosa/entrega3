import userModel from "./models/user.model.js"

export default class UserDAO {
    async findByEmail(email) {
        return userModel.findOne({email})
    }

    async findByFirstName(firstName) {
        return userModel.findeOne({firstName})
    }

    async createUser(user) {
        return userModel.create(user)
    }

    async updatePassword(id, password) {
        return userModel.updateOne({_id:id},{$set:{password}});
    }
}