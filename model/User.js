import { Schema, model } from "mongoose";

const schemaUser = new Schema({
    firstName: String,
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String
})

export default model('User', schemaUser);