import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import SERVER_URL from "../services/serverURL";

const PackageExtend = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { packageData } = location.state || {};

  if (!packageData) {
    return (
      <div className="container text-center py-5">
        <h4>No package selected</h4>
        <Button variant="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ marginTop: "100px" }}>
      <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
        <div
          style={{
            height: "300px",
            backgroundImage: packageData.image
              ? `url(${SERVER_URL}/uploads/${packageData.image})`
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <Card.Body className="p-4">
          <h2 className="fw-bold mb-2 text-primary">{packageData.name}</h2>
          <h5 className="text-muted mb-3">
            {packageData.city} → {packageData.destination}
          </h5>

          <p className="text-secondary mb-4">{packageData.description}</p>

          <div className="mb-3">
            <p><strong>Duration:</strong> {packageData.duration}</p>
            <p><strong>Best Month:</strong> {packageData.month}</p>
            <p><strong>Cab Type:</strong> {packageData.cabtype}</p>
            <p><strong>Price:</strong> ₹{packageData.price} Per Day Onwards</p>
          </div>

          <Button
            variant="primary"
            onClick={() => navigate(-1)}
            className="me-2"
          >
            Go Back
          </Button>
        </Card.Body>
      </Card>


    </div>
  );
};

export default PackageExtend;
