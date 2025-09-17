import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo 2.png";




export const Header = () => {
  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.clear()
    navigate('/login') // Redirect to login page after logout
  }
  return (
    <div>
      <Navbar bg="white" variant="light" expand="lg" fixed="top" collapseOnSelect className="shadow" >
        <Container>
          <Navbar.Brand as={Link} to="/" className="">
            <img
              src={logo}
              alt="Logo"
              className="navbar-logo img-fluid d-inline-block align-top"
            />

          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto bg-white fw-semibold gap-3 align-items-lg-center">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/packages">Trip Packages</Nav.Link>
              <NavDropdown title="Onboarding" id="onboarding-dropdown" className="px-lg-3">
                <NavDropdown.Item as={Link} to="/vehicle-onboarding">
                  Onboard Vehicle
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/driver-onboarding">
                  Onboard Driver
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} to="/aboutus">About us</Nav.Link>

              {
                sessionStorage.getItem("role") === "admin" ? (
                  <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                ) : null
              }

              <NavDropdown title="Contact Us" id="contact" className="px-lg-3">
                <NavDropdown.Item as={Link} to="mailto:email.gmail.com">
                  email@gmail.com
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="">
                  Call : 7889654123
                </NavDropdown.Item>
              </NavDropdown>

              {
                sessionStorage.getItem("token") ?
                  <Nav.Link onClick={logout} as={Link} to="/login">Logout</Nav.Link>
                  :
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

export default Header
