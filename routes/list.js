const express = require("express");
const List = require("../models/List");
const verify = require("../verify");
const router = express();

//CREATE//

router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newList = new List(req.body);
    try {
      const saveList = await newList.save();
      res.status(201).json(saveList);
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
      const updateList = await List.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updateList);
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
      await List.findByIdAndDelete(req.params.id);
      res.status(200).json("List has been deleted...");
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
  const typeQuerry = req.query.type;
  const genreQuerry = req.query.genre;
  let list = [];
  try {
    if (typeQuerry) {
      if (genreQuerry) {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuerry, genre: genreQuerry } },
        ]);
      } else {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuerry } },
        ]);
      }
    } else {
      list = await List.aggregate([
        {
          $sample: { size: 10 },
        },
      ]);
    }

    res.status(200).json(list);
  } catch (error) {
    res.status(500).json(error);
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
