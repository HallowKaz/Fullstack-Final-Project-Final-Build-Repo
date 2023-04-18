//this is not a page, but rather a function that is exported to other pages
import axios from "axios";

export default function handleAddClick(info){
    console.log("button clicked");
    console.log(info.title);
    axios.post('http://localhost:5678/add',{
      id: info.id,
      title: info.title,
      rating: info.vote_average,
      release: info.release_date,
      overview: info.overview,
      poster: info.poster_path
    })
    //note, the response should be a success/fail method
    .then(function(response){
      console.log("add response is: ");
      console.dir(response); //returns object with headers
      console.log(response.data); //returns message, i.e. 'movie added successfully'
    })
    .catch(function(error){
      console.log("error");
      console.log(error); //returns AxiosError object
      console.log(error.response.data); //returns the error message, i.e. 'duplicate found
    })
  }