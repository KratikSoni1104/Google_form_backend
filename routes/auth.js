import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import _ from "lodash";
import { createError } from "../utils/error.js";

const router = express.Router();

router.post("/register" , async (req , res , next) => {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    try{
        const existingUser = await User.findOne({
            $or: [{ email: req.body.email }, { username: req.body.username }],
        });

        if (existingUser) {
            return next(createError(409 , "Username or email is already in  use"));
        } else {
            const newUser = new User({
                email : req.body.email,
                username : _.capitalize(req.body.username),
                password : hash,
            })
    
            const savedUser = await newUser.save();
            res.status(200).json(savedUser)
        }
    } catch(err) {
        console.log(err);
        next(err);
    }
});

router.post("/login" , async (req , res , next) => {
    const username = _.capitalize(req.body.username)
    try{
        const user = await User.findOne({username : username});
        if(!user) return next(createError(404 , "User not found"));

        const isCorrectPassword = bcrypt.compareSync(req.body.password, user.password)
        if(!isCorrectPassword) return next(createError(401 , "Username or password is incorrect"));

        // const token = jwt.sign({id : user._id , isAdmin:user.isAdmin} , process.env.JWT);

        const {password , ...otherDetails} = user._doc;
        console.log(user._doc);
        res.status(200).json({...otherDetails});
    } catch(err) {
        next(err)
    }
});

router.get("/getAll" , async (req , res , next) => {
    try{
        const users = await User.find();
        res.status(200).json(users);
    } catch(err) {
        next(err);
    }
})

// router.post("/storeGoogleUser", async (req, res, next) => {
//     const { email, username} = req.body;
  
//     try {
//       // Check if the user with the provided email already exists
//       let user = await User.findOne({ email });
  
//       if (!user) {
//         // Create a new user if not found
//         user = new User({
//           email,
//           username,
//         });
  
//         await user.save();
//       } else {
//         // Update the existing user's profile information
//         user.username = username;
//         //user.profileImage = photoURL;
//         await user.save();
//       }
  
//       console.log("hello");
//       res.status(200).json("User stored successfully");
//     } catch (error) {
//       next(error)
//     }
//   });
  


export default router;