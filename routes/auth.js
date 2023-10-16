const express = require("express");
const User = require("../models/User");
const Cryptojs = require("crypto-js");
const jwt = require("jsonwebtoken");
const router = express();

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: Cryptojs.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
  });

  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

///LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json("Wron email or password");
    } else {
      const bytes = Cryptojs.AES.decrypt(user.password, process.env.SECRET_KEY);

      const originalPass = bytes.toString(Cryptojs.enc.Utf8);

      if (!originalPass === req.body.password) {
        res.status(401).json("Wron email or password");
      } else {
        const accessToken = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.SECRET_KEY,
          { expiresIn: "7d" }
        );

        const { password, ...info } = user._doc;
        res.status(200).json({ ...info, accessToken });
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
