import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Card, Alert, Nav, } from "react-bootstrap";
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
    returnDate: "",
    time: "",
    vehicleType: "",
    passengerCount: "",
    tripType: "",
  });
  const [message, setMessage] = useState("");
  const [places, setPlaces] = useState([]);
  const [tripType, setTripType] = useState("round");
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [airportTripType, setAirportTripType] = useState("pickup");

  const keralaAirports = [
    { value: "COK", label: "Cochin International Airport (COK)" },
    { value: "TRV", label: "Trivandrum International Airport (TRV)" },
    { value: "CCJ", label: "Calicut International Airport (CCJ)" },
    { value: "CNN", label: "Kannur International Airport (CNN)" },
  ];

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
        vehicle: form.vehicle,
        pickup: form.pickup,
        drop: form.drop,
        date: form.date,
        returnDate: tripType === "round" ? form.returnDate : null,
        time: form.time,
        passengerCount: parseInt(form.passengerCount) || 1,
        tripType,
        airportTripType: tripType === "airport" ? airportTripType : null, // ✅
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
          returnDate: "",
          time: "",
          vehicleType: "",
          passengerCount: "",
          tripType: "",
        });
      }
    } catch (err) {
      console.error("Booking failed:", err);
      setMessage(`❌ ${err.response?.data?.message || "Booking failed. Please try again"}`);
    }
  };



  return (
    <div>
      <Container className="mt-4">
        <h4 className="text-center fw-bold" style={{ fontSize: "35px" }}>Book Your Taxi</h4>

        {/* Booking Form */}
        <Row>
          <Col md={12} className="mb-4 ">
            <Card className="booking-form-card p-3 shadow d-flex justify-content-center" style={{ height: "500px", width: "100%" }}>
              <div
                className="  rounded  justify-content-center align-items-center text-center "
                style={{ maxWidth: "1350px", margin: "auto" }}
              >
                <Nav variant="" activeKey={tripType} className="justify-content-center align-items-center text-center mb-2 " style={{ width: "500px" }}>
                  <Nav.Item>
                    <Nav.Link eventKey="oneway" onClick={() => setTripType("oneway")}>
                      ONE WAY
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="round" onClick={() => setTripType("round")}>
                      ROUND TRIP
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="local" onClick={() => setTripType("local")}>
                      LOCAL
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="airport" onClick={() => setTripType("airport")}>
                      AIRPORT
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>


              <Form onSubmit={handleSubmit}>
                {/* Trip Type (only for airport) */}
                {tripType === "airport" && (
                  <Row className="mb-4 justify-content-center">
                    <Col md={6} className="booking-field">
                      <Form.Label className="booking-label">Trip Type</Form.Label>
                      <Form.Select
                        className="booking-input"
                        value={airportTripType}
                        onChange={(e) => setAirportTripType(e.target.value)}
                      >
                        <option value="pickup">Pickup from Airport</option>
                        <option value="drop">Drop to Airport</option>
                      </Form.Select>
                    </Col>
                  </Row>
                )}

                {/* Pickup & Drop */}
                <Row className="mb-4 justify-content-center">
                  <Col md={5} className="booking-field">
                    <Form.Label className="booking-label">From</Form.Label>
                    <Select
                      classNamePrefix="rs"
                      className="booking-select booking-field"
                      options={places.map((p) => ({ value: p.name, label: p.name }))}
                      value={form.pickup ? { value: form.pickup, label: form.pickup } : null}
                      onChange={(selected) => setForm({ ...form, pickup: selected.value })}
                      placeholder="Select Pickup Location"
                      isSearchable
                    />
                  </Col>
                  <Col md={5} className="booking-field">
                    <Form.Label className="booking-label">To</Form.Label>
                    <Select
                      classNamePrefix="rs"
                      className="booking-select booking-field"
                      options={places.map((p) => ({ value: p.name, label: p.name }))}
                      value={form.drop ? { value: form.drop, label: form.drop } : null}
                      onChange={(selected) => setForm({ ...form, drop: selected.value })}
                      placeholder="Select Drop Location"
                      isSearchable
                    />
                  </Col>
                </Row>

                {/* Dates & Time */}
                <Row className="mb-4 justify-content-center">
                  <Col md={4} className="booking-field">
                    <Form.Label className="booking-label">Pick Up Date</Form.Label>
                    <Form.Control
                      className="booking-input"
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                    />
                  </Col>

                  {tripType === "round" && (
                    <Col md={4} className="booking-field">
                      <Form.Label className="booking-label">Return Date</Form.Label>
                      <Form.Control
                        className="booking-input"
                        type="date"
                        value={form.returnDate || ""}
                        min={form.date || new Date().toISOString().split("T")[0]}
                        onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                      />
                    </Col>
                  )}

                  <Col md={4} className="booking-field">
                    <Form.Label className="booking-label">Pick Up Time</Form.Label>
                    <Form.Control
                      className="booking-input"
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                {/* Vehicle & Passengers */}
                <Row className="mb-4 justify-content-center">
                  <Col md={6} className="booking-field">
                    <Form.Label className="booking-label">Vehicle</Form.Label>
                    <Form.Select
                      className="booking-input"
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
                          selectedVehicle,
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

                  <Col md={6} className="booking-field">
                    <Form.Label className="booking-label">Passengers</Form.Label>
                    <Form.Control
                      className="booking-input"
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

                {/* Submit Button */}
                <div className="d-flex justify-content-center">
                  <Button type="submit" className="book-btn">
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