import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./Movies.css";

Modal.setAppElement("#root");

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMovies = async (pageNumber = 1) => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.REACT_APP_API_KEY}&page=${pageNumber}`
      );
      setMovies(data.results || []);
      setTotalPages(Math.min(data.total_pages, 10)); // limit to 10 pages for simplicity
    } catch (e) {
      console.error("Error fetching movies:", e);
    }
  };

  const fetchTrailer = async (movieId) => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      const trailer = (data.results || []).find(
        (v) => v.site === "YouTube" && v.type === "Trailer"
      );
      setTrailerKey(trailer ? trailer.key : "");
    } catch (err) {
      console.error("Trailer fetch failed", err);
      setTrailerKey("");
    }
  };

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  const openModal = (movie) => {
    setSelectedMovie(movie);
    fetchTrailer(movie.id);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setTrailerKey("");
  };

  // generate pagination numbers
  // generate pagination numbers (show only 3 pages at a time)
  const renderPagination = () => {
    let pages = [];

    // figure out start & end
    let start = Math.max(1, page - 1);
    let end = Math.min(totalPages, page + 1);

    // ensure always 3 numbers if possible
    if (end - start < 2) {
      if (start === 1) {
        end = Math.min(totalPages, start + 2);
      } else if (end === totalPages) {
        start = Math.max(1, end - 2);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          className={`page-btn ${page === i ? "active" : ""}`}
          onClick={() => setPage(i)}
        >
          {i}
        </button>
      );
    }

    return (
  <div className="pagination">
    <button
      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
      disabled={page === 1}
    >
      ◀
    </button>

    {[page - 1, page, page + 1].map((p) => {
      if (p < 1) return null; // avoid negative pages
      return (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`page-btn ${page === p ? "active" : ""}`}
        >
          {p}
        </button>
      );
    })}

    <button
      onClick={() => setPage((prev) => prev + 1)}
      disabled={page === totalPages}
    >
      ▶
    </button>
  </div>
);
  }

  return (
    <div className="movies-page">
      <div className="movies-container">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="movie-card"
            onClick={() => openModal(movie)}
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={movie.title}
              className="movie-poster"
            />
            <div className="movie-overlay">
              <h3>{movie.title}</h3>
              <p>{(movie.release_date || "----").slice(0, 4)}</p>
            </div>
          </div>
        ))}
      </div>

      {renderPagination()}

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

};

export default Movies;

