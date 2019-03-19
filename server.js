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

// 
function getManifest(req, res) {
  getDB(function(error, result) {
    // Send JSON to client
    res.json(result);
  });
}

// Get Stuff From the DB
function getDB(callback) {
  console.log("getting manifest");
  // Create DB Query
  const sql = "SELECT * FROM manifest";
  // Query DB and Log any errors
  pool.query(sql, function(err, result) {
    if (err) {
      console.log("Error in query: ")
      console.log(err);
      callback(err, null);
    }
    // Log results from DB Query
    console.log("found result: " + JSON.stringify(result.rows));
    callback(null, result.rows);
  });
}
// Listen on indicated PORT and log it
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));