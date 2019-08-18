const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Pokemon = require("../models/pokemon");

router.get("/pokemons", async (req, res) => {
  //Pokemon.find({}) retrives all the records
  try {
    let getPokemons = await Pokemon.find({});
    await res.send(getPokemons);
  } catch (err) {
    res.status(404).send({ error: err.message });
  }
});

router.get("/nearbypokemons", async (req, res) => {
  try {
    //finding nearby Pokemons using geo location
    let nearByPokemons = await Pokemon.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]
          },
          spherical: true,
          maxDistance: 100000,
          distanceField: "dist.calculated"
        }
      }
    ]);

    await res.send(nearByPokemons);
  } catch (err) {
    res.status(404).send({ error: err.message });
  }
});

router.post("/pokemon", async (req, res) => {
  /*Alternative for this below
  let pokemon = new Pokemon(req.body);
  pokemon.save();*/
  try {
    //Checking for duplicate names
    let existingPokemon = await Pokemon.findOne({ name: req.body.name });
    if (existingPokemon) {
      return res.status(422).send("Name already exists");
    }

    //creates an instance of Pokemon and saves it
    let pokemonInstance = await Pokemon.create(req.body);
    await res.send(pokemonInstance);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.put("/pokemon/:id", async (req, res) => {
  try {
    //posting the data to update
    let updatedPokemon = await Pokemon.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true
      }
    );

    //sending the new updated data
    await res.send(updatedPokemon);
  } catch (err) {
    res.status(404).send({ error: err.message });
  }
});

router.delete("/pokemon/:id", async (req, res) => {
  //to access id --> req.params.id
  try {
    let deletedPokemon = await Pokemon.findByIdAndRemove({
      _id: req.params.id
    });
    await res.send(deletedPokemon);
  } catch (err) {
    res.status(404).send({ error: err.message });
  }
});

module.exports = router;
