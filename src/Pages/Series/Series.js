import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./Series.css";

Modal.setAppElement("#root");

function Series() {
  const [series, setSeries] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [trailerKey, setTrailerKey] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=${page}`
        );
        setSeries(data.results);
        setTotalPages(Math.min(data.total_pages, 10)); // limit to 10 pages
      } catch (error) {
        console.error("Error fetching series:", error);
      }
    };
    fetchSeries();
  }, [page]);

  const fetchTrailer = async (tv) => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/tv/${tv.id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      const trailer = data.results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );
      setTrailerKey(trailer ? trailer.key : "");
    } catch (err) {
      console.error("Trailer not found", err);
      setTrailerKey("");
    }
  };

  const openModal = (tv) => {
    setSelectedSeries(tv);
    fetchTrailer(tv);
  };

  const closeModal = () => {
    setSelectedSeries(null);
    setTrailerKey("");
  };

  // Pagination render
  const renderPagination = () => {
    let pages = [];

    // Determine start & end to always show 3 pages
    let start = Math.max(1, page - 1);
    let end = Math.min(totalPages, page + 1);

    if (end - start < 2) {
      if (start === 1) end = Math.min(totalPages, start + 2);
      if (end === totalPages) start = Math.max(1, end - 2);
    }

    for (let p = start; p <= end; p++) {
      pages.push(
        <button
          key={p}
          className={`page-btn ${page === p ? "active" : ""}`}
          onClick={() => setPage(p)}
        >
          {p}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          ◀
        </button>
        {pages}
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          ▶
        </button>
      </div>
    );
  };

  return (
    <div className="series-page">
      <div className="series-container">
        {series.map((tv) => (
          <div
            key={tv.id}
            className="series-card"
            onClick={() => openModal(tv)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
              alt={tv.name}
              className="series-poster"
            />
            <div className="series-overlay">
              <h3>{tv.name}</h3>
              <p>{(tv.first_air_date || "").slice(0, 4)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {renderPagination()}

      {/* Modal */}
      <Modal
        isOpen={!!selectedSeries}
        onRequestClose={closeModal}
        contentLabel="Series Modal"
        className="series-modal"
        overlayClassName="series-overlay-bg"
      >
        {selectedSeries && (
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

            <h2>{selectedSeries.name}</h2>
            <p>{selectedSeries.overview}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Series;
