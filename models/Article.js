const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: String,
  link: String,
  content: String,
  summary: String,
  source: String,
  publishDate: Date
});

module.exports = mongoose.model('Article', articleSchema);
