import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { formatCurrency } from '../utils/api';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ProductCard = ({ product, categoryName, onAddToCart }) => {
  const handleImageError = (e) => {
    // Fallback image jika gambar tidak ditemukan
    e.target.onerror = null;
    e.target.src = '/images/products/default.jpg';
  };

  return (
    <Card className="h-100 shadow-sm">
      <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
        <Card.Img
          variant="top"
          src={product.gambar}
          alt={product.nama}
          onError={handleImageError}
          style={{
            objectFit: 'cover',
            height: '100%',
            width: '100%'
          }}
        />
        <div className="position-absolute top-0 end-0 m-2">
          <span className="badge bg-primary">
            {categoryName}
          </span>
        </div>
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="h6 mb-2">{product.nama}</Card.Title>
        <Card.Text className="text-muted small mb-2">
          Kode: {product.kode}
        </Card.Text>
        <Card.Text className="fw-bold text-primary mb-3">
          {formatCurrency(product.harga)}
        </Card.Text>
        <Button
          variant="outline-primary"
          className="mt-auto"
          onClick={() => onAddToCart(product)}
        >
          <i className="fas fa-cart-plus me-2"></i>
          Tambah ke Keranjang
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
