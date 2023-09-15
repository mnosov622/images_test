import React, { useEffect, useState } from "react";
import "./Card.css";

const Card = React.memo(({ item, onClose, isClosed, id }) => {
  const [cardClosed, setCardClosed] = useState(false);
  const [closedCards, setClosedCards] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("closedCards") !== null) {
      const closedCards = JSON.parse(localStorage.getItem("closedCards"));
      closedCards.forEach((cardId) => {
        if (cardId === id) {
          setCardClosed(true);
        }
      });
    } else {
      localStorage.setItem("closedCards", JSON.stringify([]));
    }
  }, [id]);

  const handleRemoveImage = () => {
    setCardClosed(true);
    setClosedCards((prevClosedCards) => [...prevClosedCards, id]);
    const closedCards = JSON.parse(localStorage.getItem("closedCards"));
    if (closedCards || closedCards === null) {
      localStorage.setItem("closedCards", JSON.stringify([...closedCards, id]));
    }
  };

  return (
    <div className={`card ${cardClosed ? "closed" : ""}`}>
      <span className="close-button" onClick={handleRemoveImage}>
        &#x2716;
      </span>
      <img
        src={`http://contest.elecard.ru/frontend_data/${item.image}`}
        alt={item.category}
        className="card-image"
      />
      <div className="card-details">
        <p>Category: {item.category}</p>
        <p>Filesize: {item.filesize} bytes</p>
        <p>
          Date:{" "}
          {new Date(item.timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
});

export default Card;
