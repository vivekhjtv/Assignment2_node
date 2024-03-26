// load mongoose since we need it to define a model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
BookSchema = new Schema({
  title: String,
  author: String,
  price: Number,
  "price (including used books)": Number,
  pages: Number,
  avg_reviews: Number,
  n_reviews: Number,
  star: Number,
  dimensions: Number,
  weight: Number,
  language: String,
  publisher: String,
  isbn: Number,
  complete_link: String,
});
module.exports = mongoose.model('Book', BookSchema);
