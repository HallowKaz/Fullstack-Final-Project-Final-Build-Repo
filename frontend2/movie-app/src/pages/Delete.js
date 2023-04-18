//this is not a page, but rather a function that is exported to other pages
import axios from "axios";

export default function handleDeleteClick(info){
    console.log("Delete button clicked");
    console.log(info.title);
    console.log(info);
    var id = info.id || info.movie_id; //If api call, it's "info.id". If db call, it's info.movie_id
    axios.delete('http://localhost:5678/delete/'+id)
    .then(function(response){
      console.log("Movie deleted.")
      console.dir(response);
    })
    .catch(function(error){
      console.log("error");
      console.log(error);
    })
}