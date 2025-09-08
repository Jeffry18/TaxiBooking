import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Card,
  Alert,
  Spinner,
} from "react-bootstrap";
import SERVER_URL from "../services/serverURL";

export default function DriverOnboardingAndList() {
  const [driver, setDriver] = useState({
    name: "",
    licenseNo: "",
    contact: "",
    email: "",
    image: null,
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  // 🔹 Fetch approved drivers list only
  const fetchDrivers = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/drivers`);
      console.log("All drivers data:", res.data); // Debug: log the response
      
      // Filter only approved drivers
      const approvedDrivers = res.data.filter(driver => driver.status === 'approved');
      console.log("Approved drivers:", approvedDrivers);
      
      setDrivers(approvedDrivers);
    } catch (err) {
      console.error("Failed to load drivers:", err);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // 🔹 Handle form input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      // Store the actual File object, not the path
      setDriver({ ...driver, image: files[0] });
    } else {
      setDriver({ ...driver, [name]: value });
    }
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token");
  if (!token) {
    setMessage({
      text: "❌ Please login to onboard drivers",
      type: "danger",
    });
    return;
  }
    
    // Validate that we have a valid image file
    if (!driver.image || !(driver.image instanceof File)) {
      setMessage({
        text: "Please select a valid image file",
        type: "danger",
      });
      return;
    }
    
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(driver).forEach((key) => {
        if (driver[key]) {
          // Only add image if it's actually a File object
          if (key === 'image' && driver[key] instanceof File) {
            formData.append(key, driver[key]);
            console.log('Adding image to FormData:', driver[key]);
            console.log('Image type:', typeof driver[key]);
            console.log('Image instanceof File:', driver[key] instanceof File);
          } else if (key !== 'image') {
            // Add non-image fields
            formData.append(key, driver[key]);
          }
        }
      });

      const response = await axios.post(`${SERVER_URL}/drivers`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        setMessage({
          text: "Driver onboarded successfully!",
          type: "success",
        });

        // Reset form
        setDriver({
          name: "",
          licenseNo: "",
          contact: "",
          email: "",
          image: null,
        });
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";

        // Refresh drivers list
        fetchDrivers();
      }
    } catch (err) {
      console.error("Driver onboarding failed:", err);
      setMessage({
        text: err.response?.data?.message || "Error onboarding driver",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4 ">
      {/* Onboarding Form */}
      <Card className="p-4 shadow mb-5 ">
        <h3 className="text-center fw-bold" style={{fontSize:"40px"}}>Onboard Driver</h3>

        {message.text && (
          <Alert
            variant={message.type}
            dismissible
            onClose={() => setMessage({ text: "", type: "" })}
          >
            {message.text}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Driver Name*</Form.Label>
                <Form.Control
                  name="name"
                  value={driver.name}
                  onChange={handleChange}
                  placeholder="Enter driver name"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>License Number*</Form.Label>
                <Form.Control
                  name="licenseNo"
                  value={driver.licenseNo}
                  onChange={handleChange}
                  placeholder="Enter license number"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Contact Number*</Form.Label>
                <Form.Control
                  name="contact"
                  value={driver.contact}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address*</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={driver.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Driver Photo</Form.Label>
            <Form.Control
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => {
                console.log('File input change event:', e.target.files);
                handleChange(e);
              }}
              required
            />
            {driver.image && (
              <div className="mt-2">
                <small className="text-muted">
                  Selected file: {driver.image instanceof File ? driver.image.name : 'Invalid file'}
                </small>
              </div>
            )}
          </Form.Group>

          <div className="text-center">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Adding Driver..." : "Add Driver"}
            </Button>
          </div>
        </Form>
      </Card>

      {/* Approved Drivers List */}
      <h3 className="mb-4 text-center" style={{fontSize:"38px"}}>Approved Drivers ({drivers.length})</h3>
      {listLoading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row className="justify-content-center">
          {drivers.map((driver) => (
                         <Col md={4} key={driver._id} className="mb-4">
               <Card className="shadow h-100">
                 {driver.image ? (
                  <Card.Img
                    variant="top"
                    src={`${SERVER_URL}/uploads/${driver.image}`}
                    alt={driver.name}
                    style={{ height: "350px", objectFit: "cover" }}
                    onError={(e) => {
                      console.error(`Failed to load image: ${driver.image}`);
                      console.error(`Image URL was: ${SERVER_URL}/uploads/${driver.image}`);
                      e.target.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log(`Successfully loaded image: ${SERVER_URL}/uploads/${driver.image}`);
                    }}
                  />
                ) : (
                  <div 
                    style={{ 
                      height: "250px", 
                      backgroundColor: "#f8f9fa", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      border: "1px solid #dee2e6"
                    }}
                  >
                    <span className="text-muted">No Image</span>
                  </div>
                )}
                <Card.Body>
                  <Card.Title>{driver.name}</Card.Title>
                  <Card.Text>
                    <strong>License No:</strong> {driver.licenseNo} <br />
                    <strong>Contact:</strong> {driver.contact} <br />
                    <strong>Email:</strong> {driver.email}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        
      )}
            <p className="text-muted mb-4">Only drivers approved by admin are displayed here</p>

    </Container>
  );
}
