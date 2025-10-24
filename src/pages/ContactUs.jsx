import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import SERVER_URL from "../services/serverURL";

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${SERVER_URL}/contact`, form);

      if (res.data.success) {
        setSubmitted(true);
        setForm({ name: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send message. Please try again later.");
    }
  };

  return (
    <Container style={{ marginTop: "100px", marginBottom: "50px" }}>
      {/* Top Section: Contact Cards */}
      <Row className="mb-5 text-center">
        <Col md={4} className="mb-3">
          <Card className="shadow-sm border-0 p-4 h-100">
            <Card.Body>
              <i className="fas fa-map-marker-alt fa-2x mb-3"></i>
              <Card.Title>Address</Card.Title>
              <Card.Text>
                NH, Aluva<br />
                Kochi, Kerala<br />
                India
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="shadow-sm border-0 p-4 h-100">
            <Card.Body>
              <i className="fas fa-envelope fa-2x mb-3"></i>
              <Card.Title>Email</Card.Title>
              <Card.Text>
                info@flymallu.com
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="shadow-sm border-0 p-4 h-100">
            <Card.Body>
              <i className="fas fa-phone fa-2x mb-3"></i>
              <Card.Title>Phone</Card.Title>
              <Card.Text>
                +91 8089084080
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bottom Section: Contact Form */}
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 shadow-sm border-0">
            <Card.Body>
              <h3 className="text-center mb-4 fw-bold">Send Us a Message</h3>

              {submitted && (
                <Alert variant="success" onClose={() => setSubmitted(false)} dismissible>
                  ✅ Message sent successfully! We’ll get back to you soon.
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="name">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="subject" className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="message" className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Write your message..."
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="text-center">
                  <Button variant="primary" type="submit" className="fw-bold px-4">
                    Send Message
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactUs;
