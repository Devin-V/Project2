const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var app = express();
var params = [];

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', 'views');
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index'));
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || "postgres://test@localhost:5432/postgres";
const pool = new Pool({connectionString: connectionString});

app.get('/manifest', getManifest);

app.get('/', function(req, res){
  console.log("recieved a root request");
  res.render("index");
});

function getManifest(req, res) {
  getDB(function(error, result) {
    params = JSON.stringify(result);
    console.log("PARAMS: " + params);
    console.log("testing " + result[2].name);
    res.render("index", result);
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