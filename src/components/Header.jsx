import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";



export const Header = () => {
  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.clear()
    navigate('/login') // Redirect to login page after logout
  }
  return (
    <div>
      <Navbar bg="white" variant="primary" expand="lg" fixed="top" className=" shadow " style={{ minHeight: "20px" , maxHeight:"70px" }}>
        <Container className=" ">
          <Navbar.Brand as={Link} to="/" className="fw-bold    " style={{ fontFamily: "fantasy", fontSize: "50px" }}>
            <img
              src={logo}
              alt="Logo"
              style={{ height: "60px", width: "250px" }}
            />
          </Navbar.Brand>
          <Nav className=" fw-semibold gap-3  ">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/packages">Trip Packages</Nav.Link>
            <NavDropdown title="Onboarding" id="onboarding-dropdown" className="px-3">
              <NavDropdown.Item as={Link} to="/vehicle-onboarding">
                Onboard Vehicle
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/driver-onboarding">
                Onboard Driver
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/aboutus">About us</Nav.Link>
            <NavDropdown title="Contact Us" id="contact" className="px-3">
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
        </Container>
      </Navbar>
    </div>
  )
}

export default Header
