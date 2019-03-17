const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var app = express();
var params = [];

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', 'views');
app.set('view engine', 'ejs');


const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || "postgres://test@localhost:5432/postgres";
const pool = new Pool({connectionString: connectionString});

app.get("/", function(req, res){
  console.log("received a request for /");
  res.render("index.ejs");
});

app.get('/manifest', getManifest);

function getManifest(req, res) {
  getDB(function(error, result) {
    //params = JSON.stringify(result);
    //console.log("PARAMS: " + params);
    var object = [];
    for (var i = 0; i < result.length; i++) {
      object[i] = result[i];
    }
    //console.log("testing " + object[0].name);
    res.render("index", {object: object});
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