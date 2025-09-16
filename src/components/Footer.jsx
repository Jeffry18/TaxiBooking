import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="footer bg-light mt-5 shadow">
      <div className="container py-5">
        <div className="row gy-4">
          {/* intro */}
          <div className="col-12 col-md-6 col-lg-3">
            <h5>
              <i className="fa-solid fa-taxi"></i> Taxi Booking
            </h5>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Necessitatibus perspiciatis consequatur doloribus dolores, quae
              recusandae quos ipsam repellat facere odio.
            </p>
            <p>Lorem ipsum dolor sit amet</p>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>

          {/* links */}
          <div className="col-6 col-md-3 col-lg-2">
            <h5>Links</h5>
            <Link to="/" className="text-decoration-none text-dark d-block">
              Home Page
            </Link>
            <Link
              to="/login"
              className="text-decoration-none text-dark d-block"
            >
              Login Page
            </Link>
            <Link
              to="/register"
              className="text-decoration-none text-dark d-block"
            >
              Register Page
            </Link>
          </div>

          {/* guides */}
          <div className="col-6 col-md-3 col-lg-2">
            <h5>Guides</h5>
            <a
              href="https://react.dev/"
              target="_blank"
              rel="noreferrer"
              className="text-decoration-none text-dark d-block"
            >
              React
            </a>
            <a
              href="https://react-bootstrap.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="text-decoration-none text-dark d-block"
            >
              React Bootstrap
            </a>
            <a
              href="https://www.npmjs.com/package/react-router-dom"
              target="_blank"
              rel="noreferrer"
              className="text-decoration-none text-dark d-block"
            >
              React Router
            </a>
          </div>

          {/* contact */}
          <div className="col-12 col-md-6 col-lg-5">
            <h5>Contacts</h5>
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
