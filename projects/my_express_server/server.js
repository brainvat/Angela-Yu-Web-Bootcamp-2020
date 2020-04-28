//jshint esversion:6

const express = require("express")
const app = express();

app.get("/", function(req, resp){
  console.log("GET request for root");
  resp.send("Hello, World!");
});


app.listen(3000, function(){
  console.log("Express server listening on port 3000");
});
