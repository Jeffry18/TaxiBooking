import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Card, Alert, Nav, Table, Spinner, Carousel, CardTitle } from "react-bootstrap";
import SERVER_URL from "../services/serverURL";
import '../App.css'
import Select from 'react-select';
import defaultVehicleImage from '../assets/default-vehicle.jpg';
import HomeCarousel from "../components/Carousel";
import local from '../assets/local.jpg';
import round from '../assets/round.jpg';
import airport from '../assets/airport.jpg';
import oneway from '../assets/oneway.jpg';
import innova from '../assets/innova-crysta.jpg'
import { Link, useNavigate } from "react-router-dom";

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
    email: "",
    extraStops: [],
    date: "",
    returnDate: "",
    time: "",
    vehicleType: "",
    passengerCount: "",
    phoneNumber: "", // Add this line
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
  const [states, setStates] = useState([])

  const keralaAirports = [
    { value: "COK", label: "Cochin International Airport (COK)" },
    { value: "TRV", label: "Trivandrum International Airport (TRV)" },
    { value: "CCJ", label: "Calicut International Airport (CCJ)" },
    { value: "CNN", label: "Kannur International Airport (CNN)" },
  ];

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/places/kerala-places`);
        setPlaces(res.data); // store in state
      } catch (err) {
        console.error("Error loading places:", err);
      }
    };
    fetchPlaces();

    // const fetchRecentBookings = async () => {
    //   try {
    //     const token = sessionStorage.getItem("token");
    //     if (!token) return;

    //     const res = await axios.get(`${SERVER_URL}/bookings`, {
    //       headers: { Authorization: `Bearer ${token}` },
    //     });
    //     const list = Array.isArray(res.data) ? res.data : [];
    //     const top5 = list
    //       .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))
    //       .slice(0, 5);
    //     setRecent(top5);
    //   } catch (err) {
    //     console.error("Error fetching recent bookings:", err);
    //   }
    // };
    // fetchRecentBookings();

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

    const fetchStates = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/states`);
        setStates(Array.isArray(res.data) ? res.data : []);
      } catch {
        console.error("Failed to fetch states:", err);
        setStates([]);
      }
    };
    fetchStates();

  }, []);

  const addStop = () => {
    if (extraStops.length < 3) {
      setExtraStops([...extraStops, ""]);
    } else {
      alert("You can add a maximum of 3 stops.");
    }
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

  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState('success');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {






      if (!form.vehicle) {
        setAlertVariant('danger');
        setMessage("Please select a cab type");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        return;
      }

      const bookingData = {
        cabType: form.vehicle,
        pickup: form.pickup,
        drop: form.drop,
        email: form.email || "",
        extraStops: extraStops.filter(s => s.trim() !== "") || [], // ✅ include extra stops
        date: form.date,
        returnDate: form.returnDate,
        time: form.time,
        passengerCount: parseInt(form.passengerCount) || 1,
        phoneNumber: form.phoneNumber,
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

      const response = await axios.post(`${SERVER_URL}/bookings`, bookingData)
      if (response.data) {
        setAlertVariant('success');
        setMessage("✅ Booking successful!");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);

        // Reset form and update bookings
        setForm({
          vehicle: "",
          pickup: "",
          drop: "",
          email: "",
          extraStops: [],
          date: "",
          returnDate: "",
          time: "",
          vehicleType: "",
          passengerCount: "",
          phoneNumber: "",
        });

        // refresh bookings after new booking
        //   const res = await axios.get(`${SERVER_URL}/bookings`);
        //   const list = Array.isArray(res.data) ? res.data : [];
        //   const top5 = list
        //     .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))
        //     .slice(0, 5);
        //   setRecent(top5);

      }
    } catch (err) {
      console.error("Booking failed:", err);
      setAlertVariant('danger');
      setMessage(`❌ ${err.response?.data?.message || "Booking failed. Please try again"}`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  // const isAirport = tripType === "airport";
  // const isRound = tripType === "round";
  const row1Cols = 4;
  const row1Lg = 12 / row1Cols;
  const row2Cols = 4;
  const row2Lg = 12 / row2Cols;

  const token = sessionStorage.getItem("token");


  return (
    <div>

      <Container fluid className="" style={{ width: "100%", minHeight: "100vh", paddingTop: "70px", paddingRight: "0px", paddingLeft: "0px" }}>

        <div style={{ position: "relative", width: "100%" }}>
          {/* Banner Carousel */}
          <HomeCarousel />

          {/* Enhanced Booking Form for large screens (overlay) */}
          <Row className="d-none d-md-block">
            <Col md={12} className="mb-4">
              <Card className="booking-form-card shadow-lg"
                style={{
                  position: "absolute",
                  bottom: "-280px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "90%",
                  zIndex: 10,
                }}>

                <div>
                  <h2 className="booking-heading">BOOK YOUR TRIP</h2>
                </div>

                <Form onSubmit={handleSubmit}>
                  {/* Row 1: Location Fields + Add Stop Button */}
                  <Row className="booking-row align-items-end mb-3">
                    <Col lg={3} md={6} className="booking-field">
                      <Form.Label className="booking-label">From</Form.Label>
                      <Select
                        classNamePrefix="rs"
                        className="booking-select"
                        options={places.map((p) => ({ value: p.name, label: p.name }))}
                        value={form.pickup ? { value: form.pickup, label: form.pickup } : null}
                        onChange={(selected) => setForm({ ...form, pickup: selected.value })}
                        placeholder="Select pickup location"
                        isSearchable
                      />
                    </Col>

                    <Col lg={3} md={6} className="booking-field">
                      <Form.Label className="booking-label">To</Form.Label>
                      <Select
                        classNamePrefix="rs"
                        className="booking-select"
                        options={places.map((p) => ({ value: p.name, label: p.name }))}
                        value={form.drop ? { value: form.drop, label: form.drop } : null}
                        onChange={(selected) => setForm({ ...form, drop: selected.value })}
                        placeholder="Select destination"
                        isSearchable
                      />
                    </Col>

                    <Col lg={2} md={6} className="booking-field">
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
                        <option value="">Select cab type</option>
                        {cabTypes.map((cab) => (
                          <option key={cab._id} value={cab._id}>
                            {cab.name}{cab.seats ? ` (${cab.seats} seats)` : ""}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>

                    {/* Desktop view - after cab type field */}
                    <Col lg={2} md={6} className="booking-field">
                      <Form.Label className="booking-label">Phone Number</Form.Label>
                      <Form.Control
                        className="booking-input"
                        type="tel"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        pattern="[0-9]{10}"
                        required
                      />
                    </Col>


                    <Col lg={3} md={6} className="d-flex align-items-end justify-content-center">
                      <Button
                        className="add-stop-btn"
                        onClick={addStop}
                        title="Add extra stop"
                      >
                        +
                      </Button>
                    </Col>
                  </Row>

                  {/* Extra Stops Row */}
                  {extraStops.length > 0 && (
                    <Row className="booking-row mb-3">
                      {extraStops.map((stop, index) => (
                        <Col key={index} lg={3} md={6} className="booking-field">
                          <div className="d-flex align-items-end">
                            <div style={{ flexGrow: 1 }}>
                              <Form.Label className="booking-label">Stop {index + 1}</Form.Label>
                              <Select
                                classNamePrefix="rs"
                                className="booking-select"
                                options={places.map((p) => ({ value: p.name, label: p.name }))}
                                value={stop ? { value: stop, label: stop } : null}
                                onChange={(selected) => updateStop(index, selected.value)}
                                placeholder="Select extra stop"
                                isSearchable
                              />
                            </div>
                            <Button
                              className="remove-stop-btn"
                              onClick={() => removeStop(index)}
                              title="Remove stop"
                            >
                              ×
                            </Button>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  )}

                  {/* Row 2: Date, Time and Passenger Details */}
                  <Row className="booking-row">
                    <Col lg={3} md={6} className="booking-field">
                      <Form.Label className="booking-label">Pick Up Date</Form.Label>
                      <Form.Control
                        className="booking-input"
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                      required
                      />
                    </Col>

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

                    <Col lg={2} md={6} className="booking-field">
                      <Form.Label className="booking-label">Passengers</Form.Label>
                      <Form.Control
                        className="booking-input"
                        placeholder="Count"
                        name="passengerCount"
                        value={form.passengerCount}
                        onChange={handleChange}
                        type="number"
                        min="1"
                        max={form.selectedCabType?.seats || 10}
                        required
                      />
                    </Col>

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

                  {/* Submit Button Row - Centered */}
                  <Row className="mt-3">
                    <Col xs={12} className="text-center">
                      <Button type="submit" className="book-btn">
                        Enquire
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>

          {/* Enhanced Booking Form for small screens (stacked, no overlay) */}
          <Row className="d-block d-md-none">
            <Col xs={12} className="mb-3 px-3">
              <Card className="booking-form-card shadow-lg">
                <div>
                  <h2 className="booking-heading">BOOK YOUR TRIP</h2>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col xs={12} className="booking-field">
                      <Form.Label className="booking-label">From</Form.Label>
                      <Select
                        classNamePrefix="rs"
                        className="booking-select"
                        options={places.map((p) => ({ value: p.name, label: p.name }))}
                        value={form.pickup ? { value: form.pickup, label: form.pickup } : null}
                        onChange={(selected) => setForm({ ...form, pickup: selected.value })}
                        placeholder="Select pickup location"
                        isSearchable
                      />
                    </Col>

                    <Col xs={12} className="booking-field">
                      <Form.Label className="booking-label">To</Form.Label>
                      <Select
                        classNamePrefix="rs"
                        className="booking-select"
                        options={places.map((p) => ({ value: p.name, label: p.name }))}
                        value={form.drop ? { value: form.drop, label: form.drop } : null}
                        onChange={(selected) => setForm({ ...form, drop: selected.value })}
                        placeholder="Select destination"
                        isSearchable
                      />
                    </Col>

                    {/* Extra Stops for mobile */}
                    {extraStops.map((stop, index) => (
                      <Col key={index} xs={12} className="booking-field">
                        <div className="d-flex align-items-end">
                          <div style={{ flexGrow: 1 }}>
                            <Form.Label className="booking-label">Stop {index + 1}</Form.Label>
                            <Select
                              classNamePrefix="rs"
                              className="booking-select"
                              options={places.map((p) => ({ value: p.name, label: p.name }))}
                              value={stop ? { value: stop, label: stop } : null}
                              onChange={(selected) => updateStop(index, selected.value)}
                              placeholder="Select extra stop"
                              isSearchable
                            />
                          </div>
                          <Button
                            className="remove-stop-btn"
                            onClick={() => removeStop(index)}
                            title="Remove stop"
                          >
                            ×
                          </Button>
                        </div>
                      </Col>
                    ))}

                    {/* Add Stop button for mobile */}
                    <Col xs={12} className="text-center mb-3">
                      <Button
                        className="add-stop-btn"
                        onClick={addStop}
                        title="Add extra stop"
                      >
                        + Add Stop
                      </Button>
                    </Col>

                    <Col xs={12} className="booking-field">
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

                    <Col xs={12} className="booking-field">
                      <Form.Label className="booking-label">Return Date</Form.Label>
                      <Form.Control
                        className="booking-input"
                        type="date"
                        value={form.returnDate || ""}
                        min={form.date || new Date().toISOString().split("T")[0]}
                        onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                      />
                    </Col>

                    <Col xs={12} className="booking-field">
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
                        <option value="">Select cab type</option>
                        {cabTypes.map((cab) => (
                          <option key={cab._id} value={cab._id}>
                            {cab.name}{cab.seats ? ` (${cab.seats} seats)` : ""}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>

                    {/* Mobile view - after cab type field */}
                    <Col xs={12} className="booking-field">
                      <Form.Label className="booking-label">Phone Number</Form.Label>
                      <Form.Control
                        className="booking-input"
                        type="tel"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        pattern="[0-9]{10}"
                        required
                      />
                    </Col>

                    <Col xs={6} className="booking-field">
                      <Form.Label className="booking-label">Passengers</Form.Label>
                      <Form.Control
                        className="booking-input"
                        placeholder="Count"
                        name="passengerCount"
                        value={form.passengerCount}
                        onChange={handleChange}
                        type="number"
                        min="1"
                        max={form.selectedCabType?.seats || 10}
                        required
                      />
                    </Col>

                    <Col xs={6} className="booking-field">
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

                    <Col xs={12} className="text-center">
                      <Button type="submit" className="book-btn">
                        Enquire
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>


        

        {showAlert && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            minWidth: '300px'
          }}>
            <Alert
              variant={alertVariant}
              onClose={() => setShowAlert(false)}
              dismissible
            >
              {message}
            </Alert>
          </div>
        )}

        {/* Recent Bookings */}

        {/* {token ? (  // Only render if token exists
      <Container className="px-3 px-md-4" style={{ marginTop: "300px" }}>
        <h4 className="fw-bold text-center">Your Recent Enquires</h4>

        {loading && (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && recent.length === 0 && (
          <p className="text-center text-muted">No recent Enquires found.</p>
        )}

        {!loading && recent.length > 0 && (
          <Table striped bordered hover responsive className="text-center mt-2">
            <thead className="table-dark">
              <tr>
                <th>Pickup</th>
                <th>Drop</th>
                <th>Date</th>
                <th>Return Date</th>
                <th>Time</th>
                <th>Passengers</th>
                <th>Cab Type</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((b) => (
                <tr key={b._id}>
                  <td>{b.pickup}</td>
                  <td>{b.drop}</td>
                  <td>{b.date ? new Date(b.date).toLocaleDateString() : "-"}</td>
                  <td>{b.returnDate ? new Date(b.returnDate).toLocaleDateString() : "-"}</td>
                  <td>{b.time}</td>
                  <td>{b.passengerCount}</td>
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
    ) : (

      <p className="text-center" style={{ marginTop: "300px" }}>Please log in to see your recent Enquires.</p>
    )} */}






        {/* Cab Type Preview List */}
        <h5 className=" fw-bold text-center cab-heading" >Available Cab Types</h5>
        
        {/* Error and Loading States */}
        {loading && (
          <Row className="" style={{ marginTop: "320px" }}>
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

        {/* States */}
        <div className="text-center" style={{ marginTop: "50px" }}>
          <h1 className="fw-bold mb-3">STATES</h1>
          <Row className="g-3 m-2 justify-content-center state-grid">
            {states.length > 0 ? (
              states.map((state) => (
                <Col key={state._id} md={3} sm={6} xs={12}>
                  <Link
                    to={`/viewstate/${state._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Card className="state-card shadow h-100">
                      <Card.Img
                        className="state-card-img"
                        variant="top"
                        src={`${SERVER_URL}/uploads/${state.image}`}
                        alt={state.name}
                        style={{
                          height: "180px",
                          objectFit: "cover",
                        }}
                      />
                      <Card.Body className="d-flex flex-column text-center">
                        <Card.Title className="fw-bold">{state.name}</Card.Title>
                        <Card.Text className="flex-grow-1 ">{state.description}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ))
            ) : (
              <p>No states available</p>
            )}
          </Row>

        </div>

        {/* Default Data */}
        <div className="container mt-5">
          <Row className="align-items-center">
            {/* Left side - Car Image */}
            <Col md={6} className=" justify-content-center">
              <Card
                className="shadow-sm"
                style={{ width: '100%', maxWidth: '600px', border: 'none' }}
              >
                <Card.Img
                  variant="top"
                  src={innova}
                  style={{ height: '400px', objectFit: 'contain' }}
                />
              </Card>

              <div>
                <h1 className="mt-2 fw-bold" style={{ fontSize: '35px' }}>We Are Trusted Name in Car Renting Services</h1>
                <p className="text-muted">Taxi Services - Discover the beauty of Kerala with our expertly curated tour packages. From tranquil backwaters to vibrant cities and exciting wildlife encounters, our itineraries offer a diverse range of experiences. Whether you're seeking a pre-planned adventure or a personalized journey, our dedicated team will ensure a hassle-free trip filled with unforgettable memories. Book your Kerala taxi service today and embark on a magical exploration of God's Own Country.</p>
              </div>

              <button className="rounded bg-primary text-white fw-bold" style={{ width: '150px', height: '40px' }}>Enquire Now</button>


            </Col>

            {/* Right side - Contact + Features */}
            <Col md={6}>
              {/* Contact Info */}
              <div className="text-center mb-4">
                <h5 className="fw-bold mt-5">CALL US OR CHAT WITH US ON WHATSAPP</h5>
                <h4 className="text-primary fw-bold">+91 8089084080</h4>
              </div>

              {/* Features Grid */}
              <Row className="g-3">
                <Col xs={12} md={6}>
                  <Card className="h-100 text-center p-3 border-0 feature-card">
                    <div className="mb-2 text-primary fs-2">
                      <i className="fa-regular fa-circle-check"></i>
                    </div>
                    <Card.Title style={{ fontSize: '18px' }}>Government Accredited</Card.Title>
                    <Card.Text className="text-muted">
                      Kerala Tourism certified tour operator
                    </Card.Text>
                  </Card>
                </Col>

                <Col xs={12} md={6}>
                  <Card className="h-100 text-center p-3 border-0 feature-card">
                    <div className="mb-2 text-primary fs-2">
                      <i className="fa-regular fa-clock"></i>
                    </div>
                    <Card.Title style={{ fontSize: '18px' }}>25 Years Experience</Card.Title>
                    <Card.Text className="text-muted">
                      Trusted taxi services since 1999
                    </Card.Text>
                  </Card>
                </Col>

                <Col xs={12} md={6}>
                  <Card className="h-100 text-center p-3 border-0 feature-card">
                    <div className="mb-2 text-primary fs-2">
                      <i className="fa-solid fa-shield"></i>
                    </div>
                    <Card.Title style={{ fontSize: '18px' }}>Safe & Reliable</Card.Title>
                    <Card.Text className="text-muted">
                      Well-maintained vehicles and experienced drivers
                    </Card.Text>
                  </Card>
                </Col>

                <Col xs={12} md={6}>
                  <Card className="h-100 text-center p-3 border-0 feature-card">
                    <div className="mb-2 text-primary fs-2">
                      <i className="fa-solid fa-award"></i>
                    </div>
                    <Card.Title style={{ fontSize: '18px' }}>Best Service</Card.Title>
                    <Card.Text className="text-muted">
                      Customer satisfaction guaranteed
                    </Card.Text>
                  </Card>
                </Col>
              </Row>


              <div className="container mt-4">
                <div className="p-4 rounded shadow-sm bg-light">
                  {/* Heading */}
                  <h5 className="fw-bold" style={{ fontSize: '20px' }}>
                    Taxi Services - Ideal Travel Experience Through Personalized Taxi Packages
                  </h5>

                  {/* Description */}
                  <p className="mt-4 text-muted" style={{ fontSize: '15px' }}>
                    <span className="fw-bold">Taxi Services – FlyMallu.com</span> offers personalized taxi services
                    for exploring Kerala's vibrant cities and serene landscapes. From the bustling streets of Kochi
                    and Trivandrum to the natural beauty of Munnar, Thekkady, Kumarakom, Alleppey, and Wayanad, our
                    tailored packages cater to your unique travel desires.
                  </p>

                  {/* City Buttons */}
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <span className="badge bg-light text-dark border rounded-pill px-3 py-2">Munnar</span>
                    <span className="badge bg-light text-dark border rounded-pill px-3 py-2">Thekkady</span>
                    <span className="badge bg-light text-dark border rounded-pill px-3 py-2">Kumarakom</span>
                    <span className="badge bg-light text-dark border rounded-pill px-3 py-2">Alleppey</span>
                    <span className="badge bg-light text-dark border rounded-pill px-3 py-2">Wayanad</span>
                    <span className="badge bg-light text-dark border rounded-pill px-3 py-2">Kochi</span>
                    <span className="badge bg-light text-dark border rounded-pill px-3 py-2">Trivandrum</span>
                  </div>
                </div>
              </div>

            </Col>
          </Row>
        </div>

        <div className="container" style={{ marginTop: '100px' }}>
          <Row className="align-items-center">
            {/* Left Column - Text */}
            <Col md={7}>
              <h2 className=" mb-4" style={{ fontFamily: "inherit", fontSize: '25px', fontWeight: '850' }}>FlyMallu is your one stop solution</h2>
              <h5 className="text-primary mt-2">Tired of searching Taxi services nearby</h5>
              <h6 className="fw-bold mt-4">FlyMallu.com - Your Key to a Hassle-Free</h6>
              <p className="text-muted mt-3">
                FlyMallu.com provides reliable and convenient taxi services for all your travel needs
                in Kerala, 24 hours a day, 7 days a week. Whether you're planning a quick city tour
                or an extended exploration across the state, our taxi rentals are the perfect solution.
                Our user-friendly booking system makes hiring a taxi a breeze, taking the stress out of
                transportation planning. This allows you to focus on what truly matters: immersing
                yourself in Kerala's vibrant cities, breathtaking landscapes, and rich cultural experiences.
              </p>
            </Col>

            {/* Right Column - Image Card */}
            <Col md={5} className="text-center">
              <Card className="shadow-sm border-0">
                <Card.Img
                  variant="top"
                  src={innova}
                  style={{ height: "300px", objectFit: "cover" }}
                />

              </Card>
              <h4 className="mt-2">Taxi Services</h4>
            </Col>
          </Row>
        </div>




      </Container>
    </div>
  );
};

export default Home;