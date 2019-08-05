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
const connectionString = "postgres://oxlkfzqjrqnein:406edf6e02a07b1c87c8cfb6092ef423644e34b6584650ffb98bf14caed676c1@ec2-54-221-201-212.compute-1.amazonaws.com:5432/dadn470p42d526";
const pool = new Pool({connectionString: connectionString});

/*********************Root request********************/
app.get("/", function(req, res){
  console.log("received a request for /");
  res.render("index.ejs");
});

/*********************Page 2 Request********************/
app.get('/page2', function(req, res){
  console.log("received a request for /page2");
  res.render("page2.ejs");
});

/**********************Page 3 Request*******************/
app.get('/page3', function(req, res){
  console.log("received a request for /page3");
  res.render("page3.ejs");
});

/*********************DB Update Request********************/
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

/*********************DB Delete Request********************/
app.post('/delete', deleteItem);

// DB Delete Request
function deleteItem(req, res) {
  var DBdelete = req.body.numDelete;
  // Create DB Delete Statement
  const sql = "DELETE FROM manifest WHERE id='"+DBdelete+"'"
  // Delete from DB and Log any errors
  pool.query(sql, function(err, result) {
    if (err) {
      console.log("ERROR IN DELETE: ")
      console.log(err);
    }
  });
  // Display the homepage
  res.redirect('/');
}


/*********************Display Manifest Request********************/
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