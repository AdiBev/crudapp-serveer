const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const keys = require("./config/keys");

//importing dbs
require("./models/pokemon");

mongoose.connect(keys.mongoURI, {
  useCreateIndex: true,
  useNewUrlParser: true
});

const app = express();

//this serves static files ex: imgs/html/css files
app.use(express.static("public"));

app.use(bodyParser.json());

//routes intiate
app.use("/api", require("./routes/api"));

//middleware for error handling
app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);

//db password 2xr828HwZLFM6wZ

//db password2 kjaCLMucwijOysgb
