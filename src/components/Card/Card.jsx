import React from "react";
import "./Card.css";

const Card = ({ item, onClose, isClosed }) => {
  return (
    <div className={`card ${isClosed ? "closed" : ""}`}>
      <span className="close-button" onClick={onClose}>
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
          Timestamp:{" "}
          {new Date(item.timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

export default Card;
