import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar, Nav, Container, Form, Button} from 'react-bootstrap'
import {Routes, Route, Link, useNavigate} from 'react-router-dom'
import Home from './pages/Home'
import SearchByName from './pages/SearchByName';
import {useState} from 'react';
import axios from "axios";
import Popular from './pages/Popular';

//this component handles both the navbar and the search bar//
function App() {
  const [movieName, setMovieName] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /**
   * This function uses axios to perform a get request
   * It uses 'movieName' which the user will input into the search bar, and
   * the function is triggered once the user submits the form by clicking the button
   * @param {event} e 
   */
  function sendSearch(e){
    e.preventDefault();
    setError(false);
    axios.get("http://localhost:5678/search/"+movieName,
    {
      movieName:movieName
    })
    .then(function(response){
      //console.dir(response.data); //this will return an array of objects, each object being a movie with various properties
      //for example, you could access the first movie with response.data.results[0]
      if(response.data.results.length>0){ //if there is more than 0 results for your search term
        setData(response.data.results.slice(0, 5)); 
        console.dir(data); //"data" is now an array of movie objects, with properties such as "title", "overview" etc.
        console.log("check")
      }
      else{ //if there are no results for your search term, send error
        setError(true);
      }
      navigate('/SearchByName')
    })
    .catch(function(error){
        console.log(error);
    })
    .then(function(){
      //clear inputs
      setMovieName("");
    })
  }

  function handleHomeClick(){
    setData(null);
    setError(false);
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>The Critique Crew</Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav>
              <Nav.Link as={Link} to='/' onClick={handleHomeClick}>Home</Nav.Link>
              <Nav.Link as={Link} to='/Popular'>Popular</Nav.Link>
              {/* *add more nav links*
              <Nav.Link as={Link} to='/NowPlaying'>Display</Nav.Link>*/}
            </Nav>
            <Form className="d-flex" onSubmit={sendSearch} >
              <Form.Control //how do I access the value when the form is submitted?
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value = {movieName}
                onChange={(e)=>setMovieName(e.target.value)} //update state with inputs
              />
              <Button variant="outline-success" type = "submit">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        <Route path ="/" element = {<Home />}></Route>
        <Route path ="/Popular" element={<Popular />}></Route>
        <Route path ="/SearchByName" element = {<SearchByName />}></Route>
        {/*Add more routes */}
      </Routes>
      {error&&
        <h4 style={{color:'red', 'fontWeight': 'bold', marginLeft: '15px'}}>No movies found by that title</h4>
      }
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
                        <td rowSpan={4}><img src={`https://image.tmdb.org/t/p/original/${info.poster_path}`} width="250" alt="movie poster" /></td>
                        <td>{info.title}</td>
                    </tr>
                    <tr>
                        <td>Release: {info.release_date}</td>
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
  );
}

export default App;
