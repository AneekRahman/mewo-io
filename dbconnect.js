var mysql = require("mysql");

var pool = mysql.createPool({

    host: "localhost",
    user: "root",
    password: "",
    database: "mewo.io"    

});

module.exports = pool;