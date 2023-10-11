import userModel from "./models/user.model.js"

export default class UserDAO {
    async findByEmail(email) {
        return userModel.findOne({email})
    }

    async findById(id){
        return userModel.findById(id)
    }

    async findByFirstName(firstName) {
        return userModel.findeOne({firstName})
    }

    async createUser(user) {
        return userModel.create(user)
    }

    async updatePassword(id, password) {
        return userModel.updateOne({_id:id},{$set:{password, recoverPasswordToken: null, recoverPasswordExpirationDate: null}});
    }

    async setRecoverToken(email, token, expirationDate) {
        return userModel.updateOne({email}, {$set: {recoverPasswordToken: token, recoverPasswordExpirationDate: expirationDate}})
    }

    async findByRecoverPasswordToken(recoverPasswordToken) {
        return userModel.findOne({recoverPasswordToken})
    }

    async changeRole(uid, role) {
        return userModel.updateOne({_id: uid}, {role})
    }

    async getUsers(limit = 10, page = 1) {
        let users = await userModel.paginate({}, {limit: limit, page: page})
        return users
    }

    async getInactiveUsers(time) {
        return userModel.find({deleted: false, last_connection: {$lte:new Date(Date.now() - time)} })
    }

    async deleteInactiveUsers(filteredUsers) {
        return userModel.updateMany({ _id: {$in: filteredUsers.map(user => user.id)}}, {$set: {deleted: true}})
    }

    async deleteUser(uid) {
        return userModel.updateOne({_id:uid}, {$set: {deleted: true}});
    }
}