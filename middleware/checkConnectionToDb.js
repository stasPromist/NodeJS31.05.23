const mongoose = require("mongoose");


module.exports = (req, res, next) => {
      if(mongoose.connection.readyState !== 1) {
        res.status(500).send('Can not connect to database');
        return;
      }
    next();
    }

