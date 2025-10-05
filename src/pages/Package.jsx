import React, { useState, useEffect } from "react";
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

  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    passengers: "",
    specialRequests: "",
  });

  const [message, setMessage] = useState(null); // ✅ For validation alerts

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
    setMessage(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Validation logic
  const validateBookingForm = () => {
    const { name, email, phone, date, time, passengers } = bookingForm;

    if (!name.trim() || name.trim().length < 5)
      return "❌ Full name must be at least 5 characters long.";

    if (!/^[a-zA-Z\s]+$/.test(name))
      return "❌ Name should contain only letters and spaces.";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "❌ Please enter a valid email address.";

    if (!/^[0-9]{10}$/.test(phone))
      return "❌ Please enter a valid 10-digit phone number.";

    const today = new Date();
    const selectedDate = new Date(date);
    if (!date || selectedDate < today.setHours(0, 0, 0, 0))
      return "❌ Please select a valid travel date (today or later).";

    if (!time) return "❌ Please select a travel time.";

    if (!passengers || Number(passengers) <= 0)
      return "❌ Please select the number of passengers.";

    return null;
  };

  // ✅ Handle booking form submit
  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token");
    if (!token) {
      setMessage({ type: "danger", text: "❌ Please login to book a package." });
      return;
    }

    const validationError = validateBookingForm();
    if (validationError) {
      setMessage({ type: "danger", text: validationError });
      return;
    }

    setSubmitting(true);

    try {
      const bookingData = {
        ...bookingForm,
        packageId: selectedPackage._id,
        packageName: selectedPackage.name,
        packagePrice: selectedPackage.price,
      };

      const response = await axios.post(`${SERVER_URL}/trips`, bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setMessage({ type: "success", text: "✅ Booking submitted successfully!" });
        setTimeout(() => {
          handleCloseModal();
          fetchTrips();
        }, 2000);
      } else {
        setMessage({
          type: "danger",
          text: response.data.message || "❌ Booking failed. Please try again.",
        });
      }
    } catch (err) {
      console.error("Error submitting booking:", err);
      setMessage({
        type: "danger",
        text: "❌ Error submitting booking. Please try again after logging in.",
      });
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
                  height: "450px",
                  backgroundImage: `url(${SERVER_URL}/uploads/${pkg.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "12px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0, 0, 0, 0.4)",
                  }}
                />
                <Card.Body className="position-relative">
                  <Card.Title className="fw-bold fs-3">
                    {pkg.name}
                    <p style={{ marginTop: "5px", fontSize: "25px" }}>
                      ({pkg.city} to {pkg.destination})
                    </p>
                  </Card.Title>
                  <Card.Text>{pkg.description}</Card.Text>
                  <p>
                    <strong>Duration:</strong> {pkg.duration}
                  </p>
                  <p>
                    <strong>Month:</strong> {pkg.month}
                  </p>
                  <p>
                    <strong>Cab Type:</strong> {pkg.cabtype}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{pkg.price} Per Person
                  </p>
                  <Button variant="light" onClick={() => handleBookNow(pkg)}>
                    Book Package
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* ✅ Booking Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Book Package: {selectedPackage?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* ✅ Validation Message */}
          {message && (
            <Alert
              variant={message.type}
              onClose={() => setMessage(null)}
              dismissible
            >
              {message.text}
            </Alert>
          )}

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
                    min={new Date().toISOString().split("T")[0]}
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
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Number of Passengers *</Form.Label>
                  <Form.Select
                    name="passengers"
                    value={bookingForm.passengers}
                    onChange={handleFormChange}
                  >
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Passenger" : "Passengers"}
                      </option>
                    ))}
                  </Form.Select>
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
                placeholder="Any special requests or notes..."
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Booking"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* ✅ User Trips */}
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
                        className={`badge ${
                          trip.status === "confirmed"
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
