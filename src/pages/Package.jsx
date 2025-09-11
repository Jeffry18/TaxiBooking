import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Button, Row, Col, Alert, Modal, Form, Table, Spinner } from "react-bootstrap";
import SERVER_URL from "../services/serverURL";

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState(null);
  const [myTrips, setMyTrips] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    passengers: 1,
    pickupLocation: "",
    dropLocation: "",
    specialRequests: ""
  });

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

  useEffect(() => {
    const fetchMyTrips = async () => {
      try {
        setBookingsLoading(true);
        setBookingsError(null);
        const res = await axios.get(`${SERVER_URL}/trips`);
        const list = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
            ? res.data
            : [];

        const email = sessionStorage.getItem('email');
        const phone = sessionStorage.getItem('phone');

        const filtered = email
          ? list.filter(t => (t.email || '').toLowerCase() === email.toLowerCase())
          : phone
            ? list.filter(t => (t.phone || '') === phone)
            : list;

        // newest first
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setMyTrips(filtered);
      } catch (err) {
        console.error('Error fetching user trips:', err);
        setBookingsError('Failed to load your package bookings.');
        setMyTrips([]);
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchMyTrips();
  }, []);

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
      passengers: 1,
      pickupLocation: "",
      dropLocation: "",
      specialRequests: ""
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Convert date string to Date object for backend
      const bookingData = {
        ...bookingForm,
        date: new Date(bookingForm.date),
        packageId: selectedPackage._id,
        packageName: selectedPackage.name,
        packagePrice: selectedPackage.price
      };

      // Send booking data to the server
      const response = await axios.post(`${SERVER_URL}/trips`, bookingData);

      if (response.data.success) {
        alert("Booking submitted successfully! We'll contact you soon.");
        console.log("Trip booking created:", response.data.data);
        handleCloseModal();
      } else {
        alert("Failed to submit booking. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting booking:", err);
      const errorMessage = err.response?.data?.message || "Failed to submit booking. Please try again.";
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="" style={{ marginTop: "90px" }}>
      <h3 className="mb-3">Trip Packages</h3>

      {loading && (
        <Alert variant="info">Loading packages...</Alert>
      )}

      {error && (
        <Alert variant="danger">{error}</Alert>
      )}

      {!loading && !error && packages.length === 0 && (
        <Alert variant="warning">No packages available.</Alert>
      )}

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
                <Card.Title className="fw-bold fs-3">{pkg.name}</Card.Title>
                <Card.Text>{pkg.description}</Card.Text>
                <p><strong>Duration:</strong> {pkg.duration}</p>
                <p><strong>Price Per Person:</strong> ₹{pkg.price}</p>
                <Button variant="light" onClick={() => handleBookNow(pkg)}>
                  Book Package
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>



      {/* My Booked Packages */}
      <div className="mt-4">
        <h4 className="mb-3">My Package Bookings</h4>
        {bookingsLoading && <Spinner animation="border" variant="primary" />}
        {bookingsError && <Alert variant="danger">{bookingsError}</Alert>}
        {!bookingsLoading && !bookingsError && myTrips.length === 0 && (
          <Alert variant="info">You have not booked any packages yet.</Alert>
        )}
        {!bookingsLoading && !bookingsError && myTrips.length > 0 && (
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Package</th>
                <th>Travel Date</th>
                <th>Time</th>
                <th>Passengers</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
                <th>Price Per Person</th>
              </tr>
            </thead>
            <tbody>
              {myTrips.map(t => (
                <tr key={t._id}>
                  <td>{t.packageName || t.packageId?.name}</td>
                  <td>{t.date ? new Date(t.date).toLocaleDateString() : '-'}</td>
                  <td>{t.time}</td>
                  <td>{t.passengers}</td>
                  <td>{t.pickupLocation}</td>
                  <td>{t.dropLocation}</td>
                  <td>
                    <span className={`badge ${t.status === 'confirmed' ? 'bg-success' : t.status === 'pending' ? 'bg-warning text-dark' : t.status === 'cancelled' ? 'bg-danger' : 'bg-secondary'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>₹{t.packagePrice || t.packageId?.price}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* Booking Modal */}
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

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pickup Location *</Form.Label>
                  <Form.Control
                    type="text"
                    name="pickupLocation"
                    value={bookingForm.pickupLocation}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter pickup location"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Drop Location *</Form.Label>
                  <Form.Control
                    type="text"
                    name="dropLocation"
                    value={bookingForm.dropLocation}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter drop location"
                  />
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
                {submitting ? "Submitting..." : "Submit Booking"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
