// Set Up
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var app = express();
var params = [];

// Set Up
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', 'views');
app.set('view engine', 'ejs');

// DB Connection
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || "postgres://test@localhost:5432/postgres";
const pool = new Pool({connectionString: connectionString});

//Root request
app.get("/", function(req, res){
  console.log("received a request for /");
  res.render("index.ejs");
});

// /Manifest Request
app.get('/manifest', getManifest);

function getManifest(req, res) {
  getDB(function(error, result) {
    res.json(result);
  });
}

function getDB(callback) {
  console.log("getting manifest");

  const sql = "SELECT * FROM manifest";

  pool.query(sql, function(err, result) {
    if (err) {
      console.log("Error in query: ")
      console.log(err);
      callback(err, null);
    }

    console.log("found result: " + JSON.stringify(result.rows));
    callback(null, result.rows);
  });
}
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));