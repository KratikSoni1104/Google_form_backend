import mongoose, { Schema } from "mongoose";
import { User } from "./User.js";

const optionSchema = new mongoose.Schema({
    optionsText: String,
});
  
const questionSchema = new mongoose.Schema({
question: String,
questionType: String, // Example: "radio", "checkbox", "text"
options: [optionSchema],
open: Boolean,
required: Boolean,
});

const formSchema = new mongoose.Schema({
doc_name: String,
doc_desc: String,
questions: [questionSchema],
createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
status:{type:Boolean},
});

export const Form = new mongoose.model("Form" , formSchema)