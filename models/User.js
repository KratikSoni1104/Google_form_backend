import mongoose from "mongoose";
import {Form} from "../models/Form.js"

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        //unique:true
    },
    email:{
        type:String,
        required:true,
        //unique:true
    },
    password:{
        type:String,
        required:true,
    },
    forms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Form" }],
})

export const User = new mongoose.model("User" , userSchema)