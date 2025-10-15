import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Card,
  Table,
  Alert,
  Spinner,
} from "react-bootstrap";

export default function VehicleOnboarding() {
  const [form, setForm] = useState({
    model: "",
    number: "",
    type: "",
    capacity: "",
    contactNumber: "",
    images: [],
  });
  const [vehicles, setVehicles] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setForm({ ...form, images: Array.from(files) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ✅ Validation Logic
  const validateForm = () => {
    if (!form.model || form.model.length < 2)
      return "❌ Please enter a valid vehicle model (min 2 characters).";

    if (!form.number || !/^[A-Za-z0-9-]{6,}$/.test(form.number))
      return "❌ Enter a valid registration number (min 6 characters, letters/numbers only).";

    if (!form.type.trim()) return "❌ Please specify vehicle type (SUV, Sedan, etc.).";

    if (!form.capacity || isNaN(form.capacity) || Number(form.capacity) <= 0)
      return "❌ Please enter a valid capacity (numeric and positive).";

    if (!/^[0-9]{10}$/.test(form.contactNumber))
      return "❌ Please enter a valid 10-digit contact number.";

    if (!form.images || form.images.length < 5)
      return "❌ Please upload  5 images as requested.";

    if (form.images.length > 10)
      return "❌ Maximum 10 images allowed.";

    const invalidImage = form.images.find(
      image => !["image/jpeg", "image/png"].includes(image.type)
    );
    if (invalidImage)
      return "❌ Only JPG , PNG or PDF images are allowed.";

    return null; // All good ✅
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token");
    if (!token) {
      setMessage({
        text: "❌ Please login to onboard vehicles.",
        type: "danger",
      });
      return;
    }

    // Validate before submitting
    const validationError = validateForm();
    if (validationError) {
      setMessage({ text: validationError, type: "danger" });
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();

      // Append text fields
      formData.append('model', form.model);
      formData.append('number', form.number);
      formData.append('type', form.type);
      formData.append('capacity', form.capacity);
      formData.append('contactNumber', form.contactNumber);

      // Append multiple images
      form.images.forEach(image => {
        formData.append('images', image);
      });

      await axios.post("http://localhost:5000/vehicles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage({
        text: "✅ Vehicle onboarded successfully!",
        type: "success",
      });
      setForm({
        model: "",
        number: "",
        type: "",
        capacity: "",
        contactNumber: "",
        images: [],
      });
      fetchVehicles();
    } catch (err) {
      console.error("Error:", err.response?.data);
      setMessage({
        text: err.response?.data?.message || "❌ Error onboarding vehicle.",
        type: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Fetch approved vehicles
  const fetchVehicles = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("http://localhost:5000/vehicles", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const approvedVehicles = response.data.filter(
        (v) => v.status === "approved"
      );

      setVehicles(approvedVehicles);
      setError(null);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError("Failed to load vehicles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <Container style={{ marginTop: "130px" }}>
      {/* Onboard Vehicle Form */}
      <Card className="p-4 shadow mb-4">
        <h3 className="text-center mb-3" style={{ fontSize: "40px" }}>
          Onboard Vehicle
        </h3>

        {message && (
          <Alert
            variant={message.type}
            onClose={() => setMessage(null)}
            dismissible
            className="mb-3"
          >
            {message.text}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Control
                name="model"
                value={form.model}
                onChange={handleChange}
                placeholder="Vehicle Model"
              />
            </Col>
            <Col>
              <Form.Control
                name="number"
                value={form.number}
                onChange={handleChange}
                placeholder="Registration No"
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col>
              <Form.Control
                name="type"
                value={form.type}
                onChange={handleChange}
                placeholder="Type (SUV, Sedan...)"
              />
            </Col>
            <Col>
              <Form.Control
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                placeholder="Seats"
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col>
              <Form.Control
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                placeholder="Contact Number"
              />
            </Col>
            <Col>
              <div className="mb-2">
                <Form.Control
                  type="file"
                  name="images"
                  onChange={handleChange}
                  multiple
                  accept="image/jpeg,image/png,application/pdf"
                />
                <Form.Text className="text-muted">
                  Upload Vehicle Image , Registration Certificate , Pollution Certificate , Insurance Certificate and Driving License (JPG , PNG , PDF). Max 10MB.
                </Form.Text>
              </div>
              {form.images.length > 0 && (
                <div className="selected-files-container p-2 border rounded bg-light">
                  <small className="text-muted d-block mb-1">Selected files ({form.images.length}):</small>
                  <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                    {Array.from(form.images).map((file, index) => (
                      <div key={index} className="selected-file" style={{ fontSize: '0.875rem' }}>
                        {index + 1}. {file.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Col>

          </Row>

          <div className="text-center mt-3">
            <Button type="submit" variant="success" disabled={submitting}>
              {submitting ? <Spinner size="sm" animation="border" /> : "Onboard Vehicle"}
            </Button>
          </div>
        </Form>
      </Card>

      {/* Approved Vehicles */}
      <Card className="p-4 shadow">
        <h3 className="text-center mb-4">Your Approved Vehicles</h3>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : vehicles.length === 0 ? (
          <Alert variant="info">No approved vehicles found.</Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Model</th>
                <th>Number</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Images</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v._id}>
                  <td>{v.model}</td>
                  <td>{v.number}</td>
                  <td>{v.type}</td>
                  <td>{v.capacity}</td>
                  <td>{v.contactNumber}</td>
                  <td>
                    <span className="badge bg-success">Approved</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {v.images && v.images.map((image, index) => (
                        <img
                          key={index}
                          src={`http://localhost:5000/uploads/${image}`}
                          alt={`Vehicle ${index + 1}`}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </Container>
  );
}
