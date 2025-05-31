import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="mb-4">
      <h5 className="mb-3">
        <i className="fas fa-filter me-2"></i>
        Filter Kategori
      </h5>
      <ButtonGroup className="w-100 flex-wrap">
        <Button
          variant={selectedCategory === null ? "primary" : "outline-primary"}
          onClick={() => onCategoryChange(null)}
          className="mb-2"
        >
          <i className="fas fa-th-large me-2"></i>
          Semua
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "primary" : "outline-primary"}
            onClick={() => onCategoryChange(category.id)}
            className="mb-2"
          >
            <i className={`${category.icon} me-2`}></i>
            {category.name}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default CategoryFilter;
