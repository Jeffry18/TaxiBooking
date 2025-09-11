import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Card, Alert, Nav, Table, Spinner, Carousel, } from "react-bootstrap";
import SERVER_URL from "../services/serverURL";
import '../App.css'
import Select from 'react-select';
import defaultVehicleImage from '../assets/default-vehicle.jpg';
import HomeCarousel from "../components/Carousel";
import local from '../assets/local.jpg';
import round from '../assets/round.jpg';
import airport from '../assets/airport.jpg';
import oneway from '../assets/oneway.jpg';



export const Home = () => {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
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
  const [recent, setRecent] = useState([]);

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

    const fetchRecentBookings = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${SERVER_URL}/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = Array.isArray(res.data) ? res.data : [];
        const top5 = list
          .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))
          .slice(0, 5);
        setRecent(top5);
      } catch (err) {
        console.error("Error fetching recent bookings:", err);
      }
    };
    fetchRecentBookings();

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

      const response = await axios.post(`${SERVER_URL}/bookings`, bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      })
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
        // refresh bookings after new booking
        const res = await axios.get(`${SERVER_URL}/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = Array.isArray(res.data) ? res.data : [];
        const top5 = list
          .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))
          .slice(0, 5);
        setRecent(top5);

      }
    } catch (err) {
      console.error("Booking failed:", err);
      setMessage(`❌ ${err.response?.data?.message || "Booking failed. Please try again"}`);
    }
  };





  const isAirport = tripType === "airport";
  const isRound = tripType === "round";
  const row1Cols = isAirport ? 4 : 3;
  const row1Lg = 12 / row1Cols;
  const row2Cols = isRound ? 4 : 3;
  const row2Lg = 12 / row2Cols;

  return (
    <div>

      <Container fluid className=" " style={{ width: "100%", minHeight: "100vh", paddingTop: "70px", paddingRight: "0px", paddingLeft: "0px" }}>

        <div style={{ position: "relative", width: "100%" }}>
          {/* Banner Carousel */}
          <HomeCarousel />

          {/* Booking Form */}
          <Row>
            <Col md={12} className="mb-4 ">
              <Card className="booking-form-card d-flex  booking-form-card  shadow"
                style={{
                  position: "absolute",   // position it over the carousel
                  bottom: "-180px",        // adjust how much it overlaps
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "85%",         // width within viewport
                  zIndex: 10,             // ensure it’s on top
                  borderRadius: "10px",
                  height: "290px"
                }}>


                <Card style={{ border: "none" }}>
                  <div
                    className="mt-3 mb-2  rounded  justify-content-center align-items-center text-center "
                    style={{ maxWidth: "1350px", width: "100px" }}
                  >
                    <Nav variant="" activeKey={tripType} className=" justify-content-center align-items-center text-center  " style={{ width: "500px" }}>
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
                </Card>


                <Form onSubmit={handleSubmit}>
                  {/* Row 1: Trip Type (airport) | From | To | Pick Up Date */}
                  <Row className=" justify-content-center">
                    {isAirport && (
                      <Col lg={row1Lg} md={6} className="mb-1 booking-field">
                        <Form.Label className="booking-label mb-1">Trip Type</Form.Label>
                        <Form.Select
                          className="booking-input"
                          value={airportTripType}
                          onChange={(e) => setAirportTripType(e.target.value)}

                        >
                          <option value="pickup">Pickup from Airport</option>
                          <option value="drop">Drop to Airport</option>
                        </Form.Select>
                      </Col>
                    )}
                    <Col lg={row1Lg} md={6} className="mb-1 booking-field">
                      <Form.Label className="booking-label mb-1">From</Form.Label>
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
                    <Col lg={row1Lg} md={6} className="mb-1 booking-field">
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
                    <Col lg={row1Lg} md={6} className="mb-1 booking-field">
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
                  </Row>

                  {/* Row 2: Return Date | Vehicle | Passengers | Pick Up Time */}
                  <Row className="mb-2 justify-content-center">
                    {isRound && (
                      <Col lg={row2Lg} md={6} className="mb-1 booking-field">
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

                    <Col lg={row2Lg} md={6} className="mb-1 booking-field">
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

                    <Col lg={row2Lg} md={6} className="mb-1 booking-field">
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
                    <Col lg={row2Lg} md={6} className="mb-1 booking-field">
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
        </div>


        {/* Error and Loading States */}
        {loading && (
          <Row className="mb-4" style={{ marginTop: "250px" }}>
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



        {/* Recent Bookings */}

        <div className="" style={{ marginTop: "250px", marginLeft: "100px", marginRight: "100px" }}>
          <h4 className="fw-bold  text-center">Recent Bookings</h4>

          {loading && (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && recent.length === 0 && (
            <p className="text-center text-muted">No recent bookings found.</p>
          )}

          {!loading && recent.length > 0 && (
            <Table striped bordered hover responsive className="text-center">
              <thead className="table-dark">
                <tr>
                  <th>Pickup</th>
                  <th>Drop</th>
                  <th>Date</th>
                  <th>Return Date</th>
                  <th>Time</th>
                  <th>Passengers</th>
                  <th>Trip Type</th>
                  <th>Vehicle</th>
                  {/* <th>Status</th> */}
                </tr>
              </thead>
              <tbody>
                {recent.map((b) => (
                  <tr key={b._id}>
                    <td>{b.pickup}</td>
                    <td>{b.drop}</td>
                    <td>{b.date ? new Date(b.date).toLocaleDateString() : "-"}</td>
                    <td>
                      {b.returnDate
                        ? new Date(b.returnDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{b.time}</td>
                    <td>{b.passengerCount}</td>
                    <td>
                      {b.tripType === "airport"
                        ? `Airport (${b.airportTripType})`
                        : b.tripType}
                    </td>
                    <td>
                      {b.vehicle.name} ({b.vehicle.type})
                    </td>
                    {/* <td>
                      <span
                        className={`badge ${b.status === "confirmed"
                            ? "bg-success"
                            : b.status === "pending"
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                          }`}
                      >
                        {b.status}
                      </span>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>


        {/* Trip Types */}
        <div className="text-center" style={{ marginTop: "50px" }}>
          <h1 className="fw-bold mb-3">TRIP TYPES</h1>
          <Row className="g-3 m-2">
            <Col md={3} sm={6} xs={12}>
              <Card className="trip-card shadow ">
                <Card.Img className="trip-card-img" variant="top" src={local} alt="Local trips" />
                <Card.Body>
                  <Card.Title>LOCAL TRIPS</Card.Title>
                  <Card.Text>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} xs={12}>
              <Card className="trip-card shadow ">
                <Card.Img className="trip-card-img" variant="top" src={round} alt="Round trips" />
                <Card.Body>
                  <Card.Title>ROUND TRIPS</Card.Title>
                  <Card.Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} xs={12}>
              <Card className="trip-card shadow ">
                <Card.Img className="trip-card-img" variant="top" src={oneway} alt="One-way trips" />
                <Card.Body>
                  <Card.Title>ONE WAY TRIPS</Card.Title>
                  <Card.Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} xs={12}>
              <Card className="trip-card shadow">
                <Card.Img className="trip-card-img" variant="top" src={airport} alt="Airport trips" />
                <Card.Body>
                  <Card.Title>AIRPORT TRIPS</Card.Title>
                  <Card.Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>


        {/* Vehicle Preview List */}
        <h5 className=" fw-bold text-center" style={{ fontSize: "50px", marginTop: "150px" }}>Available Vehicles</h5>
        <Row className="justify-content-center mt-3" style={{marginLeft:"100px", marginRight:"100px"}}>
          {vehicles
            .filter((vehicle) => vehicle.status === "approved")
            .map((vehicle) => (
              <Col md={3} key={vehicle._id} className="mb-3 d-flex justify-content-center">
                <Card className="shadow vehicle-card">
                  <Card.Img
                    className="vehicle-card-img"
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