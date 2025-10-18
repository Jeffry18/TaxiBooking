import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Modal,
  Button,
  Form,
  Table,
  Spinner,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";
import SERVER_URL from "../services/serverURL";

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [trips, setTrips] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [searchTerm, setSearchTerm] = useState(""); // ✅ Search state
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${SERVER_URL}/packages`);
        if (Array.isArray(res.data)) {
          setPackages(res.data);
          setError(null);
        } else {
          setError("Invalid data received from server");
          setPackages([]);
        }
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError("Failed to load packages. Please try again later.");
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // ✅ Fetch trips of logged-in user
  const fetchTrips = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setTrips([]);
      setBookingsError("Please login to view your bookings.");
      setBookingsLoading(false);
      return;
    }

    try {
      setBookingsLoading(true);
      const res = await axios.get(`${SERVER_URL}/trips`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success && Array.isArray(res.data.data)) {
        setTrips(res.data.data);
        setBookingsError(null);
      } else {
        setTrips([]);
        setBookingsError("Failed to load bookings. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching trips:", err);
      setTrips([]);
      setBookingsError("Failed to load bookings. Please try again.");
    } finally {
      setBookingsLoading(false);
    }
  };

  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992); // lg breakpoint = 992px

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchTrips();
  }, []);

  // ✅ Open booking modal
  const handleBookNow = (pkg) => {
    setSelectedPackage(pkg);
    setShowModal(true);
  };

  // ✅ Filtered packages based on search
  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-4" style={{ marginTop: "100px" }}>
      <div className="text-center mb-5">
        <h2 className="display-6 fw-bold text-primary mb-2">Travel Packages</h2>
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-center justify-content-lg-between mb-4 w-100">
          {/* Paragraph text */}
          <p className="lead text-muted text-center text-lg-center mb-2  mb-lg-0 flex-grow-1" style={{marginLeft: isLargeScreen ? "19rem" : "0"}}>
            Discover amazing destinations with our curated travel packages
          </p>

          {/* Search bar */}
          <div className="mt-2 mt-lg-0" style={{ maxWidth: "300px", width: "100%" }}>
            <Form.Control
              type="text"
              placeholder="Search packages by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>


      </div>



      {/* ✅ Show Packages */}
      {loading ? (
        <Row className="g-4">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <Col lg={4} md={6} sm={12} key={index}>
              <Card className="h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                <div
                  style={{ height: "200px", backgroundColor: "#e9ecef" }}
                  className="d-flex align-items-center justify-content-center"
                >
                  <Spinner animation="border" variant="primary" size="sm" />
                </div>
                <Card.Body className="p-3">
                  <div className="placeholder-glow">
                    <span className="placeholder col-8 mb-2"></span>
                    <span className="placeholder col-6 mb-2"></span>
                    <span className="placeholder col-12 mb-3"></span>
                    <span className="placeholder col-4"></span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : filteredPackages.length === 0 ? (
        <Alert variant="info" className="text-center">
          No packages found for "{searchTerm}"
        </Alert>
      ) : (
        <Row className="g-4">
          {filteredPackages.map((pkg) => (
            <Col lg={4} md={6} sm={12} key={pkg._id}>
              <Card
                className="h-100 package-card rounded-3 overflow-hidden"
                onClick={() =>
                  navigate("/package-extend", { state: { packageData: pkg } })
                }
                style={{ cursor: "pointer" }}
              >
                {/* Image Section */}
                <div
                  style={{
                    height: "200px",
                    backgroundImage: pkg.image
                      ? `url(${SERVER_URL}/uploads/${pkg.image})`
                      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {!pkg.image && (
                    <i
                      className="bi bi-geo-alt text-white"
                      style={{ fontSize: "3rem", opacity: 0.7 }}
                    ></i>
                  )}
                  <div className="package-image-overlay"></div>
                  <div
                    className="position-absolute top-0 end-0 m-2 price-badge"
                    style={{
                      background: "rgba(0, 0, 0, 0.8)",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: "600",
                      zIndex: 2,
                    }}
                  >
                    ₹{pkg.price}
                  </div>
                </div>

                {/* Content Section */}
                <Card.Body className="p-3">
                  <Card.Title className="h5 mb-2 text-truncate">{pkg.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted small">
                    {pkg.city} → {pkg.destination}
                  </Card.Subtitle>
                  <Card.Text className="small text-muted mb-3 package-description">
                    {pkg.description}
                  </Card.Text>

                  {/* Package Details */}
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-clock me-1 text-primary"></i>
                        <small className="text-muted">{pkg.duration}</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-calendar me-1 text-primary"></i>
                        <small className="text-muted">{pkg.month}</small>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-car-front me-1 text-primary"></i>
                        <small className="text-muted">{pkg.cabtype}</small>
                      </div>
                    </div>
                  </div>

                  {/* Price and Book Button */}
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="h6 text-primary mb-0">₹{pkg.price}</span>
                      <small className="text-muted d-block">Per Day Onwards</small>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleBookNow(pkg)}
                      className="px-3"
                    >
                      Book Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* ✅ User Trips */}
      <div className="mt-5">
        <div className="d-flex align-items-center mb-4">
          <i className="bi bi-calendar-check me-2 text-primary"></i>
          <h4 className="mb-0">Your Enquires</h4>
        </div>
        {sessionStorage.getItem("token") ? (
          bookingsLoading ? (
            <Spinner animation="border" />
          ) : bookingsError ? (
            <p className="text-danger">{bookingsError}</p>
          ) : trips.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="d-none d-md-block">
                <Table
                  striped
                  bordered
                  hover
                  responsive
                  className="bg-white rounded shadow-sm"
                >
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0">
                        <i className="bi bi-box me-1"></i>Package
                      </th>
                      <th className="border-0">
                        <i className="bi bi-calendar me-1"></i>Date
                      </th>
                      <th className="border-0">
                        <i className="bi bi-clock me-1"></i>Time
                      </th>
                      <th className="border-0">
                        <i className="bi bi-people me-1"></i>Passengers
                      </th>
                      <th className="border-0">
                        <i className="bi bi-currency-rupee me-1"></i>Price
                      </th>
                      <th className="border-0">
                        <i className="bi bi-check-circle me-1"></i>Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {trips.map((trip) => (
                      <tr key={trip._id}>
                        <td className="fw-medium">{trip.packageName}</td>
                        <td>{new Date(trip.date).toLocaleDateString()}</td>
                        <td>{trip.time}</td>
                        <td>{trip.passengers}</td>
                        <td className="fw-bold text-primary">₹{trip.packagePrice}</td>
                        <td>
                          <span
                            className={`badge ${trip.status === "confirmed"
                              ? "bg-success"
                              : trip.status === "pending"
                                ? "bg-warning text-dark"
                                : "bg-danger"
                              }`}
                          >
                            {trip.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="d-md-none">
                <Row className="g-3">
                  {trips.map((trip) => (
                    <Col xs={12} key={trip._id}>
                      <Card className="shadow-sm border-0">
                        <Card.Body className="p-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="mb-0 text-primary">{trip.packageName}</h6>
                            <span
                              className={`badge ${trip.status === "confirmed"
                                ? "bg-success"
                                : trip.status === "pending"
                                  ? "bg-warning text-dark"
                                  : "bg-danger"
                                }`}
                            >
                              {trip.status}
                            </span>
                          </div>
                          <div className="row g-2 text-sm">
                            <div className="col-6">
                              <i className="bi bi-calendar me-1 text-muted"></i>
                              <small>{new Date(trip.date).toLocaleDateString()}</small>
                            </div>
                            <div className="col-6">
                              <i className="bi bi-clock me-1 text-muted"></i>
                              <small>{trip.time}</small>
                            </div>
                            <div className="col-6">
                              <i className="bi bi-people me-1 text-muted"></i>
                              <small>{trip.passengers} passengers</small>
                            </div>
                            <div className="col-6">
                              <i className="bi bi-currency-rupee me-1 text-muted"></i>
                              <span className="fw-bold text-primary">
                                ₹{trip.packagePrice}
                              </span>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </>
          )
        ) : (
          <p className="text-muted">Please login to view your bookings.</p>
        )}
      </div>
    </div>
  );
};

export default Packages;
