import { useState } from "react";
import axios from "axios";
import { Container, Form, Row, Col, Button, Card } from "react-bootstrap";

export default function VehicleOnboarding() {
  const [form, setForm] = useState({
    model: "",
    number: "",
    type: "",
    capacity: "",
    fare: "",
    image: null
  });

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
      formData.append("fare", form.fare);
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
        fare: "",
        image: null
      });
    } catch (err) {
      console.error("Error:", err.response?.data);
      alert("❌ Error onboarding vehicle.");
    }
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow">
        <h3>Onboard Vehicle</h3>
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
                name="fare"
                value={form.fare}
                onChange={handleChange}
                placeholder="Fare per km"
              />
            </Col>
            <Col>
              <Form.Control type="file" name="image" onChange={handleChange} required />
            </Col>
          </Row>

          <Button type="submit" className="mt-3" variant="success">
            Onboard Vehicle
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
