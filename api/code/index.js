if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
var express = require('express');
var cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');

var app = express();
port = process.env.PORT || 8088;

app.use(cors());
app.use(express.json());

mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@mongodb-api-mds:27017/${process.env.MONGO_DB}`)
	.then((result) => console.log("Mongodb connexion success !"))
	.catch((err) => console.log(err))

app.use('/api', routes)

app.listen(port);