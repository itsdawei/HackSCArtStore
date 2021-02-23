import * as async from "async"
import * as fs from "fs"
import Pg from 'pg'

//var async = require('async');
//var fs = require('fs');
//var pg = require('pg');

// Connect to the "users" database.
var config = {
    user: 'carson',
    host: 'free-tier.gcp-us-central1.cockroachlabs.cloud',
    database: 'honest-mole-872.defaultdb',
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

var pool = new Pg.Pool(config);

export function addUser(name, add, pass, email, isartist) {
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

export function addArt(name, artID) {
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

export function checkOwnership(artid) {
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

export function changeOwnership(artid, newOwner) {
  var sql = "UPDATE users.art SET a.userid = $1 WHERE i.username=a.userid AND a.artid= $2";
  pool.query(sql, [newOwner, artid], (err) => {
    if (err) {
      throw err;
    }
  });
}

//checkOwnership("randomlygeneratedartpiece");
//addArt("Carson", "randomlygeneratedartpiece");

addUser("Carson", "1111112e8igwhjdbkbkb", "pass", "email", false);
