const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const NewsSchema = new Schema({
  url: String,
  text: String,
})

const News = mongoose.model('News', NewsSchema)

module.exports = {
    News,
    NewsSchema
}