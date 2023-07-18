const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');

router.post("/register", async (req, res) => {
    try {
        const {email_address, password} = req.body;   
        const salt =  Math.floor(Math.random() * 20) + 1;
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = new User({
        email_address,
        salt,
        password:hashedPassword
        });
        user.save();

        res
        .status(201)
        .json({ message: "User registered successfully", user_salt: user.salt, password:user.password});
    } catch (e) {
        console.log(e.message);
    }
});

router.post("/login", async (req, res) => {
  try {
    const {email_address, password} = req.body;
 
    User.findOne({email_address}).then(async (user) => {
      if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
      }
 
      const token = jwt.sign(
        { email_address: user.email_address },
        'abc',
        {
            expiresIn: "1h",
        }
      );

    res.json({ message: "Logged in successfully", token });
    })
  } catch (e) {
    console.log(e.message);
  }
});





module.exports = router;
