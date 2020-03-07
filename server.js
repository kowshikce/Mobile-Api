const http = require("http");
const app = require("./app");
const path = require("path");
const slash = require("slash");
const socket = require("socket.io");

//Getting Port From Environment Or Manullay
//Provided By The Code.
const PORT = process.env.PORT || 3000;

//Creating A Server That's Get The App
//Module And Passing It As Argument.
const server = http.createServer(app);

//Listening for connection That Users Accepts And
//It will be counted for the later use.
var io = socket(http);

io.on("connection", function(socket) {
  console.log(`A User Connected.`);
});

//Listening For Port That The Server Is Listening
//ON.
server.listen(PORT, () => {
  console.log(`Server Started On Port: ${PORT}`);
});
