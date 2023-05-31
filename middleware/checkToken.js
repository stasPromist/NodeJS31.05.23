
// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
// const token  = req.header('x-auth-token');
// if (!token) 
//     return res.status(401).send("Access denied. No token provided");
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_PASSWORD);
//         if(!decoded || !("id" in decoded) || !("biz" in decoded)) {
//             return res.status(401).send('Token invalid or expired');
//         }
//         req.uid = decoded.id;
//         req.biz = decoded.biz;

//         next();
//     } catch (ex) {
//        res.status(400).send('Invalid token')
//     }
// }


const jwt = require("jsonwebtoken");
const {User} = require('../models/user');
module.exports = async(req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send("Access...");
    try {
        const decoded = jwt.verify(token, process.env.JWT_PASSWORD);
        if (!decoded || !("id" in decoded)) {
            
            return res.status(401).send("Invalid token or expired")
        };
        req.user_id = decoded.id;
        let user = await User.findById(req.user_id);
        req.user = user;
       
        next();
    } catch (ex) {
        res.status(400).send("Invalid token");
    }
}