import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Row, Col, Button, Card, Table, Alert, Spinner } from "react-bootstrap";

export default function VehicleOnboarding() {
  const [form, setForm] = useState({
    model: "",
    number: "",
    type: "",
    capacity: "",
    contactNumber: "",
    image: null
  });
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token");
  if (!token) {
    setMessage({
      text: "❌ Please login to onboard vehicles",
      type: "danger",
    });
    return;
  }

    try {
      const formData = new FormData();
      formData.append("model", form.model);
      formData.append("number", form.number);
      formData.append("type", form.type);
      formData.append("capacity", form.capacity);
      formData.append("contactNumber", form.contactNumber);
      if (form.image) formData.append("image", form.image);

      await axios.post("http://localhost:5000/vehicles", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}`, },
      });

      alert("✅ Vehicle onboarded successfully!");
      setForm({
        model: "",
        number: "",
        type: "",
        capacity: "",
        contactNumber: "",
        image: null
      });
    } catch (err) {
      console.error("Error:", err.response?.data);
      alert("❌ Error onboarding vehicle.");
    }
  };

  // Fetch approved vehicles for user
  const fetchVehicles = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("http://localhost:5000/vehicles", {
        headers: { Authorization: `Bearer ${token}` }
      });

      

      // Filter only approved vehicles
      const approvedVehicles = response.data.filter(vehicle => 
        vehicle.status === 'approved' 
      );
     
      setVehicles(approvedVehicles);
      setError(null);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <Container className="" style={{marginTop:"130px"}}>
      {/* Existing onboarding form */}
      <Card className="p-4 shadow mb-4">
        <h3 className="text-center" style={{fontSize:"40px"}}>Onboard Vehicle</h3>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Control
                name="model"
                value={form.model}
                onChange={handleChange}
                placeholder="Vehicle Model"
                required
              />
            </Col>
            <Col>
              <Form.Control
                name="number"
                value={form.number}
                onChange={handleChange}
                placeholder="Registration No"
                required
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
                required
              />
            </Col>
            <Col>
              <Form.Control type="file" name="image" onChange={handleChange} required />
            </Col>
          </Row>

          <div className="text-center">
            <Button type="submit" className="mt-3" variant="success">
              Onboard Vehicle
            </Button>
          </div>
        </Form>
      </Card>

      {/* Approved Vehicles List */}
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
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle._id}>
                  <td>{vehicle.model}</td>
                  <td>{vehicle.number}</td>
                  <td>{vehicle.type}</td>
                  <td>{vehicle.capacity}</td>
                  <td>{vehicle.contactNumber}</td>
                  <td>
                    <span className="badge bg-success">Approved</span>
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
