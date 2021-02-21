var async = require('async');
var fs = require('fs');
var pg = require('pg');

// Connect to the "users" database.
var config = {
    user: 'admin',
    host: 'localhost',
    database: 'users',
    port: 26257,
    ssl: {
        ca: fs.readFileSync('certs/ca.crt')
            .toString(),
        key: fs.readFileSync('certs/client.admin.key')
            .toString(),
        cert: fs.readFileSync('certs/client.admin.crt')
            .toString()
    }
};

var pool = new pg.Pool(config);

function addUser(name, add, pass, email, isartist) {
  var sql = "INSERT INTO info (username, address, password, email, isartist) VALUES($1, $2, $3, $4, $5);";
  pool.query(sql, [name, add, pass, email, isartist], (err, res) => {
    if (err) {
      throw err;
    }
    else {
      console.log(res.rows[0]);
    }
  });
}

function addArt(name, artID) {
  var sql ="INSERT INTO art (artID, userID) VALUES($1, $2)"
  pool.query(sql, [artID, name], (err, res) => {
    if (err) {
      throw err;
    }
    else {
      console.log(res.rows[0]);
    }
  });
}

function checkOwnership(artid) {
  var sql = "SELECT i.username FROM info i, art a WHERE i.username=a.userid AND a.artid=$1";
  pool.query(sql, [artid], (err, res) => {
    if (err) {
      throw err;
    }
    else {
      //add whatever we want 
      console.log(res.rows[0]);
    }
  });
}

//checkOwnership("randomlygeneratedartpiece");
//addArt("Carson", "randomlygeneratedartpiece");

//addUser("Carson", "1111112e8igwhjdbkbkb", "pass", "email", false);




