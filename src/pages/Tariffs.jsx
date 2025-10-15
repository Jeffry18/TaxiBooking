import React, { useEffect, useState } from "react";
import { Table, Button, Container, Col, Row, Card, Badge, Form } from "react-bootstrap";
import axios from "axios";
import SERVER_URL from "../services/serverURL"; // make sure this points to your backend
import { FaCar, FaUsers, FaClock, FaRoad } from "react-icons/fa"; // Icons


const Tariff = () => {
  const [tariff, setTariff] = useState([]);
  const [cities, setCities] = useState([]);
  const [cityTariffs, setCityTariffs] = useState([]);
  const [selectedCityName, setSelectedCityName] = useState("");
  const [filteredCityTariffs, setFilteredCityTariffs] = useState([]);

  // Fetch tariffs from backend
  const fetchTariffs = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/tariff`);
      setTariff(res.data);
    } catch (err) {
      console.error("Error fetching tariffs:", err);
    }
  };

  useEffect(() => {
    fetchTariffs();
    fetchCities();
    fetchCityTariffs();
  }, []);

  // Fetch list of cities for selection
  const fetchCities = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/cities`);
      setCities(res.data || []);
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  // Fetch all city tariffs
  const fetchCityTariffs = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/cityTariff`);
      setCityTariffs(res.data || []);
    } catch (err) {
      console.error("Error fetching city tariffs:", err);
    }
  };

  // Update filteredCityTariffs when selected city changes
  useEffect(() => {
    if (!selectedCityName) {
      setFilteredCityTariffs([]);
      return;
    }

    // Find city object by name (case-insensitive)
    const cityObj = cities.find(c => c.name && c.name.toLowerCase() === selectedCityName.toLowerCase());

    const filtered = cityTariffs.filter(t => {
      // t.city may be id or populated object or name
      if (!t.city) return false;
      if (cityObj && (t.city === cityObj._id || (t.city._id && t.city._id === cityObj._id))) return true;
      if (typeof t.city === 'string' && t.city.toLowerCase() === selectedCityName.toLowerCase()) return true;
      if (t.city.name && t.city.name.toLowerCase() === selectedCityName.toLowerCase()) return true;
      return false;
    });

    setFilteredCityTariffs(filtered);
  }, [selectedCityName, cities, cityTariffs]);


  

  return (
    
    <Container className="" style={{ marginTop: "150px" }}>
        <h2 className="fw-bold text-center" style={{ color: "#0d6efd" }}>
        Kerala Taxi Tariffs
      </h2>
      <p className="text-secondary mb-5 text-center" style={{ fontSize: "1.2rem" }}>
        Transparent and affordable rates for your journey across God's Own Country.
        Our <br />packages include different itineraries and vehicle options with no hidden costs.
      </p>

      <Row className="text-center">
        <Col xs={6} md={3} className="mb-4">
          <div className="d-flex flex-column align-items-center">
            <div className="bg-light rounded-circle p-3 mb-2">
              <FaCar size={24} color="#0d6efd" />
            </div>
            <h6 className="fw-bold">Multiple Vehicles</h6>
            <small className="text-muted">Sedan to Tempo Traveller</small>
          </div>
        </Col>

        <Col xs={6} md={3} className="mb-4">
          <div className="d-flex flex-column align-items-center">
            <div className="bg-light rounded-circle p-3 mb-2">
              <FaUsers size={24} color="#0d6efd" />
            </div>
            <h6 className="fw-bold">All Group Sizes</h6>
            <small className="text-muted">3 to 26 passengers</small>
          </div>
        </Col>

        <Col xs={6} md={3} className="mb-4">
          <div className="d-flex flex-column align-items-center">
            <div className="bg-light rounded-circle p-3 mb-2">
              <FaClock size={24} color="#0d6efd" />
            </div>
            <h6 className="fw-bold">Daily & Package</h6>
            <small className="text-muted">Flexible booking options</small>
          </div>
        </Col>

        <Col xs={6} md={3} className="mb-4">
          <div className="d-flex flex-column align-items-center">
            <div className="bg-light rounded-circle p-3 mb-2">
              <FaRoad size={24} color="#0d6efd" />
            </div>
            <h6 className="fw-bold">80 KM Included</h6>
            <small className="text-muted">Per day allowance</small>
          </div>
        </Col>
      </Row>

      {/* tariff Table */}
      <Card className="shadow-sm mb-5 mt-5">
      <Card.Body>
        <Card.Title className="mb-5 text-center fw-bold">Daily Rates With Driver <br /><span className="text-muted" style={{ fontSize: '0.9rem' }}>All rates include driver allowance and vehicle maintenance</span></Card.Title>
        <Table borderless hover responsive className="text-center align-middle">
          <thead className="table-light ">
            <tr>
              <th>Cab Type</th>
              <th>Seats</th>
              <th>Rate/day</th>
              <th>Allowed Km</th>
              <th>Extra Km Rate</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {tariff.length > 0 ? (
              tariff.map((t) => (
                <tr key={t._id} className="table-hover-custom">
                  <td>{t.cabType}</td>
                  <td><Badge
                      bg="light"
                      text="Black"
                      style={{ fontSize: '0.9rem', padding: '5px 10px', borderRadius: '12px' }}
                    >
                      {t.seats} persons
                    </Badge></td>
                  <td className="text-primary">{t.rate}</td>
                  <td>{t.allowedKm}</td>
                  <td>{t.extraKmRate}</td>
                  <td>{t.details}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No tariffs found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
    
    {/* City-specific Tariffs */}
    <Card className="shadow-sm mb-5">
      <Card.Body>
        <Card.Title className="mb-4 text-center fw-bold">City Tariffs</Card.Title>

        <Row className="mb-3 ">
          <Col xs={12} md={6} lg={4}>
            <Form.Group controlId="citySelect">
              <Form.Label className="fw-bold ms-2">Search / Select City</Form.Label>
              <Form.Control
                list="cities-list"
                placeholder="Type to search city..."
                value={selectedCityName}
                onChange={(e) => setSelectedCityName(e.target.value)}
              />
              <datalist id="cities-list">
                {cities.map((c) => (
                  <option key={c._id} value={c.name} />
                ))}
              </datalist>
            </Form.Group>
          </Col>
        </Row>

        <Table borderless hover responsive className="text-center align-middle">
          <thead className="table-light ">
            <tr>
              <th>City</th>
              <th>Cab Type</th>
              <th>Seats</th>
              <th>Rate/day</th>
              <th>Allowed Km</th>
              <th>Extra Km Rate</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {selectedCityName ? (
              filteredCityTariffs.length > 0 ? (
                filteredCityTariffs.map((t) => (
                  <tr key={t._id} className="table-hover-custom">
                    <td>{(typeof t.city === 'string') ? (cities.find(c => c._id === t.city)?.name || t.city) : (t.city?.name || selectedCityName)}</td>
                    <td>{t.cabType}</td>
                    <td><Badge bg="light" text="Black" style={{ fontSize: '0.9rem', padding: '5px 10px', borderRadius: '12px' }}>{t.seats} persons</Badge></td>
                    <td className="text-primary">{t.ratePerDay || t.rate}</td>
                    <td>{t.allowedKm}</td>
                    <td>{t.extraKmRate}</td>
                    <td>{t.details}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center">No tariffs found for "{selectedCityName}".</td>
                </tr>
              )
            ) : (
              <tr>
                <td colSpan={7} className="text-center">Please select a city to view city-specific tariffs.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
      
    </Container>
  );
};

export default Tariff;
