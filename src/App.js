
import { BrowserRouter, Routes,Route } from 'react-router-dom';
import './App.css';

import { Container } from '@mui/material';
import Trending from './Pages/Trending/Trending';
import Movies from './Pages/Movies/Movies';
import Series from './Pages/Series/Series';
import MovieHubBottomNav from './components/MainNav.js';
import Search from './Pages/Search/Search';
import { Header } from './components/Header/Header';


function App() {
  return (
    <BrowserRouter>
      <Header/>
      <div className="app">      
        <Container>
          <Routes>
            <Route path="/" element={<Trending/>}/>
            <Route path="/movies" element={<Movies/>}/>
            <Route path="/series" element={<Series/>}/>
            <Route path="/search" element={<Search/>}/>
            
          </Routes>
        </Container>
      </div>


      <MovieHubBottomNav/>
    </BrowserRouter>
  );
}

export default App;
