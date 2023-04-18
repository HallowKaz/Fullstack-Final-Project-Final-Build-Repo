import del from '../delete.png'
import { useEffect, useState } from "react";
import axios from "axios";
import handleDeleteClick from "./Delete";

export default function Favorites(){
    //let [loading, setLoading]=useState(true);
    let [data, setData] = useState(null);
    //let [error, setError] = useState(null);

    function faveMovies(){
        axios.get("http://localhost:5678/list",{
        })
        .then(function(response){
            setData(response.data); //response.data is the array of movie objects
            console.log("title of first movie in favorites:")
            console.log(response.data[0].title);
        })
        .catch(function(error){
            //console.dir(error);
            console.log("error");
        })
        .then(function(){
            //always eecuted
        })
    }

    useEffect(()=>{
        if(!data)   //if data is null, then get faveMovies. The purpose of this is to prevent the function from being called continuously
        faveMovies();
    })

    return (
        <>
        <h1 style={{margin:'15px'}}>Favorite Movies</h1>
        {data&&
        <div>
        <br />
        <table className="table" >
            <thead>
                <tr>
                    <th>Poster</th>
                    <th>Details</th>
                </tr>
            </thead>
            {data.map(info =>{
                return(
                    <tbody>
                        <tr>
                            <td rowSpan={5}><img src={`https://image.tmdb.org/t/p/original/${info.poster_path}`} width="250" alt="movie poster" /></td>
                            <td>{info.title}</td>
                            <td><button type="button" className="btn btn-light" onClick={()=>handleDeleteClick(info)}><img width="30px" alt='delete' src={del}/></button></td>
                        </tr>
                        <tr>
                            <td>Release: {info.release}</td>
                        </tr>
                        {/* <tr>
                            <td>Popularity: {info.popularity}</td>
                        </tr> */}
                        <tr>
                        <td>Rating: {info.rating}</td>
                        </tr>
                        <tr>
                        <td>{info.overview}</td>
                        </tr>
                    </tbody>
                )
                })}
            </table>
        </div>
        }
        </>
    )
}