Mongoose = require '../lib/mongo'
pureautoinc  = require('mongoose-pureautoinc');

News = new Mongoose.Schema(
  id: Number,
  title: { type : String, "default" : '', trim : true },
  content: { type : String, "default" : '', trim : true },
  imageUrl: { type : String, "default" : '', trim : true },
  targetUrl: { type : String, "default" : '', trim : true },
  createdAt: { type : Date, "default" : Date.now },
  lastModified: { type : Date, "default" : Date.now },
  draft: Boolean,
  publicationDate: Date
)

newsModel = Mongoose.client.model 'News', News

News.plugin(pureautoinc.plugin, {
    model: 'News',
    field: 'id'
});

module.exports = newsModel

