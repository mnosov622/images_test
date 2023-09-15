import React, { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import "./Home.css";

const Home = () => {
  const [data, setData] = useState([]);
  const [closedCards, setClosedCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("category");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const cardsPerPage = 20;

  const resetCards = () => {
    localStorage.removeItem("closedCards");
    window.location.reload();
  };

  useEffect(() => {
    fetch("http://contest.elecard.ru/frontend_data/catalog.json")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
      });
  }, []);

  const handleCardClose = (itemId) => {
    setClosedCards((prevClosedCards) => [...prevClosedCards, itemId]);
  };

  const isCardClosed = (itemId) => closedCards.includes(itemId);

  const sortedData = [...data].sort((a, b) => {
    switch (sortBy) {
      case "category":
        return a.category.localeCompare(b.category);
      case "date":
        return b.timestamp - a.timestamp;
      case "name":
        return a.image.localeCompare(b.image);
      case "size":
        return a.filesize - b.filesize;
      default:
        return 0;
    }
  });

  // Pagination logic
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;

  const currentCards = selectedCategory
    ? sortedData
        .filter((item) => item.category === selectedCategory)
        .slice(indexOfFirstCard, indexOfLastCard)
    : sortedData.slice(indexOfFirstCard, indexOfLastCard);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setSelectedCategory(null);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const uniqueCategories = [...new Set(data.map((item) => item.category))];

  return (
    <>
      {isLoading ? (
        <div className="loader">
          <div className="loader-circle"></div>
        </div>
      ) : (
        <>
          <div className="sort">
            <label>Sort by:</label>
            <div className="sort-category">
              <label>
                <input
                  type="radio"
                  name="sortBy"
                  value="category"
                  checked={sortBy === "category"}
                  onChange={handleSortChange}
                />
                Category
              </label>
              <label>
                <input
                  type="radio"
                  name="sortBy"
                  value="date"
                  checked={sortBy === "date"}
                  onChange={handleSortChange}
                />
                Date
              </label>
              <label>
                <input
                  type="radio"
                  name="sortBy"
                  value="name"
                  checked={sortBy === "name"}
                  onChange={handleSortChange}
                />
                Name
              </label>
              <label>
                <input
                  type="radio"
                  name="sortBy"
                  value="size"
                  checked={sortBy === "size"}
                  onChange={handleSortChange}
                />
                Size
              </label>
            </div>
          </div>
          <button className="reset-button" onClick={resetCards}>
            Reset Images
          </button>
          {sortBy === "category" ? (
            <div className="categories">
              <button onClick={() => handleCategoryClick(null)}>All</button>
              {uniqueCategories.map((category, index) => (
                <button key={index} onClick={() => handleCategoryClick(category)}>
                  {category}
                </button>
              ))}
            </div>
          ) : sortBy === "date" ? (
            // Render date-specific buttons here
            <div className="date-filter">{/* Date filtering options */}</div>
          ) : sortBy === "name" ? (
            // Render name-specific buttons here
            <div className="name-filter">{/* Name filtering options */}</div>
          ) : (
            // Render size-specific buttons here
            <div className="size-filter">{/* Size filtering options */}</div>
          )}
          <main className="main">
            {currentCards.map((item, index) => (
              <Card
                id={index}
                key={index}
                item={item}
                onClose={() => handleCardClose(index)}
                isClosed={isCardClosed(item.id)}
              />
            ))}
          </main>
        </>
      )}
      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentCards.length < cardsPerPage}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Home;
