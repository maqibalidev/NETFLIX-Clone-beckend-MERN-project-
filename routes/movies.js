const express = require("express");
const Movies = require("../models/Movie");
const verify = require("../verify");
const router = express();

//CREATE//

router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = new Movies(req.body);
    try {
      const saveMovie = await newMovie.save();
      res.status(201).json(saveMovie);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});

//UPDATE//

router.put("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updateMovie = await Movies.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updateMovie);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You are not allowed");
  }
});

////DELETE

router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Movies.findByIdAndDelete(req.params.id);
      res.status(200).json("Movie has been deleted...");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You are not allowed");
  }
});

///GET

router.get("/find/:id", verify, async (req, res) => {
  try {
    const movie = await Movies.findById(req.params.id);

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json(error);
  }
});

///GET ALL

router.get("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const movie = await Movies.find();

      res.status(200).json(movie.reverse());
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(500).json("You are not allowed");
  }
});
//GET RANDOM//

router.get("/random", verify, async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type == "series") {
      movie = await Movies.aggregate([
        {
          $match: { isSeries: true },
        },
        {
          $sample: { size: 1 },
        },
      ]);
    } else {
      movie = await Movies.aggregate([
        {
          $match: { isSeries: false },
        },
        {
          $sample: { size: 1 },
        },
      ]);
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
