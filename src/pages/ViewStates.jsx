import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Modal, Button, Spinner } from "react-bootstrap";
import SERVER_URL from "../services/serverURL";

export default function ViewStates() {
    const { id } = useParams(); // state id
    const [state, setState] = useState(null);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [places, setPlaces] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loadingState, setLoadingState] = useState(true);
    const [loadingCities, setLoadingCities] = useState(true);
    const [loadingPlaces, setLoadingPlaces] = useState(false);

    // Fetch state details
    useEffect(() => {
        const fetchState = async () => {
            try {
                const res = await axios.get(`${SERVER_URL}/states`);
                const found = res.data.find((s) => s._id === id);
                setState(found || null);
            } catch (err) {
                console.error("Error fetching state:", err);
            } finally {
                setLoadingState(false);
            }
        };
        fetchState();
    }, [id]);

    // Fetch all cities and filter by state name
    // Fetch all cities and filter by stateId
useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/city`);
        if (id) {
          // assuming each city has a field `stateId` referencing the state._id
          const filtered = res.data.filter((c) => c.state === state.name);
          setCities(filtered);
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
      } finally {
        setLoadingCities(false);
      }
    };
  
    fetchCities();
  }, [state]);
  

    // Fetch all places and filter by city name
    const fetchPlaces = async (cityName) => {
        setLoadingPlaces(true);
        try {
            const res = await axios.get(`${SERVER_URL}/place`);
            const filtered = res.data.filter((p) => p.city === cityName);
            setPlaces(filtered);
        } catch (err) {
            console.error("Error fetching places:", err);
        } finally {
            setLoadingPlaces(false);
        }
    };

    // Open city modal
    const handleCityClick = (city) => {
        setSelectedCity(city);
        fetchPlaces(city.name);
        setShowModal(true);
    };

    return (
        <Container fluid style={{ marginTop: "100px" }}>
            {/* State card full width */}
            {loadingState ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : state && (
                <Card className="shadow mb-4">
                    <div style={{ position: "relative" }}>
                        <Card.Img
                            src={`${SERVER_URL}/uploads/${state.image}`}
                            alt={state.name}
                            style={{ width: "100%", height: "400px", objectFit: "cover" }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                bottom: "20px",
                                left: "20px",
                                background: "rgba(0,0,0,0.6)",
                                color: "#fff",
                                padding: "15px",
                                borderRadius: "10px",
                                maxWidth: "70%",
                            }}
                        >
                            <h2 className="fw-bold">{state.name}</h2>
                            <p>{state.description}</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Cities list */}
            <h3 className="fw-bold mb-3 text-center">Cities in {state?.name}</h3>
            {loadingCities ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="secondary" />
                </div>
            ) : (
                <Row className="g-3 justify-content-center">
                    {cities.length > 0 ? (
                        cities.map((city) => (
                            <Col md={3} sm={6} xs={12} key={city._id}>
                                <Card
                                    className="shadow h-100"
                                    onClick={() => handleCityClick(city)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <Card.Img
                                        variant="top"
                                        src={`${SERVER_URL}/uploads/${city.image}`}
                                        alt={city.name}
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                    <Card.Body className="text-center">
                                        <Card.Title className="fw-bold">{city.name}</Card.Title>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p className="text-center">No cities found for this state</p>
                    )}
                </Row>
            )}

            {/* City Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                {selectedCity && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>{selectedCity.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {/* City card */}
                            <Card className="shadow mb-4">
                                <Card.Img
                                    src={`${SERVER_URL}/uploads/${selectedCity.image}`}
                                    alt={selectedCity.name}
                                    style={{ width: "100%", height: "250px", objectFit: "cover" }}
                                />
                                <Card.Body>
                                    <h5 className="fw-bold">{selectedCity.name}</h5>
                                    <p>{selectedCity.description}</p>
                                </Card.Body>
                            </Card>

                            {/* Places list */}
                            <h5 className="fw-bold mb-3 text-center">
                                Places From {selectedCity.name}
                            </h5>
                            {loadingPlaces ? (
                                <div className="text-center my-4">
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            ) : (
                                <Row className="g-3 justify-content-center">
                                    {places.length > 0 ? (
                                        places.map((place) => (
                                            <Col md={4} sm={6} xs={12} key={place._id}>
                                                <Card className="shadow h-100">
                                                    <Card.Img
                                                        variant="top"
                                                        src={`${SERVER_URL}/uploads/${place.image}`}
                                                        alt={place.name}
                                                        style={{ height: "150px", objectFit: "cover" }}
                                                    />
                                                    <Card.Body className="text-center">
                                                        <Card.Title>{place.name}</Card.Title>
                                                        <p className="fw-bold">
                                                            Rate from the City: ₹{place.rate}
                                                        </p>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))
                                    ) : (
                                        <p className="text-center">No places found for this city</p>
                                    )}
                                </Row>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </Container>
    );
}
