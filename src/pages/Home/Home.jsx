import { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import "./Home.css";

const Home = () => {
  const [data, setData] = useState([]);
  const [closedCards, setClosedCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 20; // Number of cards per page

  useEffect(() => {
    fetch("http://contest.elecard.ru/frontend_data/catalog.json")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  const handleCardClose = (itemId) => {
    setClosedCards((prevClosedCards) => [...prevClosedCards, itemId]);
  };

  const isCardClosed = (itemId) => closedCards.includes(itemId);

  // Sorting logic (simplified)
  const sortedData = [...data].sort((a, b) => a.category.localeCompare(b.category));

  // Pagination logic
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = sortedData.slice(indexOfFirstCard, indexOfLastCard);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <main className="main">
        {currentCards.map((item) => (
          <Card
            key={item.id}
            item={item}
            onClose={() => handleCardClose(item.id)}
            isClosed={isCardClosed(item.id)}
          />
        ))}
      </main>
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
