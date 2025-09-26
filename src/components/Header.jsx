import React, { useState, useEffect, useRef } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo 2.png";




export const Header = () => {
  const navigate = useNavigate();
  const [showOnboardingDropdown, setShowOnboardingDropdown] = useState(false);
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  
  // Create refs to track dropdown containers
  const onboardingDropdownRef = useRef(null);
  const contactDropdownRef = useRef(null);
  
  // Add click outside event listener
  useEffect(() => {
    function handleClickOutside(event) {
      // Close Onboarding dropdown if click is outside
      if (onboardingDropdownRef.current && 
          !onboardingDropdownRef.current.contains(event.target)) {
        setShowOnboardingDropdown(false);
      }
      
      // Close Contact dropdown if click is outside
      if (contactDropdownRef.current && 
          !contactDropdownRef.current.contains(event.target)) {
        setShowContactDropdown(false);
      }
    }
    
    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const toggleOnboardingDropdown = () => {
    setShowOnboardingDropdown(!showOnboardingDropdown);
    if (showContactDropdown) setShowContactDropdown(false);
  };
  
  const toggleContactDropdown = () => {
    setShowContactDropdown(!showContactDropdown);
    if (showOnboardingDropdown) setShowOnboardingDropdown(false);
  };
  
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
              <Nav.Link as={Link} to="/tariffs">Tariffs</Nav.Link>
              
              {/* Custom Onboarding Dropdown */}
              <div className="custom-dropdown" ref={onboardingDropdownRef}>
                <Nav.Link onClick={toggleOnboardingDropdown} className="dropdown-toggle px-lg-3">
                  Onboarding
                </Nav.Link>
                {showOnboardingDropdown && (
                  <div className="custom-dropdown-menu">
                    <Link to="/vehicle-onboarding" className="custom-dropdown-item" 
                          onClick={() => setShowOnboardingDropdown(false)}>
                      Onboard Vehicle
                    </Link>
                    <Link to="/driver-onboarding" className="custom-dropdown-item"
                          onClick={() => setShowOnboardingDropdown(false)}>
                      Onboard Driver
                    </Link>
                  </div>
                )}
              </div>
              
              <Nav.Link as={Link} to="/aboutus">About us</Nav.Link>

              {
                sessionStorage.getItem("role") === "admin" ? (
                  <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                ) : null
              }
              
              {/* Custom Contact Us Dropdown */}
              <div className="custom-dropdown" ref={contactDropdownRef}>
                <Nav.Link onClick={toggleContactDropdown} className="dropdown-toggle px-lg-3">
                  Contact Us
                </Nav.Link>
                {showContactDropdown && (
                  <div className="custom-dropdown-menu">
                    <a href="mailto:email.gmail.com" className="custom-dropdown-item"
                       onClick={() => setShowContactDropdown(false)}>
                      email@gmail.com
                    </a>
                    <a href="tel:7889654123" className="custom-dropdown-item"
                       onClick={() => setShowContactDropdown(false)}>
                      Call: 7889654123
                    </a>
                  </div>
                )}
              </div>

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
