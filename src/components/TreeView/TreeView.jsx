import React, { useState } from "react";
import "./TreeView.css";

const TreeView = ({ data }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [collapsedCategories, setCollapsedCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerCategory = 2;

  // Function to toggle the collapse state of a category
  const toggleCollapse = (category, e) => {
    e.stopPropagation();
    setCollapsedCategories((prevCollapsedCategories) =>
      prevCollapsedCategories.includes(category)
        ? prevCollapsedCategories.filter((item) => item !== category)
        : [...prevCollapsedCategories, category]
    );
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setSelectedImage(null);
    setModalOpen(false);
    document.body.classList.remove("modal-open");
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeModal();
    }
  };

  const groupedData = data.reduce((acc, item) => {
    const { category } = item;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const treeData = Object.keys(groupedData).map((category) => ({
    name: category,
    children: groupedData[category].map((item) => ({
      name: item.image,
      children: [],
    })),
  }));

  // Calculate the range of images to display on the current page
  const indexOfLastImage = currentPage * imagesPerCategory;
  const indexOfFirstImage = indexOfLastImage - imagesPerCategory;
  const imagesToDisplay = treeData.map((category) => ({
    ...category,
    children: category.children.slice(indexOfFirstImage, indexOfLastImage),
  }));

  // Handle next and previous page buttons
  const nextPage = () => {
    if (indexOfLastImage < treeData[0].children.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderTree = (nodes) => (
    <ul>
      {nodes.map((node) => (
        <li key={node.name}>
          <span className="category" onClick={(e) => toggleCollapse(node.name, e)}>
            {node.children &&
              node.children.length > 0 &&
              (collapsedCategories.includes(node.name) ? "▶" : "▼")}{" "}
          </span>
          {node.name.toLowerCase().endsWith(".jpg") || node.name.toLowerCase().endsWith(".png") ? (
            <span onClick={() => openModal(node.name)}>
              <img
                className="category-image"
                src={`http://contest.elecard.ru/frontend_data/${node.name}`}
                alt={node.name}
              />
            </span>
          ) : (
            <span onClick={(e) => toggleCollapse(node.name, e)} className="text">
              {node.name}
            </span>
          )}
          {!collapsedCategories.includes(node.name) && node.children && renderTree(node.children)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="tree-view">
      <h2>Tree View</h2>
      {renderTree(imagesToDisplay)}
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous Page
        </button>
        <button onClick={nextPage} disabled={indexOfLastImage >= treeData[0].children.length}>
          Next Page
        </button>
      </div>
      {modalOpen && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <img
              src={`http://contest.elecard.ru/frontend_data/${selectedImage}`}
              alt="Selected"
              className="modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeView;
