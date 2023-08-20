import mongoose from "mongoose";
import { Schema } from "mongoose";

const responseSchema = new Schema({
    formId : {
        type: String,
        required: true
    },
    answers : [{
        question: String,
        answer: String
    }]
})

export const Response = new mongoose.model("Response" , responseSchema);