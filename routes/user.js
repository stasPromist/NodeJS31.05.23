// const express = require('express');
// const router = express.Router();
// const userSchema = require('../validation/user');
// const UserModel = require('../models/user');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
// const _ = require('lodash');
// const returnUserKeys = ['name', 'email', 'createdAt', '_id'];
// router.post("/create", createRequest);
// const checkToken = require('../middleware/checkToken');

// async function createRequest(req, res) {
//     const { error, value } = userSchema.newUser.validate(req.body);
//     const user = value;
//     if (error) {
//         res.status(400).send(error)
//     }
//     else {
//         try {
//             const result = await UserModel.find({ email: user.email });
//             if (result.length > 0) {
//                 res.status(400).send("Exist")
//             }
//             else {
//                 try {
//                     const savedUser = await saveUser(user);
//                     res.status(201).send(savedUser)
//                 }
//                 catch (err) {
//                     res.status(400).send(err)
//                 }

//             }
//         } catch (err) {
//             res.status(400).send(error)
//         }
//     }

// }
// async function saveUser(user) {
//     return new Promise(async (resolve, reject) => {
//         try {
//             user.password = await bcrypt.hash(user.password, saltRounds);
//             const savedUser = await new UserModel(user).save();
//             resolve(_.pick(savedUser, returnUserKeys));
//         } catch (err) {
//             reject(err);

//         }
//     })


// };


// router.post("/auth", login);

// async function login(req, res) {
//     const { error, value } = userSchema.auth.validate(req.body);
//     const user = value;
//     if (error) {
//         res.status(400).send(error)
//     }
//     else {
//         try {
//             const userModel = await UserModel.findOne({ email: user.email });
//             if(!userModel) {
//                 res.status(400).send("Wrong");
//                 return;
//             }
//             const isAuth = await userModel.checkPassword(user.password);
//             if(!isAuth) {
//                 res.status(400).send("Wrong");

//             }
//             res.status(200).send(userModel.getToken());

//         } catch {
//             res.status(400).send(error)
//         }

//     }
// }


// router.get("/me",checkToken, me);

// async function me (req,res) {
//     const userId = req.uid;
//     try {
//         const user = await UserModel.findOne({_id:userId})
//         res.status(200).send(_.pick(user, returnUserKeys));
//     } catch (err) {
//         res.status(400).send('User is not exist')

//     }
// }




// router.get("/create", (req, res) => {
//     res.send("HI");

// });

// module.exports = router;







 

const express = require('express');
const router = express.Router();
const userSchema = require('../validation/user');
const { User } = require('../models/user');
const bcrypt = require("bcrypt");
const saltRounds = 10;
const _ = require("lodash");
// const chalk = require("chalk");

// var jwt = require('jsonwebtoken');
const returnUserKeys = ['email','_id','name','biz','createdAt'];
const checkToken = require("../middleware/checkToken");
router.post("/create", createRequest);

async function createRequest(req, res) {
    const { error, value } = userSchema.newUser.validate(req.body);
    const user = value;
    if (error) {
        console.log(res.status(400).send(error));
      
    }
    else {
        try {
            const result = await User.find({email: value.email});
            if (result.length > 0) {
                res.status(400).send("exist");
            }
            else {
                try {
                    const savedUser = await saveUser(user);
                    res.status(201).send(savedUser);
                } catch (err) {
                   res.status(400).send(err);

                }
            }
        }
        catch (err) {
            res.status(400).send(err);
        }
    }
}

function saveUser(user){
    return new Promise(async (resolve, reject) => {
        try {
            user.password = await bcrypt.hash(user.password, saltRounds);
            const savedUser = await new User(user).save();
            // resolve(savedUser);
            resolve(_.pick(savedUser,returnUserKeys));
       } catch (err) {
           console.log(reject (err));
       }
    })
    }

    router.post("/auth" ,login);

    async function login(req,res){
        const { error, value } = userSchema.auth.validate(req.body);
        const user = value;
        if (error) {
            res.status(400).send(error)
        }
        else{
            try{
                const userModel = await User.findOne({email:user.email});
                if (!userModel) { 
                    res.status(400).send("Username or password wrong");
                    return;
                }
                const isAuth = await userModel.checkPassword(user.password);
                if(!isAuth) {
                    res.status(400).send("Username or password wrong");
                    return;
                }
                res.status(200).send(userModel.getToken());
            } catch (err) {
                res.status(400).send(err)
            }
        }
    }

    router.post("/me", checkToken, me);

    router.get("/me", checkToken, me);
    async function me(req, res) {
        const userId = req.user_id;
        console.log(userId);
        try {
            const user = await User.findOne({_id:userId});
            res.status(200).send(_.pick(user,returnUserKeys));

        } catch (err) {
            res.status(400).send("User not exist, try to login again");
   
        }
    }
    


   

module.exports = router;
