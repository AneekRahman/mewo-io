var express = require("express");
var app = express();
var bparser = require("body-parser");
var pool = require("./dbconnect");

app.use(bparser.json());
app.use(bparser.urlencoded({"extended" : "true"}));


app.get("/", function(req, res){

    res.send("Welcome to mewo");

})

app.post("/auth/login", function(req, res){

    var username = req.body.username.trim();
    var password = req.body.password.trim();    

    pool.getConnection(function(err, conn){

        var query = "SELECT name FROM users WHERE BINARY username='" + username + "' AND BINARY password='" + password + "'";

        conn.query(query, function(err, rows, fields){

            if(rows.length == 1){

                var name = rows[0].name;

                res.json({

                    "status": 200,
                    "message": "OK",
                    "name": name

                })

            }else{

                res.json({

                    "status": 404,
                    "message": "Incorrect E-mail, Phone or Username and Password"

                })

            }

        })

        conn.release();

        pool.on("error", function(e){

            console.log("Error on pool");

        })
        

    })



})



app.listen(3000, function(){console.log("Listening on port 3000")});