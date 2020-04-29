const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  const vars = {
    msg: 'Hello, world.'
  }
  res.render('pages/weather', vars);
});

app.listen(3000, function(){
  console.log("Listening on port 3000");
});
