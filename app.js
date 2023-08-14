import express from "express"
import fs, { stat } from "fs"
import cors from "cors"
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import excel from "exceljs"
import dotenv from "dotenv"
import mongoose from "mongoose";
import formRoute from "./routes/forms.js"
import authRoute from "./routes/auth.js"
dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB);
        console.log("Connected to DB");
    } catch(err) {
        throw err
    }
}

mongoose.connection.on("disconnected" , () => {
    console.log("mongdb disconnected");
})

//middelwear
app.use(express.json())
app.use(cors());

app.get("/" , (req,res) => {
    res.send("hello")
})

app.use("/api/auth",  authRoute);
app.use("/api/form" , formRoute)

// app.use((req, res, next) => {
//     res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
//     next();
// })

app.use((err,req,res,next) => {
    const errStatus = err.status || 500;
    const errMessage = err.message || "Something went wrong";
    return res.status(errStatus).json({
        Success : false,
        status : errStatus,
        message : errMessage,
        stack : err.stack,
    });
})
                                             

app.listen(PORT , () => {
    connect() ; 
    console.log("Server started")
})