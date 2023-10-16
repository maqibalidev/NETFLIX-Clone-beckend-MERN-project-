const express = require("express");
const User = require("../models/User");
const Cryptojs = require("crypto-js");
const jwt = require("jsonwebtoken");
const router = express();
const verify = require("../verify");

//UPDATE//

router.put("/:id", verify, async (req, res) => {
  if (req.user.id == req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = Cryptojs.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();
    } else {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedUser);
      } catch (error) {
        res.status(500).json(error);
      }
    }
  } else {
    res.status(403).json("You can update only your account!");
  }
});

////DELETE

router.delete("/:id", verify, async (req, res) => {
  if (req.user.id == req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("user has been deleted...");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can delete only your account!");
  }
});

///GET

router.get("find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...info } = user._doc;
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET ALL USERS//

router.get("/", verify, async (req, res) => {
  const querry = req.query.new;
  if (req.user.id == req.params.id || req.user.isAdmin) {
    try {
      const users = querry
        ? await User.find().sort({ _id: -1 }).limit(10)
        : await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You are not allowed to see all users!");
  }
});

///GET USER STATS

router.get("/stats", async (req, res) => {
  const today = new Date();
  const lastYear = today.setFullYear(today.setFullYear() - 1);

  const monthsArray = [
    "Junuary",
    "Feburary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const data = await User.aggregate([
    {
      $project: {
        month: { $month: "$createdAt" },
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: 1 },
      },
    },
  ]);
  res.status(200).json(data);
  try {
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
