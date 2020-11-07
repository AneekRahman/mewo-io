var express = require("express");
var app = express();
var bparser = require("body-parser");
var pool = require("./dbconnect");
var server = require('http').Server(app);
var io = require('socket.io')(server);


app.use(bparser.json());
app.use(bparser.urlencoded({"extended" : "true"}));


app.get("/", function(req, res){

    res.send("Welcome to mewo");

})

app.post("/auth/login", function(req, res){

    var username = req.body.username.trim();
    var password = req.body.password.trim();    

    pool.getConnection(function(err, conn){

        var query = "SELECT id, name, username, password, age, followers, following, hearts, dpurl, probio FROM mewo_users WHERE BINARY username='" + username + "' AND BINARY password='" + password + "'";

        conn.query(query, function(err, rows){

            if(rows.length == 1){

                var id = rows[0].id;

                var name = rows[0].name;

                var username = rows[0].username;

                var password = rows[0].password;

                var age = rows[0].age;

                var followers = rows[0].followers;

                var following = rows[0].following;

                var hearts = rows[0].hearts;

                var dpurl = rows[0].dpurl;

                var bio = rows[0].probio;

                res.json({

                    "status": 200,
                    "message": "OK",
                    "id": id,
                    "name": name,
                    "username": username,
                    "password": password,
                    "age": age,
                    "followers": followers,
                    "following": following,
                    "hearts": hearts,
                    "dpurl": dpurl,
                    "bio": bio

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

app.post("/user_profile", function(req, res){

    var id = req.body.id.trim();

    pool.getConnection(function(err, conn){

        if(err) throw err;

        console.log("Queried for user-profile");

        var query = "SELECT id, name, username, age, followers, following, hearts, dpurl, probio FROM mewo_users WHERE id='" + id + "'";

        conn.query(query, function(err, rows){

            if(err) throw err;

            if(rows.length == 1){

                var id = rows[0].id;

                var name = rows[0].name;

                var username = rows[0].username;

                var age = rows[0].age;

                var followers = rows[0].followers;

                var following = rows[0].following;

                var hearts = rows[0].hearts;

                var dpurl = rows[0].dpurl;

                var bio = rows[0].probio;


                res.json({

                    "id": id,
                    "name": name,
                    "username": username,
                    "age": age,
                    "followers": followers,
                    "following": following,
                    "hearts": hearts,
                    "dpurl": dpurl,
                    "bio": bio

                })

            }else{

                console.log("No-matches");

                res.send("No-matches");

            }

        })

        conn.release();

    })

})


app.post("/user_chatlist", function(req, res){

    var id = req.body.id;

    pool.getConnection(function(err, conn){

        var chatlistname = "chatlist_" + id;

        conn.query("SELECT cid, name, room_id, dpurl, last_text, seen, last_text_time FROM " + chatlistname + " JOIN mewo_users WHERE " + chatlistname + ".cid = mewo_users.id LIMIT 10", function(err, rows){

            if(rows == undefined || rows.length == 0){

            }else{

                res.send(rows); 

            }
            

        })

        conn.release();

    })

})

app.post("/user_chatlist_update", function(req, res){

    var id = req.body.id;

    var last_index = req.body.last_index;

    pool.getConnection(function(err, conn){

        var chatlistname = "chatlist_" + id;

        var limit = last_index;

        conn.query("SELECT cid, name, room_id, dpurl, last_text, seen, last_text_time FROM " + chatlistname + " JOIN mewo_users WHERE " + chatlistname + ".cid = mewo_users.id LIMIT " + last_index, function(err, rows){

            if(rows == undefined || rows.length == 0){

            }else{

                res.send(rows); 

            }
            

        })

        conn.release();

    })

})

var connIDs = {}; 

io.on("connection", function(socket){

    var userID = null;

    var msgRoom = null;

    console.log("New user connected, id: " + socket.id);

    socket.on("assignID", function(id){

        userID = id;

        var cid = "id_" + id;

        connIDs[cid] = socket.id;

        console.log("ID: " + connIDs[cid]);

        console.log("Connected IDs: " + Object.keys(connIDs).length);

    })

    socket.on("join_message_room", function(room_id){

        socket.join(room_id);

        msgRoom = room_id;

        console.log("User joined a room: " + room_id);

    })

    socket.on("sent_message", function(msg){

        io.to(msgRoom).emit()

    })

    socket.on("leave_message_room", function(room_id){

        socket.leave(room_id);

        console.log("User left room: " + room_id);

    })

    

    socket.on("disconnect", function(){

        var cid = "id_" + userID;

        delete connIDs[cid];

        console.log("User disconnected, id: " + socket.id);

    })

})




server.listen(3000, function(){console.log("Listening on port 3000")});