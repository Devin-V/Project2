const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index'));
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || "dbblma8kvlrik9";
const pool = new Pool({connectionString: connectionString});

app.get('/manifest', getManifest);

function getManifest(request, response) {
  getDB(function(error, result) {
    if (error || result == null || result.length != 1) {
      response.status(500).json({success: false, data: error});
    } else {
      const name = result[1];
      response.status(200).json(name);
    }
  });
}

function getDB(callback) {
  console.log("getting manifest");

  const sql = "SELECT * FROM manifest";

  const params = [];

  pool.query(sql, params, function(err, result) {
    if (err) {
      console.log("Error in query: ")
      console.log(err);
      callback(err, null);
    }

    console.log("found result: " + JSON.stringify(result.rows));

    callback(null, result.rows);
  });
}