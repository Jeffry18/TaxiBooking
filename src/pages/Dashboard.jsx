import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Form, Row, Col, Card, Nav, Alert, Badge, Modal, Dropdown } from "react-bootstrap";
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
    cabtype: [],
    city: "",
    destination: "",
    month: "",
    image: null,
  });

  // Add these state variables near your other state declarations
  const [editingId, setEditingId] = useState(null);
  const [editedPackage, setEditedPackage] = useState(null);

  // Add near your other state declarations
  const [editingState, setEditingState] = useState(null);
  const [editedState, setEditedState] = useState(null);

  // Add near your other state declarations
  const [editingCity, setEditingCity] = useState(null);
  const [editedCity, setEditedCity] = useState(null);

  // Add near your other state declarations
  const [editingPlace, setEditingPlace] = useState(null);
  const [editedPlace, setEditedPlace] = useState(null);

  // Add near your other state declarations
  const [editingCabType, setEditingCabType] = useState(null);
  const [editedCabType, setEditedCabType] = useState(null);

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
  // Editing state for cab vehicles
  const [editingCabVehicleId, setEditingCabVehicleId] = useState(null);
  const [editedCabVehicle, setEditedCabVehicle] = useState(null);



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
    driverBata: "",
    extraKmRate: "",
    details: "",
  });
  const [cityTariff, setCityTariff] = useState([])
  const [newCityTariff, setNewCityTariff] = useState({
    city: "",
    cabType: "",
    seats: "",
    ratePerDay: "",
    allowedKm: "",
    extraKmRate: "",
    outstation: "",
    details: "",
  });
  // Editing state for tariffs
  const [editingTariffId, setEditingTariffId] = useState(null);
  const [editedTariff, setEditedTariff] = useState(null);

  // Editing state for city tariffs
  const [editingCityTariffId, setEditingCityTariffId] = useState(null);
  const [editedCityTariff, setEditedCityTariff] = useState(null);






  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
    fetchPackages();
    fetchBookings();
    fetchTrips();
    fetchCabs();
    fetchCabVehicles();
    fetchStates();
    fetchCity();
    fetchPlace();
    fetchTariff();
    fetchCityTariff();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading((prev) => ({ ...prev, vehicles: true }));
      const token = sessionStorage.getItem("token");
      const res = await axios.get(`${SERVER_URL}/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
      const token = sessionStorage.getItem("token");
      const res = await axios.get(`${SERVER_URL}/trips`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

  const fetchCity = async () => {
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

  const fetchCityTariff = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/citytariff`);
      setCityTariff(Array.isArray(res.data) ? res.data : []);
    } catch {
      console.error("Failed to fetch city tariff:", err);
      setCityTariff([]);
    }
  }


  const approveVehicle = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.patch(`${SERVER_URL}/vehicles/${id}`, { status: "approved" }, { headers: { Authorization: `Bearer ${token}` } });
      fetchVehicles();
    } catch (err) {
      console.error("Failed to approve vehicle:", err);
    }
  };

  const unapproveVehicle = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.patch(`${SERVER_URL}/vehicles/${id}`, { status: "pending" }, { headers: { Authorization: `Bearer ${token}` } });
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
    const { name, value, files, type, options } = e.target;
    if (name === "image") {
      setNewPackage({ ...newPackage, image: files[0] });
    } else if (name === "cabtype") {
      // Handle multiple select
      const selectedOptions = [...options]
        .filter(option => option.selected)
        .map(option => option.value);
      setNewPackage({ ...newPackage, cabtype: selectedOptions });
    } else {
      setNewPackage({ ...newPackage, [name]: value });
    }
  };

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

  const handleCityTariffChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewCityTariff({ ...newCityTariff, image: files[0] });
    } else {
      setNewCityTariff({ ...newCityTariff, [name]: value });
    }
  }


  const handleTariffDelete = async (id) => {
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

  const handleCityTariffDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tariff?")) {
      try {
        await axios.delete(`${SERVER_URL}/citytariff/${id}`); // Connects to your existing controller
        setCityTariff(cityTariff.filter((t) => t._id !== id)); // Remove from frontend state
      } catch (err) {
        console.error("Failed to delete tariff:", err);
        alert("Error deleting tariff.");
      }
    }
  };

  const handleUpdateTariff = async (id) => {
    try {
      if (!editedTariff) return;
      const payload = {
        cabType: editedTariff.cabType,
        seats: editedTariff.seats,
        rate: editedTariff.rate,
        allowedKm: editedTariff.allowedKm,
        driverBata: editedTariff.driverBata,
        extraKmRate: editedTariff.extraKmRate,
        details: editedTariff.details,
      };
      const res = await axios.put(`${SERVER_URL}/tariff/${id}`, payload);
      setTariff((prev) => prev.map((t) => (t._id === id ? res.data : t)));
      setEditingTariffId(null);
      setEditedTariff(null);
    } catch (err) {
      console.error('Failed to update tariff:', err);
      alert('Error updating tariff');
    }
  };

  const handleUpdateCityTariff = async (id) => {
    try {
      if (!editedCityTariff) return;
      const payload = {
        city: editedCityTariff.city,
        cabType: editedCityTariff.cabType,
        seats: editedCityTariff.seats,
        ratePerDay: editedCityTariff.ratePerDay,
        allowedKm: editedCityTariff.allowedKm,
        extraKmRate: editedCityTariff.extraKmRate,
        outstation: editedCityTariff.outstation,
        details: editedCityTariff.details,
      };
      const res = await axios.put(`${SERVER_URL}/citytariff/${id}`, payload);
      setCityTariff((prev) => prev.map((t) => (t._id === id ? res.data : t)));
      setEditingCityTariffId(null);
      setEditedCityTariff(null);
    } catch (err) {
      console.error('Failed to update city tariff:', err);
      alert('Error updating city tariff');
    }
  };

  const handleUpdatePackage = async (packageId) => {
    try {
      const formData = new FormData();

      // Add all fields to formData
      Object.keys(editedPackage).forEach(key => {
        if (key !== '_id' && key !== '__v' && editedPackage[key] !== undefined) {
          // skip the temporary newImage field here, it's handled below
          if (key === 'newImage') return;
          formData.append(key, editedPackage[key]);
        }
      });

      // If there's a new image file, append it
      if (editedPackage.newImage instanceof File) {
        formData.append('image', editedPackage.newImage);
      }

      // IMPORTANT: do NOT set Content-Type here. Let the browser/axios set the multipart boundary.
      const response = await axios.put(
        `${SERVER_URL}/packages/${packageId}`,
        formData
      );

      if (response.data) {
        setEditingId(null);
        setEditedPackage(null);
        fetchPackages();
        alert('Package updated successfully!');
      }
    } catch (error) {
      console.error('Error updating package:', error);
      alert('Failed to update package. Please try again.');
    }
  };

  const handleUpdateState = async (stateId) => {
    try {
      const formData = new FormData();
      formData.append('name', editedState.name);
      formData.append('description', editedState.description);
      if (editedState.newImage instanceof File) {
        formData.append('image', editedState.newImage);
      }

      const response = await axios.put(`${SERVER_URL}/states/${stateId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data) {
        setEditingState(null);
        setEditedState(null);
        fetchStates();
        alert('State updated successfully!');
      }
    } catch (error) {
      console.error('Error updating state:', error);
      alert('Failed to update state. Please try again.');
    }
  };

  const handleUpdateCity = async (cityId) => {
    try {
      const formData = new FormData();
      formData.append('name', editedCity.name);
      formData.append('state', editedCity.state);
      formData.append('description', editedCity.description);
      if (editedCity.newImage instanceof File) {
        formData.append('image', editedCity.newImage);
      }

      const response = await axios.put(`${SERVER_URL}/city/${cityId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data) {
        setEditingCity(null);
        setEditedCity(null);
        fetchCity(); // Refresh the city list
        alert('City updated successfully!');
      }
    } catch (error) {
      console.error('Error updating city:', error);
      alert('Failed to update city. Please try again.');
    }
  };

  const handleUpdatePlace = async (placeId) => {
    try {
      const formData = new FormData();
      formData.append('name', editedPlace.name);
      formData.append('city', editedPlace.city);
      formData.append('description', editedPlace.description);
      formData.append('rate', editedPlace.rate);
      if (editedPlace.newImage instanceof File) {
        formData.append('image', editedPlace.newImage);
      }

      const response = await axios.put(`${SERVER_URL}/place/${placeId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data) {
        setEditingPlace(null);
        setEditedPlace(null);
        fetchPlace(); // Refresh the places list
        alert('Place updated successfully!');
      }
    } catch (error) {
      console.error('Error updating place:', error);
      alert('Failed to update place. Please try again.');
    }
  };

  const handleUpdateCabType = async (cabTypeId) => {
    try {
      const formData = new FormData();
      formData.append('name', editedCabType.name);
      formData.append('description', editedCabType.description);
      formData.append('seats', editedCabType.seats);
      if (editedCabType.newImage instanceof File) {
        formData.append('image', editedCabType.newImage);
      }

      const response = await axios.patch(`${SERVER_URL}/cabtypes/${cabTypeId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data) {
        setEditingCabType(null);
        setEditedCabType(null);
        fetchCabs(); // Refresh the cab types list
        alert('Cab type updated successfully!');
      }
    } catch (error) {
      console.error('Error updating cab type:', error);
      alert('Failed to update cab type. Please try again.');
    }
  };

  const handleUpdateCabVehicle = async (vehicleId) => {
    try {
      if (!editedCabVehicle) return;
      const formData = new FormData();
      formData.append('cabTypeName', editedCabVehicle.cabTypeName || '');
      formData.append('modelName', editedCabVehicle.modelName || '');
      formData.append('capacity', editedCabVehicle.capacity || '');
      formData.append('pricePerKm', editedCabVehicle.pricePerKm || '');
      if (editedCabVehicle.newImage) {
        formData.append('image', editedCabVehicle.newImage);
      }

      const res = await fetch(`${SERVER_URL}/cabVehicles/${vehicleId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Failed to update cab vehicle');
      }

      const updated = await res.json();

      // Update local state
      setCabVehicles((prev) => prev.map((v) => (v._id === vehicleId ? updated : v)));

      // Clear editing state
      setEditingCabVehicleId(null);
      setEditedCabVehicle(null);
    } catch (error) {
      console.error('update cab vehicle error', error);
      // Optionally set an error state or show toast
    }
  };

  const handleCabTypeDelete = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete this cab type?")) return;
      const response = await axios.delete(`${SERVER_URL}/cabtypes/${id}`);
      if (response.status === 200) {
        alert(response.data.message); // "Cab type deleted successfully"
        fetchCabs(); // Refresh the list after deletion
      } else {
        alert("Failed to delete cab type. Please try again.");
      }
    } catch (err) {
      console.error("Failed to delete cab type:", err);
      // If backend sends a specific error message
      const errorMessage = err.response?.data?.message || "Failed to delete cab type. Please try again.";
      alert(errorMessage);
    }
  };

  const handleCabVehicleDelete = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete this cab vehicle?")) return;
      const response = await axios.delete(`${SERVER_URL}/cabvehicles/${id}`);
      if (response.status === 200) {
        alert(response.data.message);
        fetchCabVehicles(); // Refresh the list after deletion
      } else {
        alert("Failed to delete cab vehicle. Please try again.");
      }
    } catch (err) {
      console.error("Failed to delete cab vehicle:", err);
      const errorMessage = err.response?.data?.message || "Failed to delete cab vehicle. Please try again.";
      alert(errorMessage);
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
      formData.append("cabtype", newPackage.cabtype.join(','));
      formData.append("city", newPackage.city);
      formData.append("destination", newPackage.destination);
      formData.append("month", newPackage.month);
      formData.append("image", newPackage.image);


      await axios.post(`${SERVER_URL}/packages`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewPackage({
        name: "",
        description: "",
        duration: "",
        price: "",
        cabtype: [],
        city: "",
        destination: "",
        month: "",
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

  const addCabType = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newCab.name);
      formData.append("description", newCab.description);
      formData.append("seats", newCab.seats);
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
      fetchCity();
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
      formData.append("driverBata", newTariff.driverBata);
      formData.append("extraKmRate", newTariff.extraKmRate);
      formData.append("details", newTariff.details);

      await axios.post(`${SERVER_URL}/tariff`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Tariff added!");
      setNewTariff({ cabType: "", seats: "", rate: "", allowedKm: "", driverBata: "", extraKmRate: "", details: "" });
      e.target.reset();

      // Auto-refresh the tariff table
      fetchTariff();
    }
    catch (err) {
      console.error("Failed to add tariff:", err.response?.data || err.message);
      alert("Error adding tariff. Please try again.");
    }
  }

  const AddCityTariff = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("city", newCityTariff.city);
      formData.append("cabType", newCityTariff.cabType);
      formData.append("seats", newCityTariff.seats);
      formData.append("ratePerDay", newCityTariff.ratePerDay);
      formData.append("allowedKm", newCityTariff.allowedKm);
      formData.append("extraKmRate", newCityTariff.extraKmRate);
      formData.append("outstation", newCityTariff.outstation);
      formData.append("details", newCityTariff.details);

      await axios.post(`${SERVER_URL}/citytariff`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Tariff added!");
      setNewCityTariff({ city: "", cabType: "", seats: "", ratePerDay: "", allowedKm: "", extraKmRate: "", outstation: "", details: "" });
      e.target.reset();

      // Auto-refresh the tariff table
      fetchCityTariff();
    }
    catch (err) {
      console.error("Failed to add tariff:", err.response?.data || err.message);
      alert("Error adding tariff. Please try again.");
    }
  }

  const [zoomImage, setZoomImage] = useState(null);
  const [zoomIndex, setZoomIndex] = useState(0);

  const handleNextZoom = () => {
    if (!Array.isArray(selectedImage)) return;
    setZoomIndex((prev) => (prev + 1) % selectedImage.length);
    setZoomImage(`${SERVER_URL}/uploads/${selectedImage[(zoomIndex + 1) % selectedImage.length]}`);
  };

  const handlePrevZoom = () => {
    if (!Array.isArray(selectedImage)) return;
    setZoomIndex((prev) => (prev - 1 + selectedImage.length) % selectedImage.length);
    setZoomImage(`${SERVER_URL}/uploads/${selectedImage[(zoomIndex - 1 + selectedImage.length) % selectedImage.length]}`);
  };

  const handleImageClick = (img, index) => {
    setZoomIndex(index);
    setZoomImage(`${SERVER_URL}/uploads/${img}`);
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

              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  name="city"
                  value={newPackage.city}
                  onChange={handlePackageChange}
                  className="form-input"
                  placeholder="Enter City"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Destination</label>
                <input
                  name="destination"
                  value={newPackage.destination}
                  onChange={handlePackageChange}
                  className="form-input"
                  placeholder="Enter Destination"
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
                <label className="form-label">Month</label>
                <input
                  name="month"
                  value={newPackage.month}
                  onChange={handlePackageChange}
                  className="form-input"
                  placeholder="e.g., November-January"
                />
              </div>


              <div className="form-group">
                <label className="form-label">Cab Types</label>
                <div className="cab-types-checkbox-group">
                  {cabTypes.map((cab) => (
                    <div key={cab._id} className="cab-type-checkbox">
                      <input
                        type="checkbox"
                        id={`cab-${cab._id}`}
                        name="cabtype"
                        value={cab.name}
                        checked={newPackage.cabtype.includes(cab.name)}
                        onChange={(e) => {
                          const value = e.target.value;
                          setNewPackage(prev => ({
                            ...prev,
                            cabtype: e.target.checked
                              ? [...prev.cabtype, value]
                              : prev.cabtype.filter(type => type !== value)
                          }));
                        }}
                      />
                      <label htmlFor={`cab-${cab._id}`}>{cab.name}</label>
                    </div>
                  ))}
                </div>
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
                  {editingId === pkg._id ? (

                    // Editing mode
                    <div className="package-edit-form">
                      <input
                        className="edit-input"
                        value={editedPackage.name}
                        onChange={(e) => setEditedPackage({
                          ...editedPackage,
                          name: e.target.value
                        })}
                        placeholder="Package Name"
                      />
                      <input
                        className="edit-input"
                        value={editedPackage.city}
                        onChange={(e) => setEditedPackage({
                          ...editedPackage,
                          city: e.target.value
                        })}
                        placeholder="City"
                      />
                      <input
                        className="edit-input"
                        value={editedPackage.destination}
                        onChange={(e) => setEditedPackage({
                          ...editedPackage,
                          destination: e.target.value
                        })}
                        placeholder="Destination"
                      />
                      <textarea
                        className="edit-input"
                        value={editedPackage.description}
                        onChange={(e) => setEditedPackage({
                          ...editedPackage,
                          description: e.target.value
                        })}
                        placeholder="Description"
                      />
                      <div className="edit-row">
                        <input
                          className="edit-input"
                          value={editedPackage.duration}
                          onChange={(e) => setEditedPackage({
                            ...editedPackage,
                            duration: e.target.value
                          })}
                          placeholder="Duration"
                        />
                        <input
                          className="edit-input"
                          type="number"
                          value={editedPackage.price}
                          onChange={(e) => setEditedPackage({
                            ...editedPackage,
                            price: e.target.value
                          })}
                          placeholder="Price"
                        />
                      </div>
                      <div className="edit-row">

                        <div className="form-group">
                          <label className="form-label">Cab Types</label>
                          <div className="cab-types-checkbox-group">
                            {cabTypes.map((cab) => (
                              <div key={cab._id} className="cab-type-checkbox">
                                <input
                                  type="checkbox"
                                  id={`edit-cab-${cab._id}`}
                                  checked={editedPackage.cabtype.includes(cab.name)}
                                  onChange={(e) => {
                                    const value = cab.name;
                                    setEditedPackage(prev => ({
                                      ...prev,
                                      cabtype: e.target.checked
                                        ? [...(Array.isArray(prev.cabtype) ? prev.cabtype : []), value]
                                        : Array.isArray(prev.cabtype)
                                          ? prev.cabtype.filter(type => type !== value)
                                          : []
                                    }));
                                  }}
                                />
                                <label htmlFor={`edit-cab-${cab._id}`}>{cab.name}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>


                      <div className="edit-row">


                        <input
                          className="edit-input"
                          value={editedPackage.month}
                          onChange={(e) => setEditedPackage({
                            ...editedPackage,
                            month: e.target.value
                          })}
                          placeholder="Month"
                        />

                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">Package Image</label>
                        <input
                          type="file"
                          className="edit-input file-input"
                          onChange={(e) => setEditedPackage({
                            ...editedPackage,
                            newImage: e.target.files[0]
                          })}
                        />
                      </div>

                      <div className="edit-actions">
                        <button
                          className="save-btn"
                          onClick={() => handleUpdatePackage(pkg._id)}
                        >
                          <i className="fas fa-save"></i> Save
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => {
                            setEditingId(null);
                            setEditedPackage(null);
                          }}
                        >
                          <i className="fas fa-times"></i> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display mode
                    <>
                      <h4 className="package-title">{pkg.name}</h4>
                      <p className="package-title">{pkg.city} - {pkg.destination}</p>
                      <p className="package-description">{pkg.description}</p>
                      <div className="package-details">
                        <div className="detail-item">
                          <i className="fas fa-calendar-alt"></i>
                          <span>{pkg.month}</span>
                        </div>
                        <div className="detail-item">
                          <i className="fas fa-clock"></i>
                          <span>{pkg.duration}</span>
                        </div>
                        <div className="detail-item">
                          <i className="fas fa-car"></i>
                          <span>{pkg.cabtype}</span>
                        </div>
                        <div className="detail-item">
                          <i className="fas fa-rupee-sign"></i>
                          <span>₹{pkg.price} Per Day Onwards</span>
                        </div>


                      </div>
                      <div className="package-actions">
                        <button
                          className="edit-btn"
                          onClick={() => {
                            setEditingId(pkg._id);
                            setEditedPackage({ ...pkg });
                          }}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => deletePackageById(pkg._id)}
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </div>
                    </>
                  )}
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
                            {(v.images && v.images.length > 0) || v.imageUrl ? (
                              <button
                                className="image-btn btn btn-primary btn-sm"
                                onClick={() => handleVehicleViewImage(v.images?.length > 0 ? v.images : [v.imageUrl])}
                              >
                                <i className="fas fa-image me-1"></i>
                                View ({v.images?.length || 1})
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
          <Modal.Title>Vehicle Images</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage ? (
            <div className="image-gallery">
              {Array.isArray(selectedImage) ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "10px",
                    padding: "10px",
                  }}
                >
                  {selectedImage.map((file, index) => {
                    const isPDF = file.toLowerCase().endsWith(".pdf");
                    const fileURL = `${SERVER_URL}/uploads/${file}`;

                    return (
                      <div
                        key={index}
                        style={{
                          position: "relative",
                          paddingBottom: "100%",
                          height: 0,
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          if (isPDF) window.open(fileURL, "_blank");
                          else handleImageClick(file, index);
                        }}
                      >
                        {isPDF ? (
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              background: "#f5f5f5",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "1px solid #ddd",
                              borderRadius: "8px",
                              color: "#333",
                              fontSize: "14px",
                              flexDirection: "column",
                            }}
                          >
                            <i className="fas fa-file-pdf fa-2x text-danger mb-2"></i>
                            <span>View PDF</span>
                          </div>
                        ) : (
                          <img
                            src={fileURL}
                            alt={`Vehicle ${index + 1}`}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid #ddd",
                            }}
                          />
                        )}
                      </div>
                    );
                  })}

                </div>
              ) : (
                <>
                  {selectedImage.toLowerCase().endsWith(".pdf") ? (
                    <iframe
                      src={`${SERVER_URL}/uploads/${selectedImage}`}
                      title="PDF Viewer"
                      style={{
                        width: "100%",
                        height: "80vh",
                        border: "none",
                        borderRadius: "8px",
                      }}
                    ></iframe>
                  ) : (
                    <img
                      src={`${SERVER_URL}/uploads/${selectedImage}`}
                      alt="Vehicle"
                      style={{ maxWidth: "100%", height: "auto", cursor: "pointer" }}
                      onClick={() =>
                        setZoomImage(`${SERVER_URL}/uploads/${selectedImage}`)
                      }
                    />
                  )}
                </>
              )}
            </div>
          ) : (
            <p>No images available</p>
          )}
        </Modal.Body>

      </Modal>

      {/* Zoom Modal */}
      <Modal show={!!zoomImage} onHide={() => setZoomImage(null)} centered size="xl">
        <Modal.Body style={{ textAlign: 'center', position: 'relative' }}>
          {zoomImage && (
            <>
              <img
                src={zoomImage}
                alt="Zoomed Vehicle"
                style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
              />
              {Array.isArray(selectedImage) && selectedImage.length > 1 && (
                <>
                  <button
                    onClick={handlePrevZoom}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: 10,
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.5)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      cursor: 'pointer'
                    }}
                  >
                    &#8592;
                  </button>
                  <button
                    onClick={handleNextZoom}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: 10,
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.5)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      cursor: 'pointer'
                    }}
                  >
                    &#8594;
                  </button>
                </>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );

  const [showDriverImageModal, setShowDriverImageModal] = useState(false);
  const [selectedDriverImage, setSelectedDriverImage] = useState(null);
  const [driverZoomImage, setDriverZoomImage] = useState(null);

  const handleDriverImageClick = (img) => {
    setDriverZoomImage(`${SERVER_URL}/uploads/${img}`);
  };

  const handleViewDriverImage = (image) => {
    setSelectedDriverImage(image);
    setShowDriverImageModal(true);
  };

  const handleCloseDriverModal = () => {
    setShowDriverImageModal(false);
    setSelectedDriverImage(null);
    setDriverZoomImage(null);
  };

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
                    <th>Image</th>
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
                        <td>
                          {d.image ? (
                            <button
                              className="image-btn btn btn-primary btn-sm"
                              onClick={() => handleViewDriverImage(d.image)}
                            >
                              <i className="fas fa-image me-1"></i>
                              View
                            </button>
                          ) : (
                            <span className="no-image">No Image</span>
                          )}
                        </td>
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
                      <td colSpan={7} className="empty-state">
                        <i className="fas fa-id-card"></i>
                        <span>No drivers available</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Driver Image Modal */}
            <Modal show={showDriverImageModal} onHide={handleCloseDriverModal} centered size="lg">
              <Modal.Header closeButton>
                <Modal.Title>Driver Image</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedDriverImage ? (
                  <div className="image-gallery">
                    <div
                      style={{
                        position: 'relative',
                        textAlign: 'center'
                      }}
                    >
                      <img
                        src={`${SERVER_URL}/uploads/${selectedDriverImage}`}
                        alt="Driver"
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                          cursor: 'pointer',
                          borderRadius: '8px',
                          border: '1px solid #ddd'
                        }}
                        onClick={() => handleDriverImageClick(selectedDriverImage)}
                      />
                    </div>
                  </div>
                ) : (
                  <p>No image available</p>
                )}
              </Modal.Body>
            </Modal>

            {/* Driver Image Zoom Modal */}
            <Modal show={!!driverZoomImage} onHide={() => setDriverZoomImage(null)} centered size="xl">
              <Modal.Body style={{ textAlign: 'center', position: 'relative' }}>
                {driverZoomImage && (
                  <img
                    src={driverZoomImage}
                    alt="Zoomed Driver"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '80vh',
                      objectFit: 'contain'
                    }}
                  />
                )}
              </Modal.Body>
            </Modal>
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
                    <th>Phone Number</th>
                    <th>Cab Type</th>
                    <th>Pickup</th>
                    <th>Drop & Stops</th>
                    <th>Time</th>
                    <th>Passengers</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped[date].map((b, idx) => (
                    <tr key={b._id}>
                      <td>{idx + 1}</td>
                      <td>{b.username}</td>
                      <td>{b.phoneNumber || "N/A"}</td>
                      <td>{b.cabType?.name || "N/A"}</td>
                      <td>{b.pickup}</td>
                      <td style={dropdownStyle}>
                        <Dropdown>
                          <Dropdown.Toggle variant="link" className="p-0 text-dark text-decoration-none">
                            {b.drop} {b.extraStops?.length > 0 && <i className="fas fa-caret-down ms-1" />}
                          </Dropdown.Toggle>
                          <Dropdown.Menu style={dropdownMenuStyle}>
                            <Dropdown.Header>Extra Stops</Dropdown.Header>
                            {b.extraStops && b.extraStops.length > 0 && (
                              <>
                                <Dropdown.Divider />

                                {b.extraStops.map((stop, index) => (
                                  <Dropdown.Item key={index} disabled>
                                    {index + 1}. {stop}
                                  </Dropdown.Item>
                                ))}
                              </>
                            )}
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
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
                        <div className="d-flex gap-2">
                          {b.status === "pending" && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => updateBookingStatus(b._id, "confirmed")}
                            >

                              Assigned
                            </Button>
                          )}
                          {b.status !== "cancelled" && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => updateBookingStatus(b._id, "cancelled")}
                            >

                              Cancel
                            </Button>
                          )}
                        </div>
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
              type="text"
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
                <th>Name</th>
                <th>Description</th>
                <th>Seats</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cabTypes.map((cabType) => (
                <tr key={cabType._id}>
                  <td>
                    {editingCabType === cabType._id ? (
                      <input
                        className="edit-input"
                        value={editedCabType.name}
                        onChange={(e) => setEditedCabType({
                          ...editedCabType,
                          name: e.target.value
                        })}
                      />
                    ) : (
                      cabType.name
                    )}
                  </td>
                  <td>
                    {editingCabType === cabType._id ? (
                      <input
                        className="edit-input"
                        value={editedCabType.description}
                        onChange={(e) => setEditedCabType({
                          ...editedCabType,
                          description: e.target.value
                        })}
                      />
                    ) : (
                      cabType.description
                    )}
                  </td>
                  <td>
                    {editingCabType === cabType._id ? (
                      <input
                        className="edit-input"
                        type="text"
                        value={editedCabType.seats}
                        onChange={(e) => setEditedCabType({
                          ...editedCabType,
                          seats: e.target.value
                        })}
                      />
                    ) : (
                      cabType.seats
                    )}
                  </td>
                  <td>
                    {editingCabType === cabType._id ? (
                      <input
                        type="file"
                        className="edit-input"
                        onChange={(e) => setEditedCabType({
                          ...editedCabType,
                          newImage: e.target.files[0]
                        })}
                        accept="image/*"
                      />
                    ) : (
                      cabType.image && (
                        <img
                          src={`${SERVER_URL}/uploads/${cabType.image}`}
                          alt={cabType.name}
                          style={{ height: '50px', width: '50px', objectFit: 'cover' }}
                        />
                      )
                    )}
                  </td>
                  <td>
                    {editingCabType === cabType._id ? (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleUpdateCabType(cabType._id)}
                        >
                          <i className="fas fa-save"></i> Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setEditingCabType(null);
                            setEditedCabType(null);
                          }}
                        >
                          <i className="fas fa-times"></i> Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setEditingCabType(cabType._id);
                            setEditedCabType({ ...cabType });
                          }}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCabTypeDelete(cabType._id)}
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </div>
                    )}
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
                  <td>
                    {editingCabVehicleId === vehicle._id ? (
                      <Form.Control
                        type="text"
                        value={editedCabVehicle.cabTypeName}
                        onChange={(e) => setEditedCabVehicle({ ...editedCabVehicle, cabTypeName: e.target.value })}
                      />
                    ) : (
                      vehicle.cabTypeName
                    )}
                  </td>
                  <td>
                    {editingCabVehicleId === vehicle._id ? (
                      <Form.Control
                        type="text"
                        value={editedCabVehicle.modelName}
                        onChange={(e) => setEditedCabVehicle({ ...editedCabVehicle, modelName: e.target.value })}
                      />
                    ) : (
                      vehicle.modelName
                    )}
                  </td>
                  <td>
                    {editingCabVehicleId === vehicle._id ? (
                      <Form.Control
                        type="number"
                        value={editedCabVehicle.capacity}
                        onChange={(e) => setEditedCabVehicle({ ...editedCabVehicle, capacity: e.target.value })}
                      />
                    ) : (
                      vehicle.capacity
                    )}
                  </td>
                  <td>
                    {editingCabVehicleId === vehicle._id ? (
                      <Form.Control
                        type="number"
                        value={editedCabVehicle.pricePerKm}
                        onChange={(e) => setEditedCabVehicle({ ...editedCabVehicle, pricePerKm: e.target.value })}
                      />
                    ) : (
                      `₹${vehicle.pricePerKm}`
                    )}
                  </td>
                  <td>
                    {editingCabVehicleId === vehicle._id ? (
                      <div>
                        <small className="text-muted">Leave empty to keep existing</small>
                        <Form.Control
                          type="file"
                          onChange={(e) => setEditedCabVehicle({ ...editedCabVehicle, newImage: e.target.files[0] })}
                          accept="image/*"
                        />
                      </div>
                    ) : (
                      vehicle.image ? (
                        <img
                          src={`${SERVER_URL}/uploads/${vehicle.image}`}
                          alt={vehicle.modelName}
                          style={{ width: "80px", height: "50px", objectFit: "cover" }}
                        />
                      ) : (
                        "No Image"
                      )
                    )}
                  </td>
                  <td>
                    {editingCabVehicleId === vehicle._id ? (
                      <div className="d-flex gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleUpdateCabVehicle(vehicle._id)}
                        >
                          <i className="fas fa-save"></i> Save
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => { setEditingCabVehicleId(null); setEditedCabVehicle(null); }}
                        >
                          <i className="fas fa-times"></i> Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="d-flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => { setEditingCabVehicleId(vehicle._id); setEditedCabVehicle({ cabTypeName: vehicle.cabTypeName, modelName: vehicle.modelName, capacity: vehicle.capacity, pricePerKm: vehicle.pricePerKm }); }}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCabVehicleDelete(vehicle._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
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
                <th>Name</th>
                <th>Description</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {states.map((state) => (
                <tr key={state._id}>
                  <td>
                    {editingState === state._id ? (
                      <input
                        className="edit-inputState"
                        value={editedState.name}
                        onChange={(e) => setEditedState({
                          ...editedState,
                          name: e.target.value
                        })}
                      />
                    ) : (
                      state.name
                    )}
                  </td>
                  <td>
                    {editingState === state._id ? (
                      <input
                        className="edit-inputState"
                        value={editedState.description}
                        onChange={(e) => setEditedState({
                          ...editedState,
                          description: e.target.value
                        })}
                      />
                    ) : (
                      state.description
                    )}
                  </td>
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
                    {editingState === state._id ? (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleUpdateState(state._id)}
                        >
                          <i className="fas fa-save"></i> Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setEditingState(null);
                            setEditedState(null);
                          }}
                        >
                          <i className="fas fa-times"></i> Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setEditingState(state._id);
                            setEditedState({ ...state });
                          }}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(state._id)}
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </div>
                    )}
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
                <th>Name</th>
                <th>State</th>
                <th>Description</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {city.map((cityItem) => (
                <tr key={cityItem._id}>
                  <td>
                    {editingCity === cityItem._id ? (
                      <input
                        className="edit-input"
                        value={editedCity.name}
                        onChange={(e) => setEditedCity({
                          ...editedCity,
                          name: e.target.value
                        })}
                      />
                    ) : (
                      cityItem.name
                    )}
                  </td>
                  <td>
                    {editingCity === cityItem._id ? (
                      <select
                        className="edit-input"
                        value={editedCity.state}
                        onChange={(e) => setEditedCity({
                          ...editedCity,
                          state: e.target.value
                        })}
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state._id} value={state.name}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      cityItem.state
                    )}
                  </td>
                  <td>
                    {editingCity === cityItem._id ? (
                      <input
                        className="edit-input"
                        value={editedCity.description}
                        onChange={(e) => setEditedCity({
                          ...editedCity,
                          description: e.target.value
                        })}
                      />
                    ) : (
                      cityItem.description
                    )}
                  </td>
                  <td>
                    {editingCity === cityItem._id ? (
                      <input
                        type="file"
                        className="edit-input"
                        onChange={(e) => setEditedCity({
                          ...editedCity,
                          newImage: e.target.files[0]
                        })}
                        accept="image/*"
                      />
                    ) : (
                      cityItem.image && (
                        <img
                          src={`${SERVER_URL}/uploads/${cityItem.image}`}
                          alt={cityItem.name}
                          style={{ height: '50px', width: '50px', objectFit: 'cover' }}
                        />
                      )
                    )}
                  </td>
                  <td>
                    {editingCity === cityItem._id ? (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleUpdateCity(cityItem._id)}
                        >
                          <i className="fas fa-save"></i> Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setEditingCity(null);
                            setEditedCity(null);
                          }}
                        >
                          <i className="fas fa-times"></i> Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setEditingCity(cityItem._id);
                            setEditedCity({ ...cityItem });
                          }}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCityDelete(cityItem._id)}
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </div>
                    )}
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
                <th>Name</th>
                <th>City</th>
                <th>Description</th>
                <th>Rate</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {place.map((placeItem) => (
                <tr key={placeItem._id}>
                  <td>
                    {editingPlace === placeItem._id ? (
                      <input
                        className="edit-input"
                        value={editedPlace.name}
                        onChange={(e) => setEditedPlace({
                          ...editedPlace,
                          name: e.target.value
                        })}
                      />
                    ) : (
                      placeItem.name
                    )}
                  </td>
                  <td>
                    {editingPlace === placeItem._id ? (
                      <select
                        className="edit-inputplace"
                        value={editedPlace.city}
                        onChange={(e) => setEditedPlace({
                          ...editedPlace,
                          city: e.target.value
                        })}
                      >
                        <option value="">Select City</option>
                        {city.map((c) => (
                          <option key={c._id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      placeItem.city
                    )}
                  </td>
                  <td>
                    {editingPlace === placeItem._id ? (
                      <input
                        className="edit-inputplace"
                        value={editedPlace.description}
                        onChange={(e) => setEditedPlace({
                          ...editedPlace,
                          description: e.target.value
                        })}
                      />
                    ) : (
                      placeItem.description
                    )}
                  </td>
                  <td>
                    {editingPlace === placeItem._id ? (
                      <input
                        className="edit-inputplace"
                        type="number"
                        value={editedPlace.rate}
                        onChange={(e) => setEditedPlace({
                          ...editedPlace,
                          rate: e.target.value
                        })}
                      />
                    ) : (
                      placeItem.rate
                    )}
                  </td>
                  <td>
                    {editingPlace === placeItem._id ? (
                      <input
                        type="file"
                        className="edit-inputplace"
                        onChange={(e) => setEditedPlace({
                          ...editedPlace,
                          newImage: e.target.files[0]
                        })}
                        accept="image/*"
                      />
                    ) : (
                      placeItem.image && (
                        <img
                          src={`${SERVER_URL}/uploads/${placeItem.image}`}
                          alt={placeItem.name}
                          style={{ height: '50px', width: '50px', objectFit: 'cover' }}
                        />
                      )
                    )}
                  </td>
                  <td>
                    {editingPlace === placeItem._id ? (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleUpdatePlace(placeItem._id)}
                        >
                          <i className="fas fa-save"></i> Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setEditingPlace(null);
                            setEditedPlace(null);
                          }}
                        >
                          <i className="fas fa-times"></i> Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setEditingPlace(placeItem._id);
                            setEditedPlace({ ...placeItem });
                          }}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handlePlaceDelete(placeItem._id)}
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </div>
                    )}
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
          <Form.Label>Driver Bata</Form.Label>
          <Form.Control type="number" name="driverBata" value={newTariff.driverBata} onChange={handleTariffChange} required />
          <Form.Label>Extra Km Rate</Form.Label>
          <Form.Control type="number" name="extraKmRate" value={newTariff.extraKmRate} onChange={handleTariffChange} required />
          <Form.Label>Detials</Form.Label>
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
            <th>Driver Bata</th>
            <th>Extra Km Rate</th>
            <th>Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tariff.map((t) => (
            <tr key={t._id}>
              <td>
                {editingTariffId === t._id ? (
                  <Form.Control type="text" value={editedTariff.cabType} onChange={(e) => setEditedTariff({ ...editedTariff, cabType: e.target.value })} />
                ) : (
                  t.cabType
                )}
              </td>
              <td>
                {editingTariffId === t._id ? (
                  <Form.Control type="number" value={editedTariff.seats} onChange={(e) => setEditedTariff({ ...editedTariff, seats: e.target.value })} />
                ) : (
                  t.seats
                )}
              </td>
              <td>
                {editingTariffId === t._id ? (
                  <Form.Control type="number" value={editedTariff.rate} onChange={(e) => setEditedTariff({ ...editedTariff, rate: e.target.value })} />
                ) : (
                  t.rate
                )}
              </td>
              <td>
                {editingTariffId === t._id ? (
                  <Form.Control type="number" value={editedTariff.allowedKm} onChange={(e) => setEditedTariff({ ...editedTariff, allowedKm: e.target.value })} />
                ) : (
                  t.allowedKm
                )}
              </td>
              <td>
                {editingTariffId === t._id ? (
                  <Form.Control type="number" value={editedTariff.driverBata} onChange={(e) => setEditedTariff({ ...editedTariff, driverBata: e.target.value })} />
                ) : (
                  t.driverBata
                )}
              </td>
              <td>
                {editingTariffId === t._id ? (
                  <Form.Control type="number" value={editedTariff.extraKmRate} onChange={(e) => setEditedTariff({ ...editedTariff, extraKmRate: e.target.value })} />
                ) : (
                  t.extraKmRate
                )}
              </td>
              <td>
                {editingTariffId === t._id ? (
                  <Form.Control type="text" value={editedTariff.details} onChange={(e) => setEditedTariff({ ...editedTariff, details: e.target.value })} />
                ) : (
                  t.details
                )}
              </td>
              <td>
                {editingTariffId === t._id ? (
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="success" onClick={() => handleUpdateTariff(t._id)}>Save</Button>
                    <Button size="sm" variant="secondary" onClick={() => { setEditingTariffId(null); setEditedTariff(null); }}>Cancel</Button>
                  </div>
                ) : (
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="primary" onClick={() => { setEditingTariffId(t._id); setEditedTariff({ ...t }); }}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleTariffDelete(t._id)}>Delete</Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h4 className="mt-5">Add New City Tariff</h4>
      <Form onSubmit={AddCityTariff} >
        <Form.Group className="mb-3">
          <Form.Label>City</Form.Label>
          <Form.Select
            name="city"
            value={newCityTariff.city}
            onChange={handleCityTariffChange}
            required
          >
            <option value="">Select City</option>
            {city.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </Form.Select>
          <Form.Label>Cab Type</Form.Label>
          <Form.Select
            name="cabType"
            value={newCityTariff.cabType}
            onChange={handleCityTariffChange}
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
          <Form.Control type="number" name="seats" value={newCityTariff.seats} onChange={handleCityTariffChange} required />
          <Form.Label>Rate</Form.Label>
          <Form.Control type="number" name="ratePerDay" value={newCityTariff.ratePerDay} onChange={handleCityTariffChange} required />
          <Form.Label>Details</Form.Label>
          <Form.Control type="text" name="details" value={newCityTariff.details} onChange={handleCityTariffChange} required />
          <Form.Label>Allowed Km</Form.Label>
          <Form.Control type="number" name="allowedKm" value={newCityTariff.allowedKm} onChange={handleCityTariffChange} required />
          <Form.Label>Extra Km Rate</Form.Label>
          <Form.Control type="number" name="extraKmRate" value={newCityTariff.extraKmRate} onChange={handleCityTariffChange} required />
          <Form.Label>Outstation Rate</Form.Label>
          <Form.Control type="text" name="outstation" value={newCityTariff.outstation} onChange={handleCityTariffChange} required />
          <Button type="submit" variant="primary">Add City Tariff</Button>
        </Form.Group>
      </Form>
      <h4>City Tariffs</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>City</th>
            <th>Cab Type</th>
            <th>Seat</th>
            <th>Rate</th>
            <th>Details</th>
            <th>Allowed Km</th>
            <th>Extra Km Rate</th>
            <th>Outstation Rate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cityTariff.map((t) => (
            <tr key={t._id}>
              <td>
                {editingCityTariffId === t._id ? (
                  <Form.Control type="text" value={editedCityTariff.city} onChange={(e) => setEditedCityTariff({ ...editedCityTariff, city: e.target.value })} />
                ) : (
                  t.city
                )}
              </td>
              <td>
                {editingCityTariffId === t._id ? (
                  <Form.Control type="text" value={editedCityTariff.cabType} onChange={(e) => setEditedCityTariff({ ...editedCityTariff, cabType: e.target.value })} />
                ) : (
                  t.cabType
                )}
              </td>
              <td>
                {editingCityTariffId === t._id ? (
                  <Form.Control type="number" value={editedCityTariff.seats} onChange={(e) => setEditedCityTariff({ ...editedCityTariff, seats: e.target.value })} />
                ) : (
                  t.seats
                )}
              </td>
              <td>
                {editingCityTariffId === t._id ? (
                  <Form.Control type="number" value={editedCityTariff.ratePerDay} onChange={(e) => setEditedCityTariff({ ...editedCityTariff, ratePerDay: e.target.value })} />
                ) : (
                  t.ratePerDay
                )}
              </td>
              <td>
                {editingCityTariffId === t._id ? (
                  <Form.Control type="text" value={editedCityTariff.details} onChange={(e) => setEditedCityTariff({ ...editedCityTariff, details: e.target.value })} />
                ) : (
                  t.details
                )}
              </td>
              <td>
                {editingCityTariffId === t._id ? (
                  <Form.Control type="number" value={editedCityTariff.allowedKm} onChange={(e) => setEditedCityTariff({ ...editedCityTariff, allowedKm: e.target.value })} />
                ) : (
                  t.allowedKm
                )}
              </td>
              <td>
                {editingCityTariffId === t._id ? (
                  <Form.Control type="number" value={editedCityTariff.extraKmRate} onChange={(e) => setEditedCityTariff({ ...editedCityTariff, extraKmRate: e.target.value })} />
                ) : (
                  t.extraKmRate
                )}
              </td>
              <td>
                {editingCityTariffId === t._id ? (
                  <Form.Control type="text" value={editedCityTariff.outstation} onChange={(e) => setEditedCityTariff({ ...editedCityTariff, outstation: e.target.value })} />
                ) : (
                  t.outstation
                )}
              </td>
              <td>
                {editingCityTariffId === t._id ? (
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="success" onClick={() => handleUpdateCityTariff(t._id)}>Save</Button>
                    <Button size="sm" variant="secondary" onClick={() => { setEditingCityTariffId(null); setEditedCityTariff(null); }}>Cancel</Button>
                  </div>
                ) : (
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="primary" onClick={() => { setEditingCityTariffId(t._id); setEditedCityTariff({ ...t }); }}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleCityTariffDelete(t._id)}>Delete</Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )

  const dropdownStyle = {
    position: 'relative'
  };

  const dropdownMenuStyle = {
    position: 'absolute',
    transform: 'none',
    top: '100%',
    left: 0,
    willChange: 'transform'
  };

  const handleViewImage = (imageUrl) => {
    setSelectedImage(`${SERVER_URL}/uploads/${imageUrl}`);
    setShowImageModal(true);
  };

  const handleCloseModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  const handleVehicleViewImage = (images) => {
    setSelectedImage(images);
    setShowImageModal(true);
  };

  const handleVehicleCloseModal = () => {
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
                <button
                  onClick={() => setActiveTab("enquiries")}
                  className={`nav-item ${activeTab === "enquiries" ? "active" : ""}`}
                >
                  <i className="fas fa-user"></i>
                  <span>Enquiries</span>
                  {bookings.filter(c => c.status === "pending").length > 0 && (
                    <span className="nav-badge">{bookings.filter(c => c.status === "pending").length}</span>
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
            {activeTab === "enquiries" && renderBookingsTable()}
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

