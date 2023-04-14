//note: I still need to do npm init and npm install
const express = require('express');
const https = require('https'); //native module
const bodyParser = require('body-parser');
const config = require("./config");
const apiKey = config.apiKey;
const axios = require("axios");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use((req, res, next) => { //this is necessary for the axios call from the frontend to work
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
app.use(express.static('./public'));


// app.get('/', function(req,res){
//     res.render('index', {apiKey: config.apiKey}); //renders the ejs file
// })

app.get('/movie/:id', function(req, res){
    //add code here
})

app.get('/search/:movieName', function(req, res){
    var movieName = req.params.movieName;
    //make a call to the api
    axios.get("https://api.themoviedb.org/3/search/movie?api_key="+apiKey+"&query="+movieName)
    .then(function(response){
        res.status(200).send(response.data);
        console.dir(response.data.results[0]);
    })
    .catch(function(response){
        res.status(500).send(response.data);
        console.dir(response.data.results[0]);
    });
})

app.get('/popular', function(req, res){
    axios.get("https://api.themoviedb.org/3/discover/movie?api_key="+apiKey+"&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate")
    .then(function(response){
        res.status(200).send(response.data);
        //console.dir(response.data.results[0]);
    })
    .catch(function(response){
        res.status(500).send(response.data);
        console.dir(response.data.results[0]);
    });
})

app.listen(5678, function(){
    console.log("Server is running on port 5678")
})