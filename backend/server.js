const express = require('express');
const https = require('https'); //native module
const bodyParser = require('body-parser');
const config = require("./config");
const apiKey = config.server.apiKey;
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


//connect
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://"+config.db.user+":"+config.db.pass+"@"+config.db.host+"/?retryWrites=true&w=majority";
//note: Alternatively, I could use process.env.USERNAME and process.env.PASSWORD in the uri
let dbo;
console.log("attempting to connect");
MongoClient.connect(uri, {useUnifiedTopology: true}, function(err, client){
  console.log("connected successfully");
  if(err) throw err;
  dbo = client.db(config.db.name);
  console.dir(dbo.s.namespace); //console.dir(dbo) to see more info
})

app.get('/movie/:id', function(req, res){
    //add code here
})

app.get('/search/:movieName', function(req, res){//searches the api for movie with given name
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

app.get('/popular', function(req, res){//returns popular movies from api
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

app.post('/add', function(req, res){//adds movie to mongodb
    var movie_obj = {};
    var record_id = new Date().getTime();
    movie_obj.record_id = record_id; //id based on time
    movie_obj.id = req.body.id; //id based on tmdb
    movie_obj.title = req.body.title;
    movie_obj.rating = req.body.rating;
    movie_obj.release = req.body.release;
    movie_obj.overview = req.body.overview;
    movie_obj.poster_path = req.body.poster;

    var filterByID = {
        "movie_id": parseInt(movie_obj.id)
    }

    var movie = {
        "_id": movie_obj.record_id,
        "movie_id": movie_obj.id,
        "title": movie_obj.title,
        "rating": movie_obj.rating,
        "release": movie_obj.release,
        "overview": movie_obj.overview,
        "poster_path":movie_obj.poster_path
    };

    MongoClient.connect(uri, {useUnifiedTopology:true}, function(err, client){
        if(err) throw err;
        else{
            console.log('Successfully connected to MongoDB');
        }
        var dbo = client.db(config.db.name);
        console.log("the data inside the movie object is: ");
        console.dir(movie);
        //I should probably check for id duplicates
        dbo.collection(config.db.collection).find(filterByID).toArray(function(err, ob){
            if (err) throw err;
            if(ob.length == 0){ //checking for duplicates before adding movie
                console.log("No duplicate found, movie will be added")

                dbo.collection(config.db.collection).insertOne(movie, function(err, result){
                    if(err) throw err;
                    console.log("inserted document!");
                    console.log(result); //this will prob be an object
                    movie_obj.message = "Movie added successfully";
                    client.close();
                    res.status(200).send(movie_obj.message);
                    console.log("The data inside the response object inside the post function is: ");
                    console.dir(movie_obj);
                });
            } 
            else{
                console.log("duplicate found, movie will not be added");
                movie_obj.message = ("duplicate found, movie will not be added");
                res.status(400).send(movie_obj.message);
                client.close();
            }
        });
    })
})

app.delete('/delete/:movie_id', function(req, res){//deletes movie from mongo db
    var id = req.params.movie_id;
    const filterByID={
      movie_id: parseInt(id)
    };
    console.log("the id inside filter by ID is: ");
    console.dir(filterByID);
    MongoClient.connect(uri, {useUnifiedTopology:true}, function(err, client){
        if(err) throw err;
        var dbo = client.db(config.db.name);
        dbo.collection(config.db.collection).find(filterByID).toArray(function(err, ob){
            if(err) throw err;
            if(ob.length==0){
                console.log("there is no movie with this id to delete");
                client.close();
                res.status(400).send("movie with this id does not exist");
            }
            else{
                dbo.collection(config.db.collection).deleteOne(filterByID, function(err, result){
                    if(err) throw err;
                    res.status(200).send("Movie deleted successfully");
                    client.close();
                });
            }
        })
    })    
})

app.get('/list', function(req, res){//lists movies from mongo db
    MongoClient.connect(uri, {useUnifiedTopology:true}, function(err, client){
        if(err) throw err;
        else{
            console.log('Successfully connected to MongoDB');
        }
        var dbo = client.db(config.db.name);
        dbo.collection(config.db.collection).find().toArray(function(err, result){
            if(err) throw err;
            console.dir(result);
            res.status(200).send(result);
            client.close();
        });
    });
})

app.listen(5678, function(){
    console.log("Server is running on port 5678")
})