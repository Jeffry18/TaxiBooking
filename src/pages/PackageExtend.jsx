import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Button, Modal, Form, Row, Col, Alert } from "react-bootstrap";
import SERVER_URL from "../services/serverURL";

const PackageExtend = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { packageData } = location.state || {};

  // ---------------------- Booking Modal State ----------------------
  const [showModal, setShowModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    passengers: "",
    specialRequests: "",
  });
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!packageData) {
    return (
      <div className="container text-center py-5">
        <h4>No package selected</h4>
        <Button variant="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  // ---------------------- Handlers ----------------------
  const handleBookNow = () => setShowModal(true);

  const handleCloseModal = () => {
    setShowModal(false);
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
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

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

    if (!time) 
      return "❌ Please select a travel time.";

    if (!passengers || Number(passengers) <= 0) 
      return "❌ Please select the number of passengers.";

    return null;
  };

  const handleSubmitBooking = async (e) => {
  e.preventDefault();

  const validationError = validateBookingForm();
  if (validationError) {
    setMessage({ type: "danger", text: validationError });
    return;
  }

  setSubmitting(true);
  try {
    const bookingData = {
      ...bookingForm,
      packageId: packageData._id,
      packageName: packageData.name,
      packagePrice: packageData.price,
      packageDestination: packageData.destination,
    };

    const response = await axios.post(`${SERVER_URL}/trips`, bookingData, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.data.success) {
      setMessage({ type: "success", text: "✅ Booking submitted successfully!" });
      setTimeout(() => handleCloseModal(), 2000);
    } else {
      setMessage({ type: "danger", text: response.data.message || "❌ Booking failed. Please try again." });
    }
  } catch (err) {
    console.error(err);
    setMessage({ type: "danger", text: "❌ Error submitting booking. Please try again." });
  } finally {
    setSubmitting(false);
  }
};


  // ---------------------- JSX ----------------------
  return (
    <div className="container py-5" style={{ marginTop: "100px" }}>
      <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
        <div
          style={{
            height: "300px",
            backgroundImage: packageData.image
              ? `url(${SERVER_URL}/uploads/${packageData.image})`
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <Card.Body className="p-4">
          <h2 className="fw-bold mb-2 text-primary">{packageData.name}</h2>
          <h5 className="text-muted mb-3">{packageData.city} → {packageData.destination}</h5>
          <p className="text-secondary mb-4">{packageData.description}</p>
          <div className="mb-3">
            <p><strong>Duration:</strong> {packageData.duration}</p>
            <p><strong>Best Month:</strong> {packageData.month}</p>
            <p><strong>Cab Type:</strong> {packageData.cabtype}</p>
            <p><strong>Price:</strong> ₹{packageData.price} Per Day Onwards</p>
          </div>
          <Button variant="secondary" onClick={() => navigate(-1)} className="me-2">
            Go Back
          </Button>
          <Button variant="primary" onClick={handleBookNow}>
            Book Now
          </Button>
        </Card.Body>
      </Card>

      {/* Booking Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Book Package: {packageData.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message && <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>{message.text}</Alert>}
          <Form onSubmit={handleSubmitBooking}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control type="text" name="name" value={bookingForm.name} onChange={handleFormChange} placeholder="Enter your full name" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control type="email" name="email" value={bookingForm.email} onChange={handleFormChange} placeholder="Enter your email" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number *</Form.Label>
                  <Form.Control type="tel" name="phone" value={bookingForm.phone} onChange={handleFormChange} placeholder="Enter your phone number" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Travel Date *</Form.Label>
                  <Form.Control type="date" name="date" value={bookingForm.date} onChange={handleFormChange} min={new Date().toISOString().split("T")[0]} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Travel Time *</Form.Label>
                  <Form.Control type="time" name="time" value={bookingForm.time} onChange={handleFormChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Number of Passengers *</Form.Label>
                  <Form.Control type="number" name="passengers" value={bookingForm.passengers} onChange={handleFormChange} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Special Requests</Form.Label>
              <Form.Control as="textarea" name="specialRequests" value={bookingForm.specialRequests} onChange={handleFormChange} rows={3} placeholder="Any special requests or notes..." />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit Booking"}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PackageExtend;
