var mongoose = require("mongoose");
var express = require("express");
var exhbrs = require("express-handlebars");
var bodyparser = require("body-parser");
var cheerio = require("cheerio");
var request = require("request");
var axios = require("axios");

console.log("\n***********************************\n" +
            "Testing\n" +
            "\n***********************************\n");

var db = require("./models");

var app = express();

var databaseUrl = "scraperhwdb";
var collections = ["scrapedData"];

var PORT = process.env.PORT || 3000;
// Requiring the `Example` model for accessing the `examples` collection
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/safe-plateau-85226";

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/schemaexample");
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);




request("https://www.dailywire.com", function(error, response, html) {
var $ = cheerio.load(html);

// An empty array to save the data that we'll scrape
var results = [];

app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("http://www.dailywire.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

// With cheerio, find each p-tag with the "title" class
// (i: iterator. element: the current element)
$("h2.f-4").each(function(i, element) {

  // Save the text of the element in a "title" variable
  var title = $(element).text();
  // In the currently selected element, look at its child elements (i.e., its a-tags),
  // then save the values for any "href" attributes that the child elements may have
  var link = $(element).children().attr("href");



  // Save these results in an object that we'll push into the results array we defined earlier
  results.push({
    title: title,
    link: link
  });
});

console.log(results);
});
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
})
            