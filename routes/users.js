var express = require('express');
const passport = require('passport');

var router = express.Router();
const User = require('../models/User');

const jwt = require('jsonwebtoken');  // make sure you've installed jsonwebtoken
/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({ email_address: "reid"})
    .then(docs =>{
      res.send(docs);
    })
    .catch(err => {
      console.log(err);
    });
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  //console.log(req.headers.authorization)
  if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization.split(' ')[1],
          decoded;
          console.log(authorization)
      try {
          decoded = jwt.verify(authorization, 'abc');
          //console.log(decoded);
      } catch (e) {
          return res.status(401).send('unauthorized');
      }
      var user_email_address = decoded.email_address;
      // Fetch the user by id 
      User.findOne({email_address: user_email_address}).then(function(user){
          // Do something with the user
          // return user data
          res.json(user); // it will send back the user's document found in the database
      }).catch(function(err){
          res.status(500).send('Error occurred while fetching user');
      });
  } else {
      return res.status(500).send('Could not find authorization token');
  }
  // res.send('You have accessed a protected route!');
});

module.exports = router;
