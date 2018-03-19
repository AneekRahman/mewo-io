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

        if(err) throw err;

        var query = "SELECT username FROM users WHERE username='" + username + "' AND password='" + password + "'";

        conn.query(query, function(err, rows){

            if(err) throw err;

            if(rows.length == 1){

                console.log(rows)

                res.json({

                    "status": 200,
                    "message": "Logging In!...",
                    "username": username

                })

            }else{

                res.json({

                    "status": 404,
                    "message": "Incorrect E-mail, Phone or Username and Password"

                })

            }

        })

        conn.release();

        

    })



})



app.listen(3000, function(){console.log("Listening on port 3000")});