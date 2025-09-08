import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import SERVER_URL from "../services/serverURL";
import '../App.css'
import Select from 'react-select';
import defaultVehicleImage from '../assets/default-vehicle.jpg';

export const Home = () => {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    vehicle: "",
    pickup: "",
    drop: "",
    date: "",
    time: "",
    vehicleType: "",
    passengerCount: "",
  });
  const [message, setMessage] = useState("");
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${SERVER_URL}/vehicles`);
        setVehicles(response.data);
        setError(null);
      } catch (err) {
        const errorMessage =
          err.response?.status === 500
            ? "Server error occurred. Please try again later."
            : "Failed to load vehicles. Please check your connection.";
        setError(errorMessage);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();

    const fetchPlaces = async () => {
      try {
        const res = await axios.get("http://localhost:5000/places/kerala-places");
        setPlaces(res.data); // store in state
      } catch (err) {
        console.error("Error loading places:", err);
      }
    };
    fetchPlaces();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "passengerCount") {
      const selectedVehicle = vehicles.find((v) => v._id === form.vehicle);
      const maxCapacity = selectedVehicle?.capacity || 10;
      const numValue = parseInt(value) || "";

      setForm((prev) => ({
        ...prev,
        [name]: numValue > maxCapacity ? maxCapacity : numValue,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const token = sessionStorage.getItem("token");
      if (!token) {
        setMessage("❌ You must be logged in to book a taxi");
        return;
      }

      if (!form.vehicle) {
        setMessage("❌ Please select a vehicle first");
        return;
      }

      const bookingData = {
        vehicle: form.vehicle, // ✅ fixed field name
        pickup: form.pickup,
        drop: form.drop,
        date: form.date,
        time: form.time,
        passengerCount: parseInt(form.passengerCount) || 1,
        status: "pending",
      };

      const selectedVehicle = vehicles.find((v) => v._id === form.vehicle);
      if (selectedVehicle && bookingData.passengerCount > selectedVehicle.capacity) {
        setMessage(`❌ Maximum ${selectedVehicle.capacity} passengers allowed for this vehicle`);
        return;
      }

      const response = await axios.post(`${SERVER_URL}/bookings`, bookingData);

      if (response.data) {
        setMessage("✅ Booking successful!");
        setForm({
          vehicle: "",
          pickup: "",
          drop: "",
          date: "",
          time: "",
          vehicleType: "",
          passengerCount: "",
        });
      }
    } catch (err) {
      console.error("Booking failed:", err);
      setMessage(`❌ ${err.response?.data?.message || "Booking failed. Please try again"}`);
    }
  };

  const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#f1f1fbff", // input background
    borderRadius: "7px",        // rounded corners
    borderColor: state.isFocused ? "#ffffffff" : "#ccc", // border color on focus
    boxShadow: state.isFocused  ? "inset 0 2px 4px rgba(0,0,0,0.1), 0 0 0 1px #007bff"
      : "inset 0 2px 4px rgba(147, 147, 147, 0.34)",
    // "&:hover": {
    //   borderColor: "#007bff",
    // },
    minHeight: "55px",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "12px",
    backgroundColor: "#deebffff",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#c0deffff"
      : state.isFocused
      ? "#e6f0ff"
      : "#fff",
    color: state.isSelected ? "#fff" : "#000",
    "&:hover": {
      backgroundColor: "#cce0ff",
      color: "#000",
    },
    borderRadius: "8px",
    margin: "2px 5px",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#8b8b8bff",
    marginLeft: "15px",
  }),
};

  return (
    <div>
      <Container className="mt-4">
        {/* Booking Form */}
        <Row>
          <Col md={12} className="mb-4">
            <Card className="p-3 shadow" style={{ height: "400px" }}>
              <h4 className="text-center fw-bold" style={{ fontSize: "35px" }}>Book a Taxi</h4>
              <Form onSubmit={handleSubmit}>
                <Row className="justify-content-center">
                  <Col md={6}>
                    <Select
                      options={places.map((p) => ({ value: p.name, label: p.name }))}
                      value={
                        form.pickup
                          ? { value: form.pickup, label: form.pickup }
                          : null
                      }
                      onChange={(selected) =>
                        setForm({ ...form, pickup: selected.value })
                      }
                      placeholder="Select Pickup Location"
                      isSearchable
                      styles={customStyles}
                    />
                  </Col>
                  <Col md={6}>
                    <Select
                      options={places.map((p) => ({ value: p.name, label: p.name }))}
                      value={
                        form.drop
                          ? { value: form.drop, label: form.drop }
                          : null
                      }
                      onChange={(selected) =>
                        setForm({ ...form, drop: selected.value })
                      }
                      placeholder="Select Drop Location"
                      isSearchable
                      styles={customStyles}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    <Form.Control
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Vehicle Dropdown */}
                <Row className="mt-2">
                  <Col>
                    <Form.Select
                      name="vehicle"
                      value={form.vehicle}
                      onChange={(e) => {
                        const selectedVehicle = vehicles.find(
                          (v) => v._id === e.target.value
                        );
                        setForm((prev) => ({
                          ...prev,
                          vehicle: e.target.value,
                          vehicleType: selectedVehicle?.type || "",
                        }));
                      }}
                      required
                    >
                      <option value="">-- Select a Vehicle --</option>
                      {vehicles
                        .filter((v) => v.status === "approved")
                        .map((vehicle) => (
                          <option key={vehicle._id} value={vehicle._id}>
                            {vehicle.model} ({vehicle.type}) - ₹{vehicle.fare}/km
                          </option>
                        ))}
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Control
                      placeholder="Passenger Count"
                      name="passengerCount"
                      value={form.passengerCount}
                      onChange={handleChange}
                      type="number"
                      min="1"
                      max={form.selectedVehicle?.capacity || 10}
                      required
                    />
                  </Col>
                </Row>

                <div className="d-flex justify-content-center">
                  <Button className="mt-3 fw-bold" variant="primary" type="submit" style={{ fontSize: "25px", padding: "10px 40px" }}>
                    Book Now
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>

        {/* Error and Loading States */}
        {loading && (
          <Row className="mb-4">
            <Col>
              <Alert variant="info">Loading vehicles...</Alert>
            </Col>
          </Row>
        )}

        {error && (
          <Row className="mb-4">
            <Col>
              <Alert variant="danger">{error}</Alert>
            </Col>
          </Row>
        )}

        {message && (
          <Row className="mb-4">
            <Col>
              <Alert variant={message.includes("✅") ? "success" : "danger"}>
                {message}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Vehicle Preview List */}
        <h5 className="mb-4 mt-3 fw-bold text-center" style={{ fontSize: "50px" }}>Available Vehicles</h5>
        <Row className="justify-content-center">
          {vehicles
            .filter((vehicle) => vehicle.status === "approved")
            .map((vehicle) => (
              <Col md={4} key={vehicle._id} className="mb-3 d-flex justify-content-center">
                <Card className="shadow">
                  <Card.Img
                    variant="top"
                    src={vehicle.imageUrl ? `${SERVER_URL}/uploads/${vehicle.imageUrl}` : defaultVehicleImage}
                    alt={vehicle.model}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultVehicleImage;
                    }}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title>{vehicle.model}</Card.Title>
                    <Card.Text>
                      Type: {vehicle.type}<br />
                      Capacity: {vehicle.capacity} seats<br />
                      Fare: ₹{vehicle.fare}/km
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
