import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner, Button } from 'react-bootstrap';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import CartComponent from '../components/CartComponent';
import { 
  getCategories, 
  getProducts, 
  getProductsByCategory,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../utils/api';
import swal from 'sweetalert';
import '@fortawesome/fontawesome-free/css/all.min.css';

const KasirPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load products when category changes
  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [categoriesData, cartData] = await Promise.all([
        getCategories(),
        getCart()
      ]);
      
      setCategories(categoriesData);
      setCartItems(cartData);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError(err.message || 'Gagal memuat data. Pastikan JSON Server berjalan di port 3001.');
      
      // Auto retry logic
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          loadInitialData();
        }, 2000); // Retry after 2 seconds
      }
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setError(null);
      let productsData;
      if (selectedCategory === null) {
        productsData = await getProducts();
      } else {
        productsData = await getProductsByCategory(selectedCategory);
      }
      setProducts(productsData);
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err.message || 'Gagal memuat produk');
      swal("Error", err.message || "Gagal memuat produk", "error");
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleAddToCart = async (product) => {
    try {
      // Check if item already exists in cart
      const existingItem = cartItems.find(item => item.productId === product.id);
      
      if (existingItem) {
        // Update quantity
        const updatedItem = {
          ...existingItem,
          jumlah: existingItem.jumlah + 1
        };
        await updateCartItem(existingItem.id, updatedItem);
      } else {
        // Add new item
        const newCartItem = {
          productId: product.id,
          nama: product.nama,
          harga: product.harga,
          jumlah: 1,
          keterangan: ''
        };
        await addToCart(newCartItem);
      }
      
      // Reload cart
      const updatedCart = await getCart();
      setCartItems(updatedCart);
      
      swal("Berhasil!", `${product.nama} ditambahkan ke keranjang`, "success");
    } catch (err) {
      console.error('Error adding to cart:', err);
      swal("Error", "Gagal menambahkan ke keranjang", "error");
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      const item = cartItems.find(item => item.id === itemId);
      if (item) {
        const updatedItem = {
          ...item,
          jumlah: newQuantity
        };
        await updateCartItem(itemId, updatedItem);
        
        // Reload cart
        const updatedCart = await getCart();
        setCartItems(updatedCart);
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      swal("Error", "Gagal mengupdate jumlah", "error");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      
      // Reload cart
      const updatedCart = await getCart();
      setCartItems(updatedCart);
    } catch (err) {
      console.error('Error removing item:', err);
      swal("Error", "Gagal menghapus item", "error");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      setCartItems([]);
    } catch (err) {
      console.error('Error clearing cart:', err);
      swal("Error", "Gagal mengosongkan keranjang", "error");
    }
  };

  const handleCheckout = async (orderData) => {
    try {
      // In a real application, you would send this to a backend
      console.log('Order data:', orderData);
      
      // Clear cart after successful checkout
      await clearCart();
      setCartItems([]);
    } catch (err) {
      console.error('Error during checkout:', err);
      swal("Error", "Gagal memproses checkout", "error");
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Memuat data...</p>
        {retryCount > 0 && (
          <p className="text-muted">
            Mencoba menghubungkan ke server... (Percobaan {retryCount}/3)
          </p>
        )}
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>
            <i className="fas fa-exclamation-triangle me-2"></i>
            Error
          </Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0">
              Untuk menjalankan JSON Server, gunakan perintah: 
              <code className="ms-2">npx json-server --watch db.json --port 3001</code>
            </p>
            <Button 
              variant="outline-danger" 
              onClick={loadInitialData}
              disabled={retryCount >= 3}
            >
              <i className="fas fa-sync-alt me-2"></i>
              Coba Lagi
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        {/* Category Filter Section - Left Sidebar */}
        <Col lg={2} className="border-end">
          <div className="sticky-top" style={{ top: '20px' }}>
            <h5 className="mb-3">
              <i className="fas fa-filter me-2"></i>
              Kategori
            </h5>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </Col>

        {/* Products Section - Middle */}
        <Col lg={7} className="px-4">
          <div className="mb-4">
            <h2>
              <i className="fas fa-store me-2"></i>
              Kasir App
            </h2>
            <p className="text-muted">Pilih produk dan tambahkan ke keranjang</p>
          </div>

          <Row>
            {products.length === 0 ? (
              <Col xs={12}>
                <Alert variant="info" className="text-center">
                  <i className="fas fa-info-circle me-2"></i>
                  Tidak ada produk yang tersedia untuk kategori ini.
                </Alert>
              </Col>
            ) : (
              products.map((product) => (
                <Col key={product.id} xs={12} sm={6} md={4} className="mb-4">
                  <ProductCard
                    product={product}
                    categoryName={getCategoryName(product.kategori)}
                    onAddToCart={handleAddToCart}
                  />
                </Col>
              ))
            )}
          </Row>
        </Col>

        {/* Cart Section - Right Sidebar */}
        <Col lg={3}>
          <div className="sticky-top" style={{ top: '20px' }}>
            <CartComponent
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onCheckout={handleCheckout}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default KasirPage;
