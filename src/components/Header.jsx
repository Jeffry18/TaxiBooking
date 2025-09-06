import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";



export const Header = () => {
 const navigate = useNavigate();
  const logout = () => {
    sessionStorage.clear()
    navigate('/login') // Redirect to login page after logout
  }
  return (
    <div>
        <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">🚖 TaxiBooking</Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/packages">Trip Packages</Nav.Link>
          <Nav.Link as={Link} to="/vehicle-onboarding">Onboard Vehicle</Nav.Link>
          <Nav.Link as={Link} to="/driver-onboarding">Onboard Driver</Nav.Link>
          
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
