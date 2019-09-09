const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Pokemon = require("../models/pokemon");

//send records in pages
router.get("/pokemons/page=:pageNo", async (req, res) => {
  //amount of records to show per page
  let perPage = 9;
  //current page no default:1
  let page = req.params.pageNo || 1;

  //find all the records
  try {
    await Pokemon.find({})
      //skiping records here ex: (9 * 1 - 9 = 0) and so on..
      //On second page mongodb will skip first 9
      //limit will show first 9 records
      .skip(perPage * page - perPage)
      //output only perPage items (9 in this case)
      .limit(perPage)
      //error handling and sending the pokemons data after counting
      .exec((err, pokemons) => {
        //count all items in collection
        Pokemon.countDocuments().exec((err, count) => {
          //send error if any
          if (err) return next(err);
          res.send({
            //pokemon database after the pagination
            pokemons: pokemons,
            //current page --> req.params.page
            current: page,
            //all the data/perPage = nos of total pages
            pages: Math.ceil(count / perPage),
            totalRecords: count
          });
        });
      });
  } catch (err) {
    res.status(404).send({ error: err.message });
  }
});

//send a record by it's id
router.get("/pokemon/:id", async (req, res) => {
  let pokemonId = req.params.id;
  try {
    let pokemonById = await Pokemon.findById(pokemonId);
    await res.send(pokemonById);
  } catch (err) {
    res.status(404).send({ error: err.message });
  }
});

//send nearby pokemons
router.get("/nearbypokemons", async (req, res) => {
  try {
    //finding nearby Pokemons using geo location
    let nearByPokemons = await Pokemon.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(req.query.lat), parseFloat(req.query.lng)]
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

//post pokemon data here
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

//update the pokemon data
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

//delete the pokemon data
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
