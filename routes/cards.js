const express = require('express');
const _ = require('lodash');
const { Card, validateCard, generateBizNumber } = require('../models/card');
const auth = require('../middleware/checkToken');
const router = express.Router();

//Delete card by ID(card)
//localhost:3000/cards/644593a92c06ffab912bb837
router.delete('/:id', auth, async (req, res) => {
  if(req.user.biz === true  || req.user.admin === true) {
  const card = await Card.findOneAndRemove({ _id: req.params.id, user_id: req.user._id });
  if (!card) return res.status(404).send('The card with the given ID was not found.');
  res.send(card);
} else {
  res.status(400).send("Must be a Biz ");
}
 
});

//Change the content of the card by using the ID(card)
//localhost:3000/cards/644593bc2c06ffab912bb83b
router.put('/:id', auth, async (req, res) => {
  const filter = {
    _id: req.params.id,
    user_id: req.user._id
 
  }
  if(req.user.biz === true) {
  const { error } = validateCard(req.body);
  if (error) return console.log(res.status(400).send(error.details[0].message));
  
   let card = await Card.findOneAndUpdate( filter, req.body);

  if (!card) return res.status(404).send('The card with the given ID was not found.');
  card = await Card.findOne(filter);

  res.send(card);
} else {
  res.status(400).send("Must be a Biz");
}
});

//To get all cards without token (7)
router.get('/',auth,  async (req, res) => {
    // const card = await Card.find({user_id: req.user_id});
  const card = await Card.find({});
  if (!card) return res.status(404).send('The card with the given ID was not found.');
  res.send(card);

});




//To get cards by ID(card) with token
//localhost:3000/cards/644593342c06ffab912bb82c
router.get('/:id', auth, async (req, res) => {
  if(req.user.biz === true) {
  const card = await Card.find({_id: req.params.id,  user_id: req.user_id   });
  if (!card) return res.status(404).send('The card with the given ID was not found.');
  res.send(card);
} else {
  res.status(500).send();
}
});

//To create new card with Token, if user is Biz
router.post('/',auth, async (req, res) => {
  if(req.user.biz === true) {
  const { error } = validateCard(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  let card = new Card(
    {
      bizName: req.body.bizName,
      bizDescription: req.body.bizDescription,
      bizAddress: req.body.bizAddress,
      bizPhone: req.body.bizPhone,
      bizImage: req.body.bizImage ? req.body.bizImage : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
      bizNumber: await generateBizNumber(Card),
      user_id: req.user_id
    }
  );

  post = await card.save();
  res.send(post);

} else {
  res.status(500).send();
}

});

module.exports = router;