const mongoose = require("mongoose");
const { Schema } = mongoose;
const GeoSchema = require("./geometry");

const pokemonSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name field is required"],
    unique: true
  },
  rank: { type: Number },
  ability: { type: String },
  geometry: GeoSchema
});

const Pokemon = mongoose.model("pokemons", pokemonSchema);

module.exports = Pokemon;
