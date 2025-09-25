import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Form, Row, Col, Card, Nav, Alert, Badge, Modal } from "react-bootstrap";
import SERVER_URL from "../services/serverURL";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo 2.png";



export default function AdminPage() {
  const navigate = useNavigate();
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

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear auth token
    navigate("/"); // Redirect to login page
  };
  const [activeTab, setActiveTab] = useState("overview");
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
  const [tariff, setTariff] = useState([])
  const [newTariff, setNewTariff] = useState({
    cabType: "",
    seats: "",
    rate: "",
    allowedKm: "",
    extraKmRate: "",
    details: "",
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
    fetchTariff();
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
      const token = sessionStorage.getItem("token");
      const res = await axios.get(`${SERVER_URL}/drivers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const fetchTariff = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/tariff`);
      setTariff(Array.isArray(res.data) ? res.data : []);
    } catch {
      console.error("Failed to fetch tariff:", err);
      setTariff([]);
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
      const token = sessionStorage.getItem("token");
      await axios.patch(
        `${SERVER_URL}/drivers/${id}`,
        { status: "approved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      const token = sessionStorage.getItem("token");
      await axios.patch(
        `${SERVER_URL}/drivers/${id}`,
        { status: "pending" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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

  const handleTariffChange = (e) => {

    const { name, value, files } = e.target;
    if (name === "image") {
      setNewTariff({ ...newTariff, image: files[0] });
    } else {
      setNewTariff({ ...newTariff, [name]: value });
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tariff?")) {
      try {
        await axios.delete(`${SERVER_URL}/tariff/${id}`); // Connects to your existing controller
        setTariff(tariff.filter((t) => t._id !== id)); // Remove from frontend state
      } catch (err) {
        console.error("Failed to delete tariff:", err);
        alert("Error deleting tariff.");
      }
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
      fetchStates();

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
      fetchCtiy();
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
      fetchPlace();

    } catch (err) {
      console.error("Failed to add place:", err.response?.data || err.message);
      alert("Error adding place. Please try again.");
    }
  }

  const AddTariff = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("cabType", newTariff.cabType);
      formData.append("seats", newTariff.seats);
      formData.append("rate", newTariff.rate);
      formData.append("allowedKm", newTariff.allowedKm);
      formData.append("extraKmRate", newTariff.extraKmRate);
      formData.append("details", newTariff.details);

      await axios.post(`${SERVER_URL}/tariff`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Tariff added!");
      setNewTariff({ cabType: "", seats: "", rate: "", allowedKm: "", extraKmRate: "", details: "" });
      e.target.reset();

      // Auto-refresh the tariff table
      fetchTariff();
    }
    catch (err) {
      console.error("Failed to add tariff:", err.response?.data || err.message);
      alert("Error adding tariff. Please try again.");
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

  const renderOverview = () => (
    <div className="dashboard-overview">
      <div className="overview-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-subtitle">Welcome back! Here's what's happening with your taxi booking service.</p>
      </div>

      <div className="overview-stats">
        <div className="stat-card stat-success">
          <div className="stat-icon">
            <i className="fas fa-car"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{vehicles.filter(v => v.status === "approved").length}</div>
            <div className="stat-label">Active Vehicles</div>
            <div className="stat-change positive">
              <i className="fas fa-arrow-up"></i>
              +5% from last month
            </div>
          </div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-icon">
            <i className="fas fa-id-card"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{drivers.filter(d => d.status === "approved").length}</div>
            <div className="stat-label">Active Drivers</div>
            <div className="stat-change positive">
              <i className="fas fa-arrow-up"></i>
              +8% from last month
            </div>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">
            <i className="fas fa-rupee-sign"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">₹{(bookings.length * 1250).toLocaleString()}</div>
            <div className="stat-label">Total Revenue</div>
            <div className="stat-change positive">
              <i className="fas fa-arrow-up"></i>
              +18% from last month
            </div>
          </div>
        </div>
      </div>

      <div className="overview-charts">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Pending Approvals</h3>
            <p>Items requiring your attention</p>
          </div>
          <div className="pending-list">
            {vehicles.filter(v => v.status === "pending").slice(0, 3).map(vehicle => (
              <div key={vehicle._id} className="pending-item">
                <i className="fas fa-car"></i>
                <span>Vehicle {vehicle.model} - {vehicle.number}</span>
                <button
                  className="approve-btn"
                  onClick={() => approveVehicle(vehicle._id)}
                >
                  Approve
                </button>
              </div>
            ))}
            {drivers.filter(d => d.status === "pending").slice(0, 3).map(driver => (
              <div key={driver._id} className="pending-item">
                <i className="fas fa-id-card"></i>
                <span>Driver {driver.name}</span>
                <button
                  className="approve-btn"
                  onClick={() => approveDriver(driver._id)}
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPackages = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h1 className="page-title">Package Management</h1>
        <p className="page-subtitle">Manage your travel packages and offerings</p>
      </div>

      <div className="content-card">
        <div className="card-header">
          <h3>Add New Package</h3>
        </div>
        <div className="card-content">
          <Form onSubmit={addPackage} className="package-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Package Name</label>
                <input
                  name="name"
                  value={newPackage.name}
                  onChange={handlePackageChange}
                  className="form-input"
                  placeholder="Enter package name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input
                  name="price"
                  type="number"
                  value={newPackage.price}
                  onChange={handlePackageChange}
                  className="form-input"
                  placeholder="Enter price"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Duration</label>
                <input
                  name="duration"
                  value={newPackage.duration}
                  onChange={handlePackageChange}
                  className="form-input"
                  placeholder="e.g., 3 Days 2 Nights"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Package Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handlePackageChange}
                  className="form-input file-input"
                  required
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={newPackage.description}
                onChange={handlePackageChange}
                className="form-textarea"
                placeholder="Enter package description"
                rows={4}
              />
            </div>

            <button type="submit" className="btn-primary">
              <i className="fas fa-plus"></i>
              Add Package
            </button>
          </Form>
        </div>
      </div>

      <div className="content-card">
        <div className="card-header">
          <h3>Existing Packages</h3>
          <span className="package-count">{packages.length} packages</span>
        </div>
        <div className="packages-grid">
          {Array.isArray(packages) && packages.length > 0 ? (
            packages.map((pkg) => (
              <div key={pkg._id} className="package-card">
                {pkg.image && (
                  <div className="package-image">
                    <img
                      src={`${SERVER_URL}/uploads/${pkg.image}`}
                      alt={pkg.name}
                    />
                  </div>
                )}
                <div className="package-content">
                  <h4 className="package-title">{pkg.name}</h4>
                  <p className="package-description">{pkg.description}</p>
                  <div className="package-details">
                    <div className="detail-item">
                      <i className="fas fa-clock"></i>
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-rupee-sign"></i>
                      <span>₹{pkg.price} per person</span>
                    </div>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => deletePackageById(pkg._id)}
                  >
                    <i className="fas fa-trash"></i>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <i className="fas fa-box-open"></i>
              <p>No packages available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderVehiclesTable = () => (
    <>
      <div className="dashboard-section">
        <div className="section-header">
          <h1 className="page-title">Vehicle Management</h1>
          <p className="page-subtitle">Manage onboarded vehicles and approvals</p>
        </div>

        <div className="content-card">
          {loading.vehicles ? (
            <div className="loading-state">
              <i className="fas fa-spinner fa-spin"></i>
              <span>Loading vehicles...</span>
            </div>
          ) : error.vehicles ? (
            <div className="error-state">
              <i className="fas fa-exclamation-triangle"></i>
              <span>{error.vehicles}</span>
            </div>
          ) : (
            <>
              <div className="table-header">
                <h3>Vehicle List</h3>
                <div className="table-stats">
                  <span className="stat-badge stat-total">{vehicles.length} Total</span>
                  <span className="stat-badge stat-pending">
                    {vehicles.filter(v => v.status === "pending").length} Pending
                  </span>
                  <span className="stat-badge stat-approved">
                    {vehicles.filter(v => v.status === "approved").length} Approved
                  </span>
                </div>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>Number</th>
                      <th>Type</th>
                      <th>Capacity</th>
                      <th>Contact</th>
                      <th>Image</th>
                      <th>Status</th>
                      <th>Actions</th>
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
                              <button
                                className="image-btn"
                                onClick={() => handleViewImage(v.imageUrl)}
                              >
                                <i className="fas fa-image"></i>
                                View
                              </button>
                            ) : (
                              <span className="no-image">No Image</span>
                            )}
                          </td>
                          <td>
                            <span className={`status-badge status-${v.status}`}>
                              {v.status}
                            </span>
                          </td>
                          <td>
                            {v.status === "approved" ? (
                              <button
                                className="btn-warning btn-sm"
                                onClick={() => unapproveVehicle(v._id)}
                              >
                                <i className="fas fa-times"></i>
                                Unapprove
                              </button>
                            ) : (
                              <button
                                className="btn-success btn-sm"
                                onClick={() => approveVehicle(v._id)}
                              >
                                <i className="fas fa-check"></i>
                                Approve
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="empty-state">
                          <i className="fas fa-car"></i>
                          <span>No vehicles available</span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

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
    <div className="dashboard-section">
      <div className="section-header">
        <h1 className="page-title">Driver Management</h1>
        <p className="page-subtitle">Manage onboarded drivers and approvals</p>
      </div>

      <div className="content-card">
        {loading.drivers ? (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <span>Loading drivers...</span>
          </div>
        ) : error.drivers ? (
          <div className="error-state">
            <i className="fas fa-exclamation-triangle"></i>
            <span>{error.drivers}</span>
          </div>
        ) : (
          <>
            <div className="table-header">
              <h3>Driver List</h3>
              <div className="table-stats">
                <span className="stat-badge stat-total">{drivers.length} Total</span>
                <span className="stat-badge stat-pending">
                  {drivers.filter(d => d.status === "pending").length} Pending
                </span>
                <span className="stat-badge stat-approved">
                  {drivers.filter(d => d.status === "approved").length} Approved
                </span>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>License No</th>
                    <th>Status</th>
                    <th>Actions</th>
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
                        <td>
                          <span className={`status-badge status-${d.status}`}>
                            {d.status}
                          </span>
                        </td>
                        <td>
                          {d.status === "approved" ? (
                            <button
                              className="btn-warning btn-sm"
                              onClick={() => unapproveDriver(d._id)}
                            >
                              <i className="fas fa-times"></i>
                              Unapprove
                            </button>
                          ) : (
                            <button
                              className="btn-success btn-sm"
                              onClick={() => approveDriver(d._id)}
                            >
                              <i className="fas fa-check"></i>
                              Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="empty-state">
                        <i className="fas fa-id-card"></i>
                        <span>No drivers available</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
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
            <Form.Label>Rate</Form.Label>
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

  const renderTariffTable = () => (
    <>
      <h4>Add New Tariff</h4>
      <Form onSubmit={AddTariff}>
        <Form.Group className="mb-3">
          <Form.Label>Cab Type</Form.Label>
          <Form.Select
            name="cabType"
            value={newTariff.cabType}
            onChange={handleTariffChange}
            required
          >
            <option value="">Select Cab Type</option>
            {cabTypes.map((type) => (
              <option key={type._id || type} value={type.name || type}>
                {type.name || type}
              </option>
            ))}
          </Form.Select>

          <Form.Label>Seats</Form.Label>
          <Form.Control type="number" name="seats" value={newTariff.seats} onChange={handleTariffChange} required />
          <Form.Label>Rate</Form.Label>
          <Form.Control type="number" name="rate" value={newTariff.rate} onChange={handleTariffChange} required />
          <Form.Label>Allowed Km</Form.Label>
          <Form.Control type="number" name="allowedKm" value={newTariff.allowedKm} onChange={handleTariffChange} required />
          <Form.Label>Extra Km Rate</Form.Label>
          <Form.Control type="number" name="extraKmRate" value={newTariff.extraKmRate} onChange={handleTariffChange} required />
          <Form.Label>Details</Form.Label>
          <Form.Control type="text" name="details" value={newTariff.details} onChange={handleTariffChange} required />
          <Button type="submit" variant="primary">Add Tariff</Button>
        </Form.Group>
      </Form>
      <h4>Tariffs</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Cab Type</th>
            <th>Seats</th>
            <th>Rate</th>
            <th>Allowed Km</th>
            <th>Extra Km Rate</th>
            <th>Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tariff.map((t) => (
            <tr key={t._id}>
              <td>{t.cabType}</td>
              <td>{t.seats}</td>
              <td>{t.rate}</td>
              <td>{t.allowedKm}</td>
              <td>{t.extraKmRate}</td>
              <td>{t.details}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(t._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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
    <div className="admin-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <button
              className="sidebar-toggle"
              onClick={() => setActiveTab(activeTab)} // Placeholder for sidebar toggle
            >
              <i className="fas fa-bars"></i>
            </button>
            <div className="header-brand">
              {/* <div className="brand-logo">
                <i className="fas fa-taxi"></i>
              </div> */}
              <img
                src={logo}
                alt="Logo"
                className="navbar-logo img-fluid d-inline-block align-top"
              />
              <h2 className="brand-title"> Admin</h2>
            </div>
          </div>

          <div className="header-right">
            <div className="header-actions">
              <div className="notification-bell">
                <i className="fas fa-bell"></i>
                <span className="notification-badge">3</span>
              </div>

              <div className="admin-profile">
                <div className="profile-avatar">
                  <i className="fas fa-user-shield"></i>
                </div>
                <div className="profile-info">
                  <span className="profile-name">Admin User</span>
                  <span className="profile-role">Administrator</span>
                </div>
              </div>

              <button className="sign-out-btn" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-body">
        {/* Enhanced Sidebar */}
        <div className="dashboard-sidebar">
          <div className="sidebar-content">
            <div className="sidebar-section">
              <h3 className="section-title">
                <i className="fas fa-chart-line"></i>
                Overview
              </h3>
              <nav className="sidebar-nav">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
                >
                  <i className="fas fa-tachometer-alt"></i>
                  <span>Dashboard</span>
                </button>
              </nav>
            </div>

            <div className="sidebar-section">
              <h3 className="section-title">
                <i className="fas fa-cogs"></i>
                Vehicle Management
              </h3>
              <nav className="sidebar-nav">
                <button
                  onClick={() => setActiveTab("vehicles")}
                  className={`nav-item ${activeTab === "vehicles" ? "active" : ""}`}
                >
                  <i className="fas fa-car"></i>
                  <span>Onboarded Vehicles</span>
                  {vehicles.filter(v => v.status === "pending").length > 0 && (
                    <span className="nav-badge">{vehicles.filter(v => v.status === "pending").length}</span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("cabtypes")}
                  className={`nav-item ${activeTab === "cabtypes" ? "active" : ""}`}
                >
                  <i className="fas fa-list"></i>
                  <span>Cab Type Management</span>
                </button>
              </nav>
            </div>

            <div className="sidebar-section">
              <h3 className="section-title">
                <i className="fas fa-users"></i>
                User Management
              </h3>
              <nav className="sidebar-nav">
                <button
                  onClick={() => setActiveTab("drivers")}
                  className={`nav-item ${activeTab === "drivers" ? "active" : ""}`}
                >
                  <i className="fas fa-id-card"></i>
                  <span>Onboarded Drivers</span>
                  {drivers.filter(d => d.status === "pending").length > 0 && (
                    <span className="nav-badge">{drivers.filter(d => d.status === "pending").length}</span>
                  )}
                </button>
              </nav>
            </div>

            <div className="sidebar-section">
              <h3 className="section-title">
                <i className="fas fa-suitcase"></i>
                Package Bookings
              </h3>
              <nav className="sidebar-nav">
                <button
                  onClick={() => setActiveTab("trips")}
                  className={`nav-item ${activeTab === "trips" ? "active" : ""}`}
                >
                  <i className="fas fa-suitcase"></i>
                  <span>Package Bookings</span>
                  {trips.filter(t => t.status === "pending").length > 0 && (
                    <span className="nav-badge">{trips.filter(t => t.status === "pending").length}</span>
                  )}
                </button>
              </nav>
            </div>

            <div className="sidebar-section">
              <h3 className="section-title">
                <i className="fas fa-box"></i>
                Content Management
              </h3>
              <nav className="sidebar-nav">
                <button
                  onClick={() => setActiveTab("packages")}
                  className={`nav-item ${activeTab === "packages" ? "active" : ""}`}
                >
                  <i className="fas fa-gift"></i>
                  <span>Package Entry</span>
                </button>

                <button
                  onClick={() => setActiveTab("state")}
                  className={`nav-item ${activeTab === "state" ? "active" : ""}`}
                >
                  <i className="fas fa-map-marked-alt"></i>
                  <span>States & Places</span>
                </button>

                <button
                  onClick={() => setActiveTab("tariff")}
                  className={`nav-item ${activeTab === "tariff" ? "active" : ""}`}
                >
                  <i className="fas fa-calculator"></i>
                  <span>Tariff Management</span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          <div className="main-content">
            {activeTab === "overview" && renderOverview()}
            {activeTab === "vehicles" && renderVehiclesTable()}
            {activeTab === "drivers" && renderDriversTable()}
            {activeTab === "trips" && renderTripsTable()}
            {activeTab === "cabtypes" && renderCabTypes()}
            {activeTab === "packages" && renderPackages()}
            {activeTab === "state" && renderStates()}
            {activeTab === "tariff" && renderTariffTable()}
          </div>
        </div>
      </div>
    </div>
  );
}

