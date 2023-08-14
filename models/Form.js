import mongoose, { Schema } from "mongoose";

const optionSchema = new mongoose.Schema({
    optionText: String,
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
});

export const Form = new mongoose.model("Form" , formSchema)