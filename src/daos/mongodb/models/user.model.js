import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
const collection = 'users'

const UserSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    role: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    recoverPasswordToken: {
        type: String,
    },
    recoverPasswordExpirationDate: Date,
    documents: [
        {
        name: String,
        reference: String
        }
    ],
    last_connection: Date,
    deleted: {
        type: Boolean,
        default: false
    }
})

UserSchema.plugin(mongoosePaginate)
const userModel = mongoose.model(collection, UserSchema)
export default userModel