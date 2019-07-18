var express = require('express');
var app = express();
var path    = require("path");
var mysql = require('mysql');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1111",
  // database: "chatapp"
});

// //set the template engine ejs
// app.set('view engine', 'ejs');


//middlewares
 app.use(express.static('public'));

//routes
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname+'/views/index.html'));
});


app.post('/submit',function(req,res){
var msg = req.body.message;
console.log(msg)

  con.connect(function(err) {
  if (err) throw err;
  var sql = "INSERT INTO msgdata (message) VALUES ('"+msg+"')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
     res.end();
  });
  });
});

//Listen on port 3000
server = app.listen(3000);
console.log("server is running on port", server.address().port);

//socket.io instantiation
const io = require("socket.io")(server);
var sockets = [];

//listen on every connection
io.on('connection', (socket) => {
//console.log('New user connected')
   //  console.log(socket.id);
//default username
	
  sockets.push(socket.id)
  console.log(sockets[0])
  console.log(sockets[1])
  console.log(sockets[2])


	socket.username = " "
    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username
          console.log(data.username+' has connected to the server')        
    });

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
      //  io.sockets.emit('new_message', {message : data.message, username : socket.username});
      // io.emit('new_message', {message : data.message, username : socket.username});
    //  io.sockets.connected[socket.id].emit("new_message",{message : data.message, username : socket.username});
      io.to(sockets[2]).emit("new_message",{message : data.message, username : socket.username})
    });

     socket.on('disconnect', function(){
        // remove the username from global usernames list
        delete username;

        // echo globally that this client has left
       console.log(socket.username + ' has disconnected');
    });
});
