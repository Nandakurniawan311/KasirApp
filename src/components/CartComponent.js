import React, { useState } from 'react';
import { Card, ListGroup, Button, Badge, Form, InputGroup, Modal } from 'react-bootstrap';
import { formatCurrency } from '../utils/api';
import swal from 'sweetalert';
import '@fortawesome/fontawesome-free/css/all.min.css';

const CartComponent = ({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart, 
  onCheckout 
}) => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState({});

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.harga * item.jumlah), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.jumlah, 0);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }
    onUpdateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    swal({
      title: "Hapus Item?",
      text: "Apakah Anda yakin ingin menghapus item ini dari keranjang?",
      icon: "warning",
      buttons: ["Batal", "Hapus"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        onRemoveItem(itemId);
        swal("Item berhasil dihapus!", {
          icon: "success",
        });
      }
    });
  };

  const handleClearCart = () => {
    swal({
      title: "Kosongkan Keranjang?",
      text: "Apakah Anda yakin ingin mengosongkan seluruh keranjang?",
      icon: "warning",
      buttons: ["Batal", "Kosongkan"],
      dangerMode: true,
    }).then((willClear) => {
      if (willClear) {
        onClearCart();
        swal("Keranjang berhasil dikosongkan!", {
          icon: "success",
        });
      }
    });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      swal("Keranjang Kosong!", "Silakan tambahkan produk ke keranjang terlebih dahulu.", "warning");
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleConfirmCheckout = () => {
    if (!customerName.trim()) {
      swal("Nama Pelanggan Diperlukan!", "Silakan masukkan nama pelanggan.", "warning");
      return;
    }

    const orderData = {
      customerName: customerName.trim(),
      notes: notes[cartItems[0].id] || '',
      items: cartItems.map(item => ({
        ...item,
        keterangan: notes[item.id] || ''
      })),
      totalItems: getTotalItems(),
      totalPrice: getTotalPrice(),
      timestamp: new Date().toISOString()
    };

    onCheckout(orderData);
    setShowCheckoutModal(false);
    setCustomerName('');
    setNotes({});
    
    swal("Checkout Berhasil!", `Pesanan atas nama ${customerName} telah diproses.`, "success");
  };

  const handleNoteChange = (itemId, note) => {
    setNotes(prev => ({
      ...prev,
      [itemId]: note
    }));
  };

  if (cartItems.length === 0) {
    return (
      <Card className="h-100">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">
            <i className="fas fa-shopping-cart me-2"></i>
            Keranjang Belanja
          </h5>
        </Card.Header>
        <Card.Body className="text-center py-5">
          <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
          <p className="text-muted">Keranjang belanja kosong</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card className="h-100">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="fas fa-shopping-cart me-2"></i>
            Keranjang Belanja
          </h5>
          <Badge bg="light" text="dark">
            {getTotalItems()} item
          </Badge>
        </Card.Header>
        
        <Card.Body className="p-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.id} className="p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.nama}</h6>
                    <small className="text-muted">{formatCurrency(item.harga)}</small>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </div>
                
                <div className="d-flex justify-content-between align-items-center">
                  <InputGroup size="sm" style={{ width: '120px' }}>
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleQuantityChange(item.id, item.jumlah - 1)}
                    >
                      <i className="fas fa-minus"></i>
                    </Button>
                    <Form.Control
                      type="number"
                      value={item.jumlah}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                      className="text-center"
                      min="1"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleQuantityChange(item.id, item.jumlah + 1)}
                    >
                      <i className="fas fa-plus"></i>
                    </Button>
                  </InputGroup>
                  
                  <strong className="text-success">
                    {formatCurrency(item.harga * item.jumlah)}
                  </strong>
                </div>
                
                <div className="mb-2">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Catatan untuk produk ini..."
                    value={notes[item.id] || ''}
                    onChange={(e) => handleNoteChange(item.id, e.target.value)}
                    className="mb-2"
                  />
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
        
        <Card.Footer>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <strong>Total:</strong>
            <strong className="text-success fs-5">
              {formatCurrency(getTotalPrice())}
            </strong>
          </div>
          
          <div className="d-grid gap-2">
            <Button variant="success" onClick={handleCheckout}>
              <i className="fas fa-credit-card me-2"></i>
              Checkout
            </Button>
            <Button variant="outline-danger" onClick={handleClearCart}>
              <i className="fas fa-trash me-2"></i>
              Kosongkan Keranjang
            </Button>
          </div>
        </Card.Footer>
      </Card>

      {/* Checkout Modal */}
      <Modal show={showCheckoutModal} onHide={() => setShowCheckoutModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-credit-card me-2"></i>
            Checkout Pesanan
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nama Pelanggan *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan nama pelanggan"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Catatan (Opsional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Catatan khusus untuk pesanan..."
                value={notes[cartItems[0].id] || ''}
                onChange={(e) => handleNoteChange(cartItems[0].id, e.target.value)}
              />
            </Form.Group>
            
            <div className="border rounded p-3 bg-light">
              <h6>Ringkasan Pesanan:</h6>
              <div className="d-flex justify-content-between">
                <span>Total Item:</span>
                <span>{getTotalItems()} item</span>
              </div>
              <div className="d-flex justify-content-between">
                <strong>Total Harga:</strong>
                <strong className="text-success">{formatCurrency(getTotalPrice())}</strong>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCheckoutModal(false)}>
            Batal
          </Button>
          <Button variant="success" onClick={handleConfirmCheckout}>
            <i className="fas fa-check me-2"></i>
            Konfirmasi Checkout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CartComponent;
