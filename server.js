// Set Up
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var app = express();

// Set Up
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', 'views');
app.set('view engine', 'ejs');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

// DB Connection
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || "postgres://test@localhost:5432/postgres";
const pool = new Pool({connectionString: connectionString});

//Root request
app.get("/", function(req, res){
  console.log("received a request for /");
  res.render("index.ejs");
});

// DB Update Request
app.post('/submit', updateManifest);

// DB Update Request
function updateManifest(req, res) {
  // Log From Contents
  console.log(req.body);
  var DBname = req.body.name;
  var DBstartloc = req.body.startloc;
  var DBendloc = req.body.endloc;
  // Create DB INSERT statement
  const sql = "INSERT INTO manifest (name, startloc, endloc) VALUES ('"+DBname+"', '"+DBstartloc+"', '"+DBendloc+"')";
  // INSERT INTO DB and log any errors
  pool.query(sql, function(err, result) {
    if (err) {
      console.log("ERROR in INSERT: ")
      console.log(err);
    }
  });
  // display the homepage
  res.redirect('/');
}




// /Manifest Request
app.get('/manifest', getManifest);

// Manifest Request
function getManifest(req, res) {
  console.log("testing")
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