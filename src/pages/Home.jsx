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
import { useNavigate } from "react-router-dom";




export const Home = () => {
  const [vehicles, setVehicles] = useState([]); // kept for backward compatibility (no longer used)
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cabTypes, setCabTypes] = useState([]);
  const [form, setForm] = useState({
    vehicle: "", // will hold selected cab type id now
    pickup: "",
    drop: "",
    extraStops: [],
    date: "",
    returnDate: "",
    time: "",
    vehicleType: "",
    passengerCount: "",
    //tripType: "",
    selectedCabType: null,
  });

  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [places, setPlaces] = useState([]);
  const [tripType, setTripType] = useState("round");
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [airportTripType, setAirportTripType] = useState("pickup");
  const [recent, setRecent] = useState([]);
  const [extraStops, setExtraStops] = useState([]); // for extra locations

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
        const res = await axios.get(`${SERVER_URL}/places/kerala-places`);
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
    const fetchCabTypes = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${SERVER_URL}/cabtypes`);
        setCabTypes(res.data);
        setError(null);
      } catch (err) {
        const errorMessage =
          err.response?.status === 500
            ? "Server error occurred. Please try again later."
            : "Failed to load cab types. Please check your connection.";
        setError(errorMessage);
        setCabTypes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCabTypes();

  }, []);

  const addStop = () => {
    setExtraStops([...extraStops, ""]);
  };

  const updateStop = (index, value) => {
    const updatedStops = [...extraStops];
    updatedStops[index] = value;
    setExtraStops(updatedStops);
  };

  const removeStop = (index) => {
    const updatedStops = extraStops.filter((_, i) => i !== index);
    setExtraStops(updatedStops);
  };



  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "passengerCount") {
      const maxCapacity = form.selectedCabType?.seats || 10;
      const numValue = parseInt(value) || "";

      setForm((prev) => ({
        ...prev,
        [name]: numValue > maxCapacity ? maxCapacity : numValue,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleViewVehicles = (cabTypeName) => {
    navigate(`/view-vehicles/${cabTypeName}`);
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
        setMessage("❌ Please select a cab type");
        return;
      }

      const bookingData = {
        cabType: form.vehicle,
        pickup: form.pickup,
        drop: form.drop,
        extraStops: extraStops.filter(s => s.trim() !== "") || [], // ✅ include extra stops
        date: form.date,
        returnDate: form.returnDate,
        time: form.time,
        passengerCount: parseInt(form.passengerCount) || 1,
        // tripType,
        // airportTripType: tripType === "airport" ? airportTripType : null,
        status: "pending",
      };


      // cab types are already loaded on mount


      const selectedCabType = form.selectedCabType;
      if (selectedCabType && bookingData.passengerCount > (selectedCabType.seats || 10)) {
        setMessage(`❌ Maximum ${selectedCabType.seats} passengers allowed for this cab type`);
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
          extraStops: [],
          date: "",
          returnDate: "",
          time: "",
          vehicleType: "",
          passengerCount: "",
          // tripType: "",
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





  // const isAirport = tripType === "airport";
  // const isRound = tripType === "round";
  const row1Cols = 4;
  const row1Lg = 12 / row1Cols;
  const row2Cols = 4;
  const row2Lg = 12 / row2Cols;

  return (
    <div>

      <Container fluid className="" style={{ width: "100%", minHeight: "100vh", paddingTop: "70px", paddingRight: "0px", paddingLeft: "0px" }}>

        <div style={{ position: "relative", width: "100%" }}>
          {/* Banner Carousel */}
          <HomeCarousel />

          {/* Booking Form for large screens (overlay) */}
          <Row className="d-none d-md-block">
            <Col md={12} className="mb-4 ">
              <Card className="booking-form-card d-flex  booking-form-card  shadow"
                style={{
                  position: "absolute",
                  bottom: "-180px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "85%",
                  zIndex: 10,
                  borderRadius: "10px",
                  height: "auto",
                  padding: "12px"
                }}>


                <Card style={{ border: "none" }}>

                  <h2 className="text-center booking-heading red-shadow mb-3">BOOK YOUR TRIP</h2>


                  {/*
                  <div
                    className="mt-3 mb-2  rounded  justify-content-center align-items-center text-center "
                    style={{ maxWidth: "1350px", width: "100%" }}
                  >
                    <Nav variant="" activeKey={tripType} className=" justify-content-center align-items-center text-center  " style={{ width: "100%" }}>
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
                  */}
                </Card>


                <Form onSubmit={handleSubmit}>
                  {/* Row 1: Trip Type (airport) | From | To | Pick Up Date */}
                  <Row className=" justify-content-center">
                    {/* {isAirport && (
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
                    )} */}

                    <Col lg={3} md={6} className="mb-1 booking-field">
                      <Form.Label className="booking-label">To</Form.Label>
                      <Select
                        classNamePrefix="rs"
                        className="booking-select booking-field "
                        options={places.map((p) => ({ value: p.name, label: p.name }))}
                        value={form.drop ? { value: form.drop, label: form.drop } : null}
                        onChange={(selected) => setForm({ ...form, drop: selected.value })}
                        placeholder="Select Drop Location"
                        isSearchable

                      />
                    </Col>

                    <Col lg={3} md={6} className="mb-1 booking-field">
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
                    {/* Small Add button column in the same row */}
                    <Col lg={1} md={3} className="mb-3 mt-3 d-flex align-items-end justify-content-center">
                      <Button variant="outline-primary" size="sm" onClick={addStop} className="px-3 py-1">
                        +
                      </Button>
                    </Col>

                    {/* Cab Type column to complete 4 columns in the row */}
                    <Col lg={3} md={6} className="mb-1 booking-field">
                      <Form.Label className="booking-label">Cab Type</Form.Label>
                      <Form.Select
                        className="booking-input"
                        name="vehicle"
                        value={form.vehicle}
                        onChange={(e) => {
                          const selected = cabTypes.find((c) => c._id === e.target.value);
                          setForm((prev) => ({
                            ...prev,
                            vehicle: e.target.value,
                            selectedCabType: selected || null,
                          }));
                        }}
                        required
                      >
                        <option value="">-- Select a Cab Type --</option>
                        {cabTypes.map((cab) => (
                          <option key={cab._id} value={cab._id}>
                            {cab.name}{cab.seats ? ` (Seats: ${cab.seats})` : ""}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>




                    {/* Extra Stops */}
                    {extraStops.map((stop, index) => (
                      <Col key={index} lg={row1Lg} md={6} className="mb-1 booking-field d-flex align-items-end">
                        <div style={{ flexGrow: 1 }}>
                          <Form.Label className="booking-label">Stop {index + 1}</Form.Label>
                          <Select
                            classNamePrefix="rs"
                            className="booking-select booking-field"
                            options={places.map((p) => ({ value: p.name, label: p.name }))}
                            value={stop ? { value: stop, label: stop } : null}
                            onChange={(selected) => updateStop(index, selected.value)}
                            placeholder="Select Extra Stop"
                            isSearchable
                          />
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          className="mb-2"
                          onClick={() => removeStop(index)}
                        >
                          x
                        </Button>
                      </Col>
                    ))}






                  </Row>

                  {/* Row 2: Pick Up Date | Return Date | Passengers | Pick Up Time */}
                  <Row className="justify-content-center g-3">
                    {/* Pick Up Date */}
                    <Col lg={3} md={6} className="booking-field">
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

                    {/* Return Date */}
                    <Col lg={3} md={6} className="booking-field">
                      <Form.Label className="booking-label">Return Date</Form.Label>
                      <Form.Control
                        className="booking-input"
                        type="date"
                        value={form.returnDate || ""}
                        min={form.date || new Date().toISOString().split("T")[0]}
                        onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                      />
                    </Col>

                    {/* Members */}
                    <Col lg={2} md={6} className="booking-field">
                      <Form.Label className="booking-label">Members</Form.Label>
                      <Form.Control
                        className="booking-input"
                        placeholder="Members Count"
                        name="passengerCount"
                        value={form.passengerCount}
                        onChange={handleChange}
                        type="number"
                        min="1"
                        max={form.selectedCabType?.seats || 10}
                        required
                      />
                    </Col>

                    {/* Pick Up Time */}
                    <Col lg={2} md={6} className="booking-field">
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
                  <div className="d-flex justify-content-center mt-3">
                    <Button type="submit" className="book-btn">
                      Book Now
                    </Button>
                  </div>
                </Form>
              </Card>
            </Col>
          </Row>

          {/* Booking Form for small screens (stacked, no overlay) */}
          <Row className="d-block d-md-none">
            <Col xs={12} className="mb-3 px-3">
              <Card className="shadow" style={{ borderRadius: "10px" }}>
                <Card.Body>
                  {/**
                  <div className="mb-2 text-center">
                    <Nav activeKey={tripType} className="justify-content-center">
                      <Nav.Item>
                        <Nav.Link eventKey="oneway" onClick={() => setTripType("oneway")}>ONE WAY</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="round" onClick={() => setTripType("round")}>ROUND TRIP</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="local" onClick={() => setTripType("local")}>LOCAL</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="airport" onClick={() => setTripType("airport")}>AIRPORT</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </div>
                  */}

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      {/* {isAirport && (
                        <Col xs={12} className="mb-2">
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
                      )} */}

                      <Col xs={12} className="mb-2">
                        <Form.Label className="booking-label mb-1">From</Form.Label>
                        <Select
                          classNamePrefix="rs"
                          className="booking-select"
                          options={places.map((p) => ({ value: p.name, label: p.name }))}
                          value={form.pickup ? { value: form.pickup, label: form.pickup } : null}
                          onChange={(selected) => setForm({ ...form, pickup: selected.value })}
                          placeholder="Select Pickup Location"
                          isSearchable
                        />
                      </Col>
                      <Col xs={12} className="mb-2">
                        <Form.Label className="booking-label">To</Form.Label>
                        <Select
                          classNamePrefix="rs"
                          className="booking-select"
                          options={places.map((p) => ({ value: p.name, label: p.name }))}
                          value={form.drop ? { value: form.drop, label: form.drop } : null}
                          onChange={(selected) => setForm({ ...form, drop: selected.value })}
                          placeholder="Select Drop Location"
                          isSearchable
                        />
                      </Col>
                      {/* Extra Stops - only visible in round trip */}
                      {extraStops.map((stop, index) => (
                        <Form.Group key={index} className="mb-2 booking-field d-flex align-items-end">
                          <div style={{ flexGrow: 1 }}>
                            <Form.Label className="booking-label">Stop {index + 1}</Form.Label>
                            <Select
                              classNamePrefix="rs"
                              className="booking-select booking-field"
                              options={places.map((p) => ({ value: p.name, label: p.name }))}
                              value={stop ? { value: stop, label: stop } : null}
                              onChange={(selected) => updateStop(index, selected.value)}
                              placeholder="Select Extra Stop"
                              isSearchable
                            />
                          </div>
                          <Button
                            variant="danger"
                            size="sm"
                            className="ms-2 mb-1"
                            onClick={() => removeStop(index)}
                          >
                            x
                          </Button>
                        </Form.Group>
                      ))}

                      {/* Add Stop button */}

                      <div className="text-center mb-3">
                        <Button variant="outline-primary" size="sm" onClick={addStop}>
                          +
                        </Button>
                      </div>

                      <Col xs={12} className="mb-2">
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


                      <Col xs={12} className="mb-2">
                        <Form.Label className="booking-label">Return Date</Form.Label>
                        <Form.Control
                          className="booking-input"
                          type="date"
                          value={form.returnDate || ""}
                          min={form.date || new Date().toISOString().split("T")[0]}
                          onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                        />
                      </Col>


                      <Col xs={12} className="mb-2">
                        <Form.Label className="booking-label">Cab Type</Form.Label>
                        <Form.Select
                          className="booking-input"
                          name="vehicle"
                          value={form.vehicle}
                          onChange={(e) => {
                            const selected = cabTypes.find((c) => c._id === e.target.value);
                            setForm((prev) => ({
                              ...prev,
                              vehicle: e.target.value,
                              selectedCabType: selected || null,
                            }));
                          }}
                          required
                        >
                          <option value="">-- Select a Cab Type --</option>
                          {cabTypes.map((cab) => (
                            <option key={cab._id} value={cab._id}>
                              {cab.name}{cab.seats ? ` (Seats: ${cab.seats})` : ""}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>

                      <Col xs={12} className="mb-2">
                        <Form.Label className="booking-label">Passengers</Form.Label>
                        <Form.Control
                          className="booking-input"
                          placeholder="Passenger Count"
                          name="passengerCount"
                          value={form.passengerCount}
                          onChange={handleChange}
                          type="number"
                          min="1"
                          max={form.selectedCabType?.seats || 10}
                          required
                        />
                      </Col>
                      <Col xs={12} className="mb-2">
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

                      <Col xs={12}>
                        <div className="d-grid">
                          <Button type="submit" className="book-btn">
                            Book Now
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>


        {/* Error and Loading States */}
        {loading && (
          <Row className="" style={{ marginTop: "250px" }}>
            <Col>
              <Alert variant="info">Loading cab types...</Alert>
            </Col>
          </Row>
        )}

        {error && (
          <Row className="">
            <Col>
              <Alert variant="danger">{error}</Alert>
            </Col>
          </Row>
        )}

        {message && (
          <Row className="" style={{ marginTop: "250px" }}>
            <Col>
              <Alert variant={message.includes("✅") ? "success" : "danger"}>
                {message}
              </Alert>
            </Col>
          </Row>
        )}



        {/* Recent Bookings */}

        <Container className="px-3 px-md-4" style={{ marginTop: "200px" }}>
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
                  {/* <th>Trip Type</th> */}
                  <th>Cab Type</th>
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
                    {/* <td>
                      {b.tripType === "airport"
                        ? `Airport (${b.airportTripType})`
                        : b.tripType}
                    </td> */}
                    <td>
                      {b.cabType
                        ? `${b.cabType.name || ''}`
                        : b.vehicle
                          ? `${b.vehicle.model || b.vehicle.name || ''} (${b.vehicle.type || ''})`
                          : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Container>


        


        {/* Cab Type Preview List */}
        <h5 className=" fw-bold text-center" style={{ fontSize: "2rem", marginTop: "150px" }}>Available Cab Types</h5>

        <Container className="px-3 px-md-4 mt-3 ">
          <Row className="g-3 justify-content-center cabtype-grid">
            {cabTypes.map(cab => (
              <Col key={cab._id} xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
                <Card className="h-100 shadow-sm cabtype-card" onClick={() => handleViewVehicles(cab.name)} style={{ cursor: 'pointer' }}>
                  <div className="cabtype-card-imgwrap">
                    <Card.Img className="cabtype-card-img" variant="top" src={`${SERVER_URL}/uploads/${cab.image}`} />
                  </div>
                  <Card.Body>
                    <Card.Title className="cabtype-card-title">{cab.name}</Card.Title>
                    <Card.Text className="cabtype-card-text" style={{ minHeight: '8px' }}>{cab.description}</Card.Text>
                    <small className="cabtype-card-meta">Seats: {cab.seats}</small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>

        {/* Trip Types */}
        <div className="text-center" style={{ marginTop: "50px" }}>
          <h1 className="fw-bold mb-3">STATES</h1>
          <Row className="g-3 m-2 justify-content-center triptype-grid">
            <Col md={3} sm={6} xs={12}>
              <Card className="trip-card shadow ">
                <Card.Img className="trip-card-img" variant="top" src={local} alt="Local trips" />
                <Card.Body>
                  <Card.Title>KERALA</Card.Title>
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
                  <Card.Title>TAMILNADU</Card.Title>
                  <Card.Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} xs={12}>
              <Card className="trip-card shadow ">
                <Card.Img className="trip-card-img" variant="top" src={oneway} alt="One-way trips" />
                <Card.Body>
                  <Card.Title>KARNATAKA</Card.Title>
                  <Card.Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            {/* <Col md={3} sm={6} xs={12}>
              <Card className="trip-card shadow">
                <Card.Img className="trip-card-img" variant="top" src={airport} alt="Airport trips" />
                <Card.Body>
                  <Card.Title>AIRPORT TRIPS</Card.Title>
                  <Card.Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</Card.Text>
                </Card.Body>
              </Card>
            </Col> */}
          </Row>
        </div>


      </Container>
    </div>
  );
};

export default Home;