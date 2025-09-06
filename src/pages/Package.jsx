import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Button, Row, Col, Alert, Modal, Form } from "react-bootstrap";
import SERVER_URL from "../services/serverURL";

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    <Container className="mt-4">
      <h3>Trip Packages</h3>

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
          <Col md={4} key={pkg._id} className="mb-3">
                         <Card className="shadow">
               {pkg.image && (
                <Card.Img 
                  variant="top" 
                  src={`${SERVER_URL}/uploads/${pkg.image}`} 
                  alt={pkg.name}
                  style={{ height: "200px", objectFit: "cover" }}
                  onError={(e) => {
                    console.error(`Failed to load package image: ${pkg.image}`);
                    console.error(`Image URL was: ${SERVER_URL}/uploads/${pkg.image}`);
                    e.target.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log(`Successfully loaded package image: ${SERVER_URL}/uploads/${pkg.image}`);
                  }}
                />
              )}
              <Card.Body>
                <Card.Title>{pkg.name}</Card.Title>
                <Card.Text>{pkg.description}</Card.Text>
                <p><strong>Duration:</strong> {pkg.duration}</p>
                <p><strong>Price:</strong> ₹{pkg.price}</p>
                                 <Button 
                   variant="primary" 
                   onClick={() => handleBookNow(pkg)}
                 >
                   Book Package
                 </Button>
              </Card.Body>
            </Card>
          </Col>
                 ))}
       </Row>

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
