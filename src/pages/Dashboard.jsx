import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Form, Row, Col, Card, Nav, Alert, Badge, Modal } from "react-bootstrap";
import SERVER_URL from "../services/serverURL";


export default function AdminPage() {
  const [vehicles, setVehicles] = useState([]);
  const [packages, setPackages] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [trips, setTrips] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newPackage, setNewPackage] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    image: null,
  });
  const [activeTab, setActiveTab] = useState("vehicles");
  const [loading, setLoading] = useState({
    vehicles: true,
    drivers: true,
    packages: true,
    bookings: true,
    trips: true,
  });
  const [error, setError] = useState({
    vehicles: null,
    drivers: null,
    packages: null,
    bookings: null,
    trips: null,
  });
  const [cabTypes, setCabTypes] = useState([]);
  const [newCab, setNewCab] = useState({
    name: "",
    description: "",
    seats: "",
    image: null
  });


  // Fetch data
  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
    fetchPackages();
    fetchBookings();
    fetchTrips();
    fetchCabs();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading((prev) => ({ ...prev, vehicles: true }));
      const res = await axios.get(`${SERVER_URL}/vehicles`);
      setVehicles(Array.isArray(res.data) ? res.data : []);
      setError((prev) => ({ ...prev, vehicles: null }));
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
      setError((prev) => ({
        ...prev,
        vehicles: "Failed to load vehicles. Please try again.",
      }));
      setVehicles([]);
    } finally {
      setLoading((prev) => ({ ...prev, vehicles: false }));
    }
  };

  const fetchDrivers = async () => {
    try {
      setLoading((prev) => ({ ...prev, drivers: true }));
      const res = await axios.get(`${SERVER_URL}/drivers`);
      setDrivers(Array.isArray(res.data) ? res.data : []);
      setError((prev) => ({ ...prev, drivers: null }));
    } catch (err) {
      console.error("Failed to fetch drivers:", err);
      setError((prev) => ({
        ...prev,
        drivers: "Failed to load drivers. Please try again.",
      }));
      setDrivers([]);
    } finally {
      setLoading((prev) => ({ ...prev, drivers: false }));
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/packages`);
      const data = Array.isArray(res.data) ? res.data : [];
      setPackages(data);
    } catch (err) {
      console.error("Failed to fetch packages:", err);
      setPackages([]);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading((prev) => ({ ...prev, bookings: true }));

      const token = sessionStorage.getItem("token")

      const res = await axios.get(`${SERVER_URL}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(Array.isArray(res.data) ? res.data : []);

      setError((prev) => ({ ...prev, bookings: null }));

    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
      setError((prev) => ({
        ...prev,
        bookings: "Failed to load bookings. Please try again.",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, bookings: false }));
    }
  };

  const fetchTrips = async () => {
    try {
      setLoading((prev) => ({ ...prev, trips: true }));
      const res = await axios.get(`${SERVER_URL}/trips`);
      if (res.data.success) {
        setTrips(Array.isArray(res.data.data) ? res.data.data : []);
        setError((prev) => ({ ...prev, trips: null }));
      } else {
        setTrips([]);
        setError((prev) => ({
          ...prev,
          trips: "Failed to load package bookings. Please try again.",
        }));
      }
    } catch (err) {
      console.error("Error fetching trips:", err);
      setTrips([]);
      setError((prev) => ({
        ...prev,
        trips: "Failed to load package bookings. Please try again.",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, trips: false }));
    }
  };

  const fetchCabs = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/cabtypes`);
      setCabTypes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch cab types:", err);
      setCabTypes([]);
    }
  };

  const approveVehicle = async (id) => {
    try {
      await axios.patch(`${SERVER_URL}/vehicles/${id}`, { status: "approved" });
      fetchVehicles();
    } catch (err) {
      console.error("Failed to approve vehicle:", err);
    }
  };

  const unapproveVehicle = async (id) => {
    try {
      await axios.patch(`${SERVER_URL}/vehicles/${id}`, { status: "pending" });
      fetchVehicles();
    } catch (err) {
      console.error("Failed to unapprove vehicle:", err);
    }
  };

  const approveDriver = async (id) => {
    try {
      await axios.patch(`${SERVER_URL}/drivers/${id}`, {
        status: "approved",
      });
      await fetchDrivers();
    } catch (err) {
      console.error("Failed to approve driver:", err);
      setError((prev) => ({
        ...prev,
        drivers: "Failed to approve driver. Please try again.",
      }));
    }
  };

  const unapproveDriver = async (id) => {
    try {
      await axios.patch(`${SERVER_URL}/drivers/${id}`, { status: "pending" });
      await fetchDrivers();
    } catch (err) {
      console.error("Failed to unapprove driver:", err);
      setError((prev) => ({
        ...prev,
        drivers: "Failed to unapprove driver. Please try again.",
      }));
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.patch(`${SERVER_URL}/bookings/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookings();
    } catch (err) {
      console.error("Error updating booking:", err);
    }
  };

  const updateTripStatus = async (id, status) => {
    try {
      await axios.patch(`${SERVER_URL}/trips/${id}/status`, { status });
      fetchTrips();
    } catch (err) {
      console.error("Error updating trip status:", err);
    }
  };

  const handlePackageChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewPackage({ ...newPackage, image: files[0] });
    } else {
      setNewPackage({ ...newPackage, [name]: value });
    }
  };

  // Handle input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewCab({ ...newCab, image: files[0] });
    } else {
      setNewCab({ ...newCab, [name]: value });
    }
  };

  const addPackage = async (e) => {
    e.preventDefault();

    // Validate that we have a valid image file
    if (!newPackage.image || !(newPackage.image instanceof File)) {
      alert("Please select a valid image file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newPackage.name);
      formData.append("description", newPackage.description);
      formData.append("duration", newPackage.duration);
      formData.append("price", newPackage.price);
      formData.append("image", newPackage.image);

      await axios.post(`${SERVER_URL}/packages`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewPackage({
        name: "",
        description: "",
        duration: "",
        price: "",
        image: null,
      });

      // Reset file input
      const fileInput = document.querySelector('input[name="image"]');
      if (fileInput) fileInput.value = "";

      fetchPackages();
    } catch (err) {
      console.error("Failed to add package:", err);
    }
  };

  const deletePackageById = async (id) => {
    try {
      if (!window.confirm('Are you sure you want to delete this package?')) return;
      await axios.delete(`${SERVER_URL}/packages/${id}`);
      fetchPackages();
    } catch (err) {
      console.error('Failed to delete package:', err);
      alert('Failed to delete package. Please try again.');
    }
  };



  // Submit form
  const addCabType = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newCab.name);
      formData.append("description", newCab.description);
      formData.append("seats", Number(newCab.seats));
      if (newCab.image) {
        formData.append("image", newCab.image); // must be File object
      }

      await axios.post(`${SERVER_URL}/cabtypes`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Cab type added successfully!");
      setNewCab({ name: "", description: "", seats: "", image: null });

      // Reset file input field
      e.target.reset();

      if (fetchCabs) fetchCabs(); // refresh list
    } catch (err) {
      console.error("Failed to add cab:", err.response?.data || err.message);
      alert("Error adding cab type. Please try again.");
    }
  };


  // Move these declarations outside of renderVehiclesTable
  const grouped = bookings.reduce((acc, b) => {
    const dateKey = b.date || "Unknown Date";
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(b);
    return acc;
  }, {});

  // Sort dates (latest first)
  const sortedDates = Object.keys(grouped).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);

    // Handle invalid dates
    if (isNaN(dateA) && isNaN(dateB)) return 0;
    if (isNaN(dateA)) return 1;
    if (isNaN(dateB)) return -1;

    return dateB - dateA;
  });

  const renderVehiclesTable = () => (
    <>
      <h4>Vehicles</h4>
      {loading.vehicles ? (
        <Alert variant="info">Loading vehicles...</Alert>
      ) : error.vehicles ? (
        <Alert variant="danger">{error.vehicles}</Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Model</th>
              <th>Number</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Contact</th>
              <th>Image</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length > 0 ? (
              vehicles.map((v) => (
                <tr key={v._id}>
                  <td>{v.model}</td>
                  <td>{v.number}</td>
                  <td>{v.type}</td>
                  <td>{v.capacity}</td>
                  <td>{v.contactNumber || "-"}</td>
                  <td>
                    {v.imageUrl ? (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleViewImage(v.imageUrl)}
                        style={{ padding: 0, textDecoration: 'underline' }}
                      >
                        View Image
                      </Button>
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>{v.status}</td>
                  <td>
                    {v.status === "approved" ? (
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => unapproveVehicle(v._id)}
                      >
                        Unapprove
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => approveVehicle(v._id)}
                      >
                        Approve
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center">
                  No vehicles available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Image Modal */}
      <Modal show={showImageModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Vehicle Image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Vehicle"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          ) : (
            <p>No image available</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  );

  const renderDriversTable = () => (
    <>
      <h4>Drivers</h4>
      {loading.drivers ? (
        <Alert variant="info">Loading drivers...</Alert>
      ) : error.drivers ? (
        <Alert variant="danger">{error.drivers}</Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>License No</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length > 0 ? (
              drivers.map((d) => (
                <tr key={d._id}>
                  <td>{d.name}</td>
                  <td>{d.email}</td>
                  <td>{d.contact}</td>
                  <td>{d.licenseNo}</td>
                  <td>{d.status}</td>
                  <td>
                    {d.status === "approved" ? (
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => unapproveDriver(d._id)}
                      >
                        Unapprove
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => approveDriver(d._id)}
                      >
                        Approve
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No drivers available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </>
  );

  const renderBookingsTable = () => (
    <>
      <h4>Bookings</h4>
      {loading.bookings ? (
        <Alert variant="info">Loading bookings...</Alert>
      ) : error.bookings ? (
        <Alert variant="danger">{error.bookings}</Alert>
      ) : (
        sortedDates.map((date) => (
          <Card className="mb-4 shadow" key={date}>
            <Card.Header className="bg-light">
              <strong>📅 {date}</strong>
            </Card.Header>
            <Card.Body className="p-0">
              <Table striped bordered hover responsive className="mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Cab Type</th>
                    <th>Pickup</th>
                    <th>Drop</th>
                    <th>Time</th>
                    <th>Passengers</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped[date].map((b, idx) => (
                    <tr key={b._id}>
                      <td>{idx + 1}</td>
                      <td>{b.cabType?.name || "N/A"}</td>
                      <td>{b.pickup}</td>
                      <td>{b.drop}</td>
                      <td>{b.time}</td>
                      <td>{b.passengerCount || "N/A"}</td>
                      <td>
                        <Badge
                          bg={
                            b.status === "cancelled"
                              ? "danger"
                              : b.status === "completed"
                                ? "primary"
                                : b.status === "confirmed"
                                  ? "success"
                                  : "warning"
                          }
                        >
                          {b.status}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => updateBookingStatus(b._id, "cancelled")}
                          disabled={b.status === "cancelled"}
                        >
                          {b.status === "cancelled" ? "Cancelled" : "Cancel"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        ))
      )}
    </>
  );

  const renderTripsTable = () => (
    <>
      <h4>Package Bookings</h4>
      {loading.trips ? (
        <Alert variant="info">Loading package bookings...</Alert>
      ) : error.trips ? (
        <Alert variant="danger">{error.trips}</Alert>
      ) : trips.length === 0 ? (
        <Alert variant="warning">No package bookings available.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Package</th>
              <th>Travel Date</th>
              <th>Time</th>
              <th>Passengers</th>
              <th>Pickup</th>
              <th>Drop</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip, idx) => (
              <tr key={trip._id}>
                <td>{idx + 1}</td>
                <td>
                  <div>
                    <strong>{trip.name}</strong><br />
                    <small className="text-muted">{trip.email}</small><br />
                    <small className="text-muted">{trip.phone}</small>
                  </div>
                </td>
                <td>
                  <div>
                    <strong>{trip.packageName}</strong><br />
                    <small className="text-muted">₹{trip.packagePrice}</small>
                  </div>
                </td>
                <td>{new Date(trip.date).toLocaleDateString()}</td>
                <td>{trip.time}</td>
                <td>{trip.passengers}</td>
                <td>{trip.pickupLocation}</td>
                <td>{trip.dropLocation}</td>
                <td>
                  <Badge
                    bg={
                      trip.status === "cancelled"
                        ? "danger"
                        : trip.status === "completed"
                          ? "primary"
                          : trip.status === "confirmed"
                            ? "success"
                            : "warning"
                    }
                  >
                    {trip.status}
                  </Badge>
                </td>
                <td>
                  <div className="d-flex gap-1">
                    {trip.status === "pending" && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => updateTripStatus(trip._id, "confirmed")}
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => updateTripStatus(trip._id, "cancelled")}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {trip.status === "confirmed" && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => updateTripStatus(trip._id, "completed")}
                        >
                          Complete
                        </Button>
                        <Button
                          className="ms-1"
                          variant="danger"
                          size="sm"
                          onClick={() => updateTripStatus(trip._id, "cancelled")}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {trip.status === "cancelled" && (
                      <span className="text-muted">No actions</span>
                    )}
                    {trip.status === "completed" && (
                      <span className="text-muted">No actions</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );

  const renderCabTypes = () => (
    <>
      {/* Add Cab Form */}
      <Card className="p-4 shadow mt-3">
        <h4 className="mb-3 fw-bold">Add New Cab Type</h4>
        <Form onSubmit={addCabType}>
          <Form.Group className="mb-3">
            <Form.Label>Cab Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newCab.name}
              onChange={handleChange}
              placeholder="Enter cab name (e.g., Sedan)"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={newCab.description}
              onChange={handleChange}
              placeholder="Enter cab description"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Seats</Form.Label>
            <Form.Control
              type="number"
              name="seats"
              value={newCab.seats}
              onChange={handleChange}
              placeholder="Number of seats"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cab Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
            {newCab.image && (
              <div className="mt-2">
                <small className="text-muted">
                  Selected: {newCab.image.name}
                </small>
              </div>
            )}
          </Form.Group>

          <Button type="submit" variant="success">
            Add Cab
          </Button>
        </Form>
      </Card>

      {/* Cab Types List */}
      <Card className="p-4 shadow mt-4">
        <h4 className="mb-3 fw-bold">Available Cab Types</h4>
        {cabTypes.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Cab Name</th>
                <th>Description</th>
                <th>Seats</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cabTypes.map((cab, index) => (
                <tr key={cab._id}>
                  <td>{index + 1}</td>
                  <td>{cab.name}</td>
                  <td>{cab.description}</td>
                  <td>{cab.seats}</td>
                  <td>
                    {cab.image ? (
                      <img
                        src={`${SERVER_URL}/uploads/${cab.image}`}
                        alt={cab.name}
                        style={{ width: "80px", height: "50px", objectFit: "cover" }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to delete this cab type?")) {
                          try {
                            await axios.delete(`${SERVER_URL}/cabtypes/${cab._id}`);
                            fetchCabs();
                          } catch (err) {
                            console.error("Failed to delete cab type:", err);
                            alert("Error deleting cab type.");
                          }
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Alert variant="warning">No cab types available.</Alert>
        )}
      </Card>
    </>
  )

  const handleViewImage = (imageUrl) => {
    setSelectedImage(`${SERVER_URL}/uploads/${imageUrl}`);
    setShowImageModal(true);
  };

  const handleCloseModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  return (
    <Container fluid className="p-0" style={{ marginTop: "100px" }}>
      <Row>
        {/* Sidebar */}
        <Col md={2} className="bg-light text-dark vh-100 sticky-top p-3">
          <h4 className="mb-4 ms-3 fw-bold">Admin Dashboard</h4>
          <Nav className="flex-column">
            <Nav.Link
              onClick={() => setActiveTab("vehicles")}
              className={
                activeTab === "vehicles" ? "active text-light" : "text-dark"
              }
            >
              Onboarded Vehicles
            </Nav.Link>
            <Nav.Link
              onClick={() => setActiveTab("cabtypes")}
              className={
                activeTab === "cabtypes" ? "active text-light" : "text-dark"
              }
            >
              Cab Type Management
            </Nav.Link>
            <Nav.Link
              onClick={() => setActiveTab("drivers")}
              className={
                activeTab === "drivers" ? "active text-light" : "text-dark"
              }
            >
              Onboarded Drivers
            </Nav.Link>
            <Nav.Link
              onClick={() => setActiveTab("bookings")}
              className={
                activeTab === "bookings" ? "active text-light" : "text-dark"
              }
            >
              Booking Management
            </Nav.Link>
            <Nav.Link
              onClick={() => setActiveTab("packages")}
              className={
                activeTab === "packages" ? "active text-light" : "text-dark"
              }
            >
              Package Entry
            </Nav.Link>
            <Nav.Link
              onClick={() => setActiveTab("trips")}
              className={
                activeTab === "trips" ? "active text-light" : "text-dark"
              }
            >
              Package Bookings
            </Nav.Link>
          </Nav>
        </Col>

        {/* Main Content */}
        <Col md={10} className="p-4">
          {activeTab === "vehicles" && renderVehiclesTable()}
          {activeTab === "drivers" && renderDriversTable()}
          {activeTab === "bookings" && renderBookingsTable()}
          {activeTab === "trips" && renderTripsTable()}
          {activeTab === "cabtypes" && renderCabTypes()}

          {activeTab === "packages" && (
            <>
              <h4>Add New Package</h4>
              <Form onSubmit={addPackage}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        name="name"
                        value={newPackage.name}
                        onChange={handlePackageChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        name="description"
                        as="textarea"
                        value={newPackage.description}
                        onChange={handlePackageChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Duration</Form.Label>
                      <Form.Control
                        name="duration"
                        value={newPackage.duration}
                        onChange={handlePackageChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        name="price"
                        type="number"
                        value={newPackage.price}
                        onChange={handlePackageChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Package Image</Form.Label>
                      <Form.Control
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handlePackageChange}
                        required
                      />
                      {newPackage.image && (
                        <div className="mt-2">
                          <small className="text-muted">
                            Selected file: {newPackage.image instanceof File ? newPackage.image.name : 'Invalid file'}
                          </small>
                        </div>
                      )}
                    </Form.Group>
                    <Button type="submit" className="mt-3" variant="primary">
                      Add Package
                    </Button>
                  </Col>
                </Row>
              </Form>

              <h4 className="mt-4">Existing Packages</h4>
              <Row>
                {Array.isArray(packages) && packages.length > 0 ? (
                  packages.map((pkg) => (
                    <Col md={4} key={pkg._id} className="mb-3">
                      <Card>
                        {pkg.image && (
                          <Card.Img
                            variant="top"
                            src={`${SERVER_URL}/uploads/${pkg.image}`}
                            style={{ height: "200px", objectFit: "cover" }}
                          />
                        )}
                        <Card.Body>
                          <Card.Title>{pkg.name}</Card.Title>
                          <Card.Text>{pkg.description}</Card.Text>
                          <p>
                            <strong>Duration:</strong> {pkg.duration}
                          </p>
                          <p>
                            <strong>Price Per Person:</strong> ₹{pkg.price}
                          </p>
                          <div className="d-flex justify-content-end">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => deletePackageById(pkg._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Col>
                    <p>No packages available.</p>
                  </Col>
                )}
              </Row>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

