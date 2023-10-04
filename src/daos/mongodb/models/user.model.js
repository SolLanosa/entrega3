import mongoose from 'mongoose'

const collection = 'users'

const schema = new mongoose.Schema({
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
        unique: true
    },
    recoverPasswordExpirationDate: Date,
    documents: [
        {
        name: String,
        reference: String
        }
    ],
    last_connection: Date
})

const userModel = mongoose.model(collection, schema)
export default userModel