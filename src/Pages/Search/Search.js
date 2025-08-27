import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./Search.css";

Modal.setAppElement("#root");

const Search = () => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("movie"); // movie or tv
  const [results, setResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [trailerKey, setTrailerKey] = useState("");

  const handleSearch = async () => {
    if (!query) return;

    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/search/${type}?api_key=${process.env.REACT_APP_API_KEY}&query=${query}&language=en-US&page=1&include_adult=false`
      );
      setResults(data.results || []);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const fetchTrailer = async (itemId) => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/${type}/${itemId}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
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

  const openModal = (item) => {
    setSelectedItem(item);
    fetchTrailer(item.id);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setTrailerKey("");
  };

  return (
    <div className="search-page">
      <div className="search-controls">
        <input
          type="text"
          placeholder="Search for movies or TV shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <div className="type-buttons">
          <button
            className={type === "movie" ? "active" : ""}
            onClick={() => setType("movie")}
          >
            Movie
          </button>
          <button
            className={type === "tv" ? "active" : ""}
            onClick={() => setType("tv")}
          >
            TV Series
          </button>
        </div>
        <button onClick={handleSearch} className="search-btn">
          Search
        </button>
      </div>

      <div className="results-container">
        {results.map((item) => (
          <div
            key={item.id}
            className="result-card"
            onClick={() => openModal(item)}
          >
            <img
              src={
                item.poster_path
                  ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={item.title || item.name}
            />
            <div className="card-overlay">
              <h3>{item.title || item.name}</h3>
              <p>{(item.release_date || item.first_air_date || "----").slice(0, 4)}</p>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!selectedItem}
        onRequestClose={closeModal}
        contentLabel="Trailer Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {selectedItem && (
          <div className="modal-content">
            <button className="close-btn" onClick={closeModal}>
              ✖
            </button>
            {trailerKey ? (
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title="Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <p>No trailer available</p>
            )}
            <h2>{selectedItem.title || selectedItem.name}</h2>
            <p>{selectedItem.overview}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Search;
