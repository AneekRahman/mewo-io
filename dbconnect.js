var mysql = require("mysql");

var pool = mysql.createPool({

    host: "localhost",
    user: "root",
    password: "",
    database: "node"    

});

module.exports = pool;