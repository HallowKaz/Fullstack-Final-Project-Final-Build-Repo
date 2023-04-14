import { useEffect, useState } from "react";
import axios from "axios";

export default function Popular(){
    //let [loading, setLoading]=useState(true);
    let [data, setData] = useState(null);
    //let [error, setError] = useState(null);

    function popularMovies(){
        axios.get("http://localhost:5678/popular",{
        })
        .then(function(response){
            setData(response.data.results);
            console.dir(data);
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
                        </tr>
                        <tr>
                            <td>Release: {info.release_date}</td>
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