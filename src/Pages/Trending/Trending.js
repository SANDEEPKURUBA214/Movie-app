import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./Trending.css";

Modal.setAppElement("#root");

function Trending() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState("");

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.REACT_APP_API_KEY}`
        );
        setMovies(data.results);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      }
    };
    fetchTrending();
  }, []);

  const fetchTrailer = async (movie) => {
    try {
      const type = movie.media_type === "tv" ? "tv" : "movie";
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/${type}/${movie.id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      const trailer = data.results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );
      setTrailerKey(trailer ? trailer.key : "");
    } catch (err) {
      console.error("Trailer not found", err);
    }
  };

  const openModal = (movie) => {
    setSelectedMovie(movie);
    fetchTrailer(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setTrailerKey("");
  };

  return (
    <div className="trending-page">
      <h2 className="trending-title">Trending Today</h2>
      <div className="trending-container">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="movie-card"
            onClick={() => openModal(movie)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title || movie.name}
              className="movie-poster"
            />
            <div className="movie-overlay">
              <h3>{movie.title || movie.name}</h3>
              <p>{(movie.release_date || movie.first_air_date || "").slice(0, 4)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={!!selectedMovie}
        onRequestClose={closeModal}
        contentLabel="Movie Modal"
        className="movie-modal"
        overlayClassName="movie-overlay-bg"
      >
        {selectedMovie && (
          <div className="modal-content">
            <button onClick={closeModal} className="close-btn">✖</button>

            {trailerKey ? (
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title="YouTube trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <p>No trailer available</p>
            )}

            <h2>{selectedMovie.title}</h2>
            <p>{selectedMovie.overview}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Trending;


