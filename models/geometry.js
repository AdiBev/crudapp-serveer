const mongoose = require("mongoose");
const { Schema } = mongoose;

//Using GeoJSON here
const geoSchema = new Schema({
  type: {
    type: String,
    default: "Point"
  },
  coordinates: {
    type: [Number],
    //type of map 2dsphere
    index: "2dsphere"
  }
});

module.exports = geoSchema;
