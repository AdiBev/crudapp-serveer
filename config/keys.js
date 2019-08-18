//this file decides which keys to use dev vs prod

if (process.env.NODE_ENV === "production") {
  //we are in prod return prod keys
  //we are importing the prod file and right away we are exporting it
  module.exports = require("./prod");
} else {
  //return dev keys
  //we are importing the dev file and right away we are exporting it
  module.exports = require("./dev");
}
