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
  const [cabVehicles, setCabVehicles] = useState([]);
  const [newCabVehicle, setNewCabVehicle] = useState({
    cabTypeName: "",
    modelName: "",
    capacity: "",
    pricePerKm: ""
  });
  const [states, setStates] = useState([])
  const [newStates, setNewStates] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [city, setCity] = useState([])
  const [newCity, setNewCity] = useState({
    name: "",
    state: "",
    description: "",
    image: null,
  });
  const [place, setPlace] = useState([])
  const [newPlace, setNewPlace] = useState({
    name: "",
    city: "",
    description: "",
    rate: "",
    image: null,
  });





  // Fetch data
  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
    fetchPackages();
    fetchBookings();
    fetchTrips();
    fetchCabs();
    fetchCabVehicles();
    fetchStates();
    fetchCtiy();
    fetchPlace();
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

  const fetchCabVehicles = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/cabvehicles`);
      setCabVehicles(Array.isArray(res.data) ? res.data : []);

    } catch (err) {
      console.error("Failed to fetch cab vehicles:", err);
      setCabVehicles([]);
    }
  }

  const fetchStates = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/states`);
      setStates(Array.isArray(res.data) ? res.data : []);
    } catch {
      console.error("Failed to fetch states:", err);
      setStates([]);
    }
  }

  const fetchCtiy = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/city`);
      setCity(Array.isArray(res.data) ? res.data : []);
    } catch {
      console.error("Failed to fetch city:", err);
      setCity([]);
    }
  }


  const fetchPlace = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/place`);
      setPlace(Array.isArray(res.data) ? res.data : []);
    } catch {
      console.error("Failed to fetch place:", err);
      setPlace([]);
    }
  }

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
  const handleCabChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewCab({ ...newCab, image: files[0] });
    } else {
      setNewCab({ ...newCab, [name]: value });
    }
  };

  const handleCabVehicleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewCabVehicle({ ...newCabVehicle, image: files[0] });
    } else {
      setNewCabVehicle({ ...newCabVehicle, [name]: value });
    }
  };

  const handleStatesChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewStates({ ...newStates, image: files[0] });
    } else {
      setNewStates({ ...newStates, [name]: value });
    }
  }

  const handleCityChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewCity({ ...newCity, image: files[0] });
    } else {
      setNewCity({ ...newCity, [name]: value });
    }
  }

  const handlePlaceChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewPlace({ ...newPlace, image: files[0] });
    } else {
      setNewPlace({ ...newPlace, [name]: value });
    }
  }

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
      if (!window.confirm("Are you sure you want to delete this package?")) return;

      const response = await axios.delete(`${SERVER_URL}/packages/${id}`);

      if (response.status === 200) {
        alert(response.data.message); // "Package deleted successfully"
        fetchPackages(); // Refresh the list after deletion
      } else {
        alert("Failed to delete package. Please try again.");
      }
    } catch (err) {
      console.error("Failed to delete package:", err);
      // If backend sends a specific error message
      const errorMessage = err.response?.data?.message || "Failed to delete package. Please try again.";
      alert(errorMessage);
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

  const addCabVehicle = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("cabTypeName", newCabVehicle.cabTypeName);
      formData.append("modelName", newCabVehicle.modelName);
      formData.append("capacity", Number(newCabVehicle.capacity));
      formData.append("pricePerKm", Number(newCabVehicle.pricePerKm));
      if (newCabVehicle.image) {
        formData.append("image", newCabVehicle.image);
      }

      await axios.post(`${SERVER_URL}/cabvehicles`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Cab vehicle added successfully!");
      setNewCabVehicle({ cabTypeName: "", modelName: "", capacity: "", pricePerKm: "", image: null });
      e.target.reset();
      if (fetchCabVehicles) fetchCabVehicles(); // refresh list
    } catch (err) {
      console.error("Failed to add cab vehicle:", err.response?.data || err.message);
      alert("Error adding cab vehicle. Please try again.");
    }
  };

  const AddStates = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newStates.name);
      formData.append("description", newStates.description)
      if (newStates.image) {
        formData.append("image", newStates.image);
      }

      await axios.post(`${SERVER_URL}/states`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("State added!");
      setNewStates({ name: "", description: "", image: null });
      e.target.reset();

    } catch (err) {
      console.error("Failed to add state:", err.response?.data || err.message);
      alert("Error adding state. Please try again.");
    }
  }

  const AddCities = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newCity.name)
      formData.append("state", newCity.state)
      formData.append("description", newCity.description)
      if (newCity.image) {
        formData.append("image", newCity.image);
      }

      await axios.post(`${SERVER_URL}/city`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("City added!");
      setNewCity({ name: "", states: "", description: "", image: null });
      e.target.reset();

    } catch (err) {
      console.error("Failed to add city:", err.response?.data || err.message);
      alert("Error adding city. Please try again.");
    }
  }

  const AddPlace = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newPlace.name)
      formData.append("city", newPlace.city)
      formData.append("description", newPlace.description)
      formData.append("rate", newPlace.rate)
      if (newPlace.image) {
        formData.append("image", newPlace.image);
      }

      await axios.post(`${SERVER_URL}/place`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("place added!");
      setNewPlace({ name: "", city: "", description: "", rate: "", image: null });
      e.target.reset();

    } catch (err) {
      console.error("Failed to add place:", err.response?.data || err.message);
      alert("Error adding place. Please try again.");
    }
  }






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
                    <th>User</th>
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
                      <td>{b.username}</td>
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
              onChange={handleCabChange}
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
              onChange={handleCabChange}
              placeholder="Enter cab description"
            />
          </Form.Group>



          <Form.Group className="mb-3">
            <Form.Label>Seats</Form.Label>
            <Form.Control
              type="number"
              name="seats"
              value={newCab.seats}
              onChange={handleCabChange}
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
              onChange={handleCabChange}
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

      <Card className="p-4 shadow mt-3">
        <h4 className="mb-3 fw-bold">Add New Cab Vehicle</h4>
        <Form onSubmit={addCabVehicle}>
          <Form.Group className="mb-3">
            <Form.Label>Vehicle Name</Form.Label>
            <Form.Control
              type="text"
              name="modelName"
              value={newCabVehicle.modelName}
              onChange={handleCabVehicleChange}
              placeholder="Enter Vehicle name (e.g., Toyota Innova)"
              required
            />
          </Form.Group>



          <Form.Group className="mb-3">
            <Form.Label>Cab Type</Form.Label>
            <Form.Select
              name="cabTypeName"
              value={newCabVehicle.cabTypeName}
              onChange={handleCabVehicleChange}
              required
            >
              <option value="">-- Select Cab Type --</option>
              {cabTypes.map((cab) => (
                <option key={cab._id} value={cab.name}>
                  {cab.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>



          <Form.Group className="mb-3">
            <Form.Label>Capacity</Form.Label>
            <Form.Control
              type="number"
              name="capacity"
              value={newCabVehicle.capacity}
              onChange={handleCabVehicleChange}
              placeholder="Number of seats"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price Per Km</Form.Label>
            <Form.Control
              type="number"
              name="pricePerKm"
              value={newCabVehicle.pricePerKm}
              onChange={handleCabVehicleChange}
              placeholder="Price Per Km"
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setNewCabVehicle({ ...newCabVehicle, image: e.target.files[0] })}
            />
          </Form.Group>



          <Button type="submit" variant="success">
            Add Cab Vehicle
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

      {/* cab vehicle list */}
      <Card className="p-4 shadow mt-4">
        <h4 className="mb-3 fw-bold">Available Cab Vehicles</h4>
        {cabVehicles.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Cab Type</th>
                <th>Vehicle Name</th>
                <th>Capacity</th>
                <th>Price Per Km</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cabVehicles.map((vehicle, index) => (
                <tr key={vehicle._id}>
                  <td>{index + 1}</td>
                  <td>{vehicle.cabTypeName}</td>
                  <td>{vehicle.modelName}</td>
                  <td>{vehicle.capacity}</td>
                  <td>₹{vehicle.pricePerKm}</td>
                  <td>
                    {vehicle.image ? (
                      <img
                        src={`${SERVER_URL}/uploads/${vehicle.image}`}
                        alt={vehicle.modelName}
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
                        if (window.confirm("Are you sure you want to delete this cab vehicle?")) {
                          try {
                            await axios.delete(`${SERVER_URL}/cabvehicles/${vehicle._id}`);
                            fetchCabVehicles(); // refresh after delete
                          } catch (err) {
                            console.error("Failed to delete cab vehicle:", err);
                            alert("Error deleting cab vehicle.");
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
          <Alert variant="warning">No cab vehicles available.</Alert>
        )}
      </Card>

    </>
  );

  const renderStates = () => (
    <>
      {/* Add State Form */}
      <Card className="p-4 shadow mt-3">
        <h4 className="mb-3 fw-bold">Add New State</h4>
        <Form onSubmit={AddStates}>
          <Form.Group className="mb-3">
            <Form.Label>State Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newStates.name}
              onChange={(e) =>
                setNewStates({ ...newStates, name: e.target.value })
              }
              placeholder="Enter state name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="description"
              as="textarea"
              value={newStates.description}
              onChange={handleStatesChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>State Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) =>
                setNewStates({ ...newStates, image: e.target.files[0] })
              }
            />
            {newStates.image && (
              <div className="mt-2">
                <small className="text-muted">
                  Selected: {newStates.image.name}
                </small>
              </div>
            )}
          </Form.Group>

          <Button type="submit" variant="success">
            Add State
          </Button>
        </Form>
      </Card>



      {/* States List */}
      <Card className="p-4 shadow mt-4">
        <h4 className="mb-3 fw-bold">Available States</h4>
        {states.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>State Name</th>
                <th>Description</th>
                <th>image</th>
              </tr>
            </thead>
            <tbody>
              {states.map((state, index) => (
                <tr key={state._id}>
                  <td>{index + 1}</td>
                  <td>{state.name}</td>
                  <td>{state.description}</td>
                  <td>
                    {state.image ? (
                      <img
                        src={`${SERVER_URL}/uploads/${state.image}`}
                        alt={state.name}
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
                        if (window.confirm("Are you sure you want to delete this state")) {
                          try {
                            await axios.delete(`${SERVER_URL}/states/${state._id}`);
                            fetchStates(); // refresh after delete
                          } catch (err) {
                            console.error("Failed to delete state:", err);
                            alert("Error deleting cab vehicle.");
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
          <Alert variant="warning">No states available.</Alert>
        )}
      </Card>

      {/* Add City Form */}
      <Card className="p-4 shadow mt-3">
        <h4 className="mb-3 fw-bold">Add New City</h4>
        <Form onSubmit={AddCities}>
          <Form.Group className="mb-3">
            <Form.Label>City Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newCity.name}
              onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
              placeholder="Enter city name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>State</Form.Label>
            <Form.Select
              name="state"
              value={newCity.state}
              onChange={(e) => setNewCity({ ...newCity, state: e.target.value })}
              required
            >
              <option value="">-- Select State --</option>
              {states.map((state) => (
                <option key={state._id} value={state.name}>
                  {state.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="description"
              as="textarea"
              value={newCity.description}
              onChange={(e) => setNewCity({ ...newCity, description: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>City Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => setNewCity({ ...newCity, image: e.target.files[0] })}
            />
            {newCity.image && (
              <div className="mt-2">
                <small className="text-muted">
                  Selected: {newCity.image.name}
                </small>
              </div>
            )}
          </Form.Group>

          <Button type="submit" variant="success">
            Add City
          </Button>
        </Form>
      </Card>

      {/* Cities List */}
      <Card className="p-4 shadow mt-4">
        <h4 className="mb-3 fw-bold">Available Cities</h4>
        {city.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>City Name</th>
                <th>State</th>
                <th>Description</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {city.map((city, index) => (
                <tr key={city._id}>
                  <td>{index + 1}</td>
                  <td>{city.name}</td>
                  <td>{city.state}</td>
                  <td>{city.description}</td>
                  <td>
                    {city.image ? (
                      <img
                        src={`${SERVER_URL}/uploads/${city.image}`}
                        alt={city.name}
                        style={{
                          width: "80px",
                          height: "50px",
                          objectFit: "cover",
                        }}
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
                        if (window.confirm("Are you sure you want to delete this city?")) {
                          try {
                            await axios.delete(`${SERVER_URL}/city/${city._id}`);
                            fetchCities(); // refresh list after delete
                          } catch (err) {
                            console.error("Failed to delete city:", err);
                            alert("Error deleting city.");
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
          <Alert variant="warning">No cities available.</Alert>
        )}
      </Card>

      {/* Add Place Form */}
      <Card className="p-4 shadow mt-3">
        <h4 className="mb-3 fw-bold">Add New Place</h4>
        <Form onSubmit={AddPlace}>
          <Form.Group className="mb-3">
            <Form.Label>Place Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newPlace.name}
              onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
              placeholder="Enter place name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Select
              name="city"
              value={newPlace.city}
              onChange={(e) => setNewPlace({ ...newPlace, city: e.target.value })}
              required
            >
              <option value="">-- Select City --</option>
              {city.map((city) => (
                <option key={city._id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="description"
              as="textarea"
              value={newPlace.description}
              onChange={(e) =>
                setNewPlace({ ...newPlace, description: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rate from the city</Form.Label>
            <Form.Control
              type="number"
              name="rate"
              value={newPlace.rate}
              onChange={(e) => setNewPlace({ ...newPlace, rate: e.target.value })}
              placeholder="Enter rate"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Place Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) =>
                setNewPlace({ ...newPlace, image: e.target.files[0] })
              }
            />
            {newPlace.image && (
              <div className="mt-2">
                <small className="text-muted">
                  Selected: {newPlace.image.name}
                </small>
              </div>
            )}
          </Form.Group>

          <Button type="submit" variant="success">
            Add Place
          </Button>
        </Form>
      </Card>

      {/* Places List */}
      <Card className="p-4 shadow mt-4">
        <h4 className="mb-3 fw-bold">Available Places</h4>
        {place.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Place Name</th>
                <th>City</th>
                <th>Description</th>
                <th>Rate</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {place.map((place, index) => (
                <tr key={place._id}>
                  <td>{index + 1}</td>
                  <td>{place.name}</td>
                  <td>{place.city}</td>
                  <td>{place.description}</td>
                  <td>{place.rate}</td>
                  <td>
                    {place.image ? (
                      <img
                        src={`${SERVER_URL}/uploads/${place.image}`}
                        alt={place.name}
                        style={{
                          width: "80px",
                          height: "50px",
                          objectFit: "cover",
                        }}
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
                        if (window.confirm("Are you sure you want to delete this place?")) {
                          try {
                            await axios.delete(`${SERVER_URL}/place/${place._id}`);
                            fetchPlace(); // refresh list after delete
                          } catch (err) {
                            console.error("Failed to delete place:", err);
                            alert("Error deleting place.");
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
          <Alert variant="warning">No places available.</Alert>
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
            <Nav.Link
              onClick={() => setActiveTab("state")}
              className={
                activeTab === "state" ? "active text-light" : "text-dark"
              }
            >
              States & Places
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
          {activeTab === "state" && renderStates()}

        </Col>
      </Row>
    </Container>
  );
}

