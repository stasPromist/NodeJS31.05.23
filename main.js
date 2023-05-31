
require ('dotenv').config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
const user = require('./routes/user');
 require('./databases/mongoDb');
const cors = require('cors');
const morgan = require('morgan');
app.use(morgan('tiny'));
const checkConnectionToDb = require('./middleware/checkConnectionToDb');
const cards = require('./routes/cards');
const users = require('./routes/users');
app.use(cors());
app.use(checkConnectionToDb);
app.use('/user', user);

app.use('/cards', cards);
app.use('/users', users);


app.listen(PORT, () => {
    console.log(`"Server is up on port" +${PORT}`)
})
