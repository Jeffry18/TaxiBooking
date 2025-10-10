import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo 2.png";


export const Footer = () => {
  return (
    <footer className="footer bg-light mt-5 shadow">
      <div className="container py-5">
        <div className="row gy-4">
          {/* intro */}
          <div className="col-12 col-md-6 col-lg-3">
          <img
              src={logo}
              alt="Logo"
              className="navbar-logo img-fluid d-inline-block align-top"
            />
            <p>
            Your trusted taxi partner for 17 years. Ministry of Tourism accredited tour operator providing reliable and safe transportation services across God's Own Country.
            </p>
            
          </div>

          {/* links */}
          <div className="col-6 col-md-3 col-lg-2">
            <h5 className="mb-4 mt-3">Quick Links</h5>
            <Link to="/" className="text-decoration-none text-dark d-block mb-2">
              Home Page
            </Link>
            <Link
              to="/login"
              className="text-decoration-none text-dark d-block mb-2"
            >
              Login Page
            </Link>
            <Link
              to="/register"
              className="text-decoration-none text-dark d-block mb-2"
            >
              Register Page
            </Link>
            <Link
              to="/aboutus"
              className="text-decoration-none text-dark d-block mb-2"
            >
              About Us
            </Link>
            <Link
              to="/tariffs"
              className="text-decoration-none text-dark d-block mb-2"
            >
              Tariff
            </Link>
            <Link
              to="/packages"
              className="text-decoration-none text-dark d-block mb-2"
            >
              Trip Packages
            </Link>
          </div>

          {/* services */}
          <div className="col-6 col-md-3 col-lg-2">
            <h5 className="mt-3 mb-4">OUR SERVICES</h5>
            <a
              href="/packages"
              
              rel="noreferrer"
              className="text-decoration-none text-dark d-block mb-2"
            >
              Weekend Trips
            </a>
            <a
              href="/packages"
              
              rel="noreferrer"
              className="text-decoration-none text-dark d-block mb-2"
            >
              Airport Transfers
            </a>
            <a
              href="/packages"
              
              rel="noreferrer"
              className="text-decoration-none text-dark d-block mb-2"
            >
              Group Travel
            </a>
            <a
              href="/packages"
              
              rel="noreferrer"
              className="text-decoration-none text-dark d-block mb-2"
            >
              Corporate Travels
            </a>
            <a
              href="/packages"
              
              rel="noreferrer"
              className="text-decoration-none text-dark d-block mb-2"
            >
              South India Packages
            </a>
            <a
              href="/packages"
              
              rel="noreferrer"
              className="text-decoration-none text-dark d-block mb-2"
            >
              Weddings & Events Transport
            </a>
          </div>

          {/* contact */}
          <div className="col-12 col-md-6 col-lg-5">
            <h5 className="mt-3 mb-4">Contacts</h5>
            <div className="d-flex flex-column flex-sm-row">

              <input
                type="text"
                placeholder="Enter Your Email Here.."
                className="form-control me-sm-2 mb-2 mb-sm-0"
              />
              <button className="btn btn-info">
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
            <div className="d-flex justify-content-center justify-content-md-start gap-3 mt-3">
              <a href="https://x.com/" target="_blank" rel="noreferrer">
                <i className="fa-brands fa-twitter fs-5"></i>
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                <i className="fa-brands fa-instagram fs-5"></i>
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
                <i className="fa-brands fa-facebook fs-5"></i>
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
                <i className="fa-brands fa-linkedin fs-5"></i>
              </a>
              <a href="https://github.com/login" target="_blank" rel="noreferrer">
                <i className="fa-brands fa-github fs-5"></i>
              </a>
              <a
                href="https://www.freeconferencecallhd.com/dialer"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-solid fa-phone fs-5"></i>
              </a>
            </div>
          </div>
        </div>

        <p className="text-center mt-4 mb-0">
          Copyright &copy; Taxi Booking | Built with React.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
