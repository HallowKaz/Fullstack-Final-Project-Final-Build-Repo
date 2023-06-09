import { useEffect, useState } from "react";
import axios from "axios";
import handleAddClick from './Add';
import handleDeleteClick from "./Delete";

export default function Popular(){
    //let [loading, setLoading]=useState(true);
    let [data, setData] = useState(null);
    //let [error, setError] = useState(null);

    function popularMovies(){
        axios.get("http://localhost:5678/popular",{
        })
        .then(function(response){
            setData(response.data.results);
            console.log("1st movie: ",response.data.results[0]);
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
        popularMovies();
    })

    return (
        <>
        <h1 style={{margin:'15px'}}>Popular Movies</h1>
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
                            <td><button type="button" className="btn btn-success" onClick={()=>handleAddClick(info)}>Add</button></td>
                        </tr>
                        <tr>
                            <td>Release: {info.release_date}</td>
                            <td><button type="button" className="btn btn-danger" onClick={()=>handleDeleteClick(info)}>Delete</button></td>
                        </tr>
                        <tr>
                            <td>Popularity: {info.popularity}</td>
                        </tr>
                        <tr>
                        <td>Rating: {info.vote_average}</td>
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