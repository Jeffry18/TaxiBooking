import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Table, Spinner, Row, Col, Card } from "react-bootstrap";
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

  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    passengers: "",
    pickupLocation: "",
    dropLocation: "",
    specialRequests: "",
  });

  // ✅ Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${SERVER_URL}/packages`);
        console.log("Packages data received:", res.data); // Debug: log the response

        if (Array.isArray(res.data)) {
          setPackages(res.data);
          setError(null);
        } else {
          setPackages([]);
          setError("Invalid data received from server");
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
      console.log("Trips data response:", res.data); // Debug: log the response
    if (res.data.success && Array.isArray(res.data.data)) {
      setTrips(res.data.data);
            console.log("Trips data received:", res.data.data); // Debug: log the response

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


  useEffect(() => {
    fetchTrips();
  }, []);

  // ✅ Open booking modal
  const handleBookNow = (pkg) => {
    setSelectedPackage(pkg);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPackage(null);
    setBookingForm({
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      passengers: "",
      specialRequests: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };


  // ✅ Handle booking form submit
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = sessionStorage.getItem("token");
      console.log("Token for booking submission:", token); // Debug: log the token
      

      const bookingData = {
        ...bookingForm,
        packageId: selectedPackage._id,
        packageName: selectedPackage.name,
        packagePrice: selectedPackage.price,
      };

      const response = await axios.post(`${SERVER_URL}/trips`, bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Booking response:", response.data);

      if (response.data.success) {
        alert("Booking submitted successfully! We'll contact you soon.");
        handleCloseModal();
        fetchTrips(); // ✅ refresh only user's trips
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting booking:", err);
      alert("Error submitting booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="container py-4" style={{ marginTop: "100px" }}>
      <h2 className="mb-4">Trip Packages</h2>

      {/* ✅ Show Packages */}
      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <Row>
          {packages.map((pkg) => (
            <Col md={12} key={pkg._id} className="mb-3">
              <Card
                className="shadow text-white w-100"
                style={{
                  height: "450px", // adjust height as needed
                  backgroundImage: `url(${SERVER_URL}/uploads/${pkg.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "12px",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* Dark overlay for readability */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0, 0, 0, 0.4)"
                  }}
                />

                {/* Card Content */}
                <Card.Body className="position-relative">
                  <Card.Title className="fw-bold fs-3">{pkg.name} 
                    <span>
                      <p style={{marginTop:"5px", fontSize:"25px"}}>({pkg.city} to {pkg.destination})</p>
                    </span>
                  </Card.Title>
                  <Card.Text>{pkg.description}</Card.Text>
                  <p><strong><i className="fas fa-clock"></i> Duration:</strong> {pkg.duration}</p>
                  <p><strong><i className="fas fa-calendar-alt"></i> Month:</strong> {pkg.month}</p>
                  <p><strong><i className="fas fa-car"></i> Cab Type:</strong> {pkg.cabtype}</p>
                  <p><strong><i className="fas fa-rupee-sign"></i> :</strong> ₹{pkg.price} Per Person</p>
                  <Button variant="light" onClick={() => handleBookNow(pkg)}>
                    Book Package
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

      )}

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Book Package: {selectedPackage?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitBooking}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={bookingForm.name}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter your full name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={bookingForm.email}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter your email"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={bookingForm.phone}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter your phone number"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Travel Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={bookingForm.date}
                    onChange={handleFormChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Travel Time *</Form.Label>
                  <Form.Control
                    type="time"
                    name="time"
                    value={bookingForm.time}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Number of Passengers *</Form.Label>
                  <Form.Control
                    as="select"
                    name="passengers"
                    value={bookingForm.passengers}
                    onChange={handleFormChange}
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            

            <Form.Group className="mb-3">
              <Form.Label>Special Requests</Form.Label>
              <Form.Control
                as="textarea"
                name="specialRequests"
                value={bookingForm.specialRequests}
                onChange={handleFormChange}
                rows={3}
                placeholder="Any special requests or additional information..."
              />
            </Form.Group>

            {selectedPackage && (
              <div className="bg-light p-3 rounded mb-3">
                <h6>Package Details:</h6>
                <p className="mb-1"><strong>Name:</strong> {selectedPackage.name}</p>
                <p className="mb-1"><strong>Duration:</strong> {selectedPackage.duration}</p>
                <p className="mb-1"><strong>Price:</strong> ₹{selectedPackage.price}</p>
                <p className="mb-0"><strong>Description:</strong> {selectedPackage.description}</p>
              </div>
            )}

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Enquiry"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* ✅ User Trips Table */}
      <div className="mt-5">
        <h3>Your Bookings</h3>
        {sessionStorage.getItem("token") ? (
          bookingsLoading ? (
            <Spinner animation="border" />
          ) : bookingsError ? (
            <p className="text-danger">{bookingsError}</p>
          ) : trips.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Passengers</th>
                
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <tr key={trip._id}>
                    <td>{trip.packageName}</td>
                    <td>{new Date(trip.date).toLocaleDateString()}</td>
                    <td>{trip.time}</td>
                    <td>{trip.passengers}</td>
                    
                    <td>₹{trip.packagePrice}</td>
                    <td>
                      <span
                        className={`badge ${trip.status === "confirmed"
                          ? "bg-success"
                          : trip.status === "pending"
                            ? "bg-warning"
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
          )
        ) : (
          <p className="text-muted">Please login to view your bookings.</p>
        )}
      </div>
    </div>
  );
};

export default Packages;
