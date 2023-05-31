const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {  validateCards } = require('../models/user');
const {User} = require('../models/user');
const { Card } = require('../models/card');
const auth = require('../middleware/checkToken');
const router = express.Router();
// const chalk = require("chalk");


const getCards = async (cardsArray) => {
  const cards = await Card.find({ "bizNumber": { $in: cardsArray } });
  return cards;
};

//localhost:3000/users/cards?numbers=850258,391938-это номера карточек/токен нужен
router.get('/cards', auth, async (req, res) => {
  if (!req.query.numbers) res.status(400).send('Missing numbers data');
  let data = {};
  data.cards = req.query.numbers.split(",");
  const cards = await getCards(data.cards);
  res.send(cards);
 
});





//localhost:3000/users/cards
//{"cards":[ "850258","391938" ]}-in body
router.patch('/cards', auth, async (req, res) => {
 
    const { error } = validateCards(req.body);
    if (error) res.status(400).send(error.details[0].message);
   
    const cards = await getCards(req.body.cards);
    if (cards.length != req.body.cards.length) res.status(400).send("Card numbers don't match");
   
    let user = await User.findById(req.user._id);
    user.cards = req.body.cards;
    user = await user.save();
    res.send(user);
   
  });



module.exports = router;