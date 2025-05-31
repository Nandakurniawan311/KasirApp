import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const NavbarComponent = () => {
     return (
          <Navbar expand="lg" variant="dark" bg="primary">
               <Container>
                    <Navbar.Brand as={Link} to="/">
                         <i className="fas fa-cash-register me-2"></i>
                         <strong>Kasir App</strong>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                         <Nav className="me-auto">
                              <Nav.Link as={Link} to="/">
                                   <i className="fas fa-home me-1"></i>
                                   Kasir
                              </Nav.Link>
                         </Nav>
                         <Nav>
                              <Nav.Link disabled className="text-light">
                                   <i className="fas fa-user me-1"></i>
                                   Admin
                              </Nav.Link>
                         </Nav>
                    </Navbar.Collapse>
               </Container>
          </Navbar>
     );
};
