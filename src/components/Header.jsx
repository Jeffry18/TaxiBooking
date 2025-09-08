import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";



export const Header = () => {
  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.clear()
    navigate('/login') // Redirect to login page after logout
  }
  return (
    <div>
      <Navbar bg="" variant="primary" expand="lg" className="mt-3 ms-1 me-1 flex-column shadow" style={{ minHeight: "120px" }}>
        <Container className="d-flex flex-column align-items-center ">
          <Navbar.Brand as={Link} to="/" className="fw-bold  mb-2 mt-3 text-center" style={{fontFamily:"fantasy" , fontSize:"50px"}}><i className="fa-solid fa-taxi me-2"></i>TAXI BOOKING</Navbar.Brand>
          <Nav className="d-flex justify-content-center flex-wrap fw-semibold gap-3 mt-3 mb-3">
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
