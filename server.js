var mongoose = require("mongoose");
var express = require("express");
var exhbrs = require("express-handlebars");
var bodyparser = require("body-parser");
var cheerio = require("cheerio");
var request = require("request");

// Requiring the `Example` model for accessing the `examples` collection
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/schemaexample");
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


