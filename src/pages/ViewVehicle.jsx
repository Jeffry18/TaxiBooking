import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SERVER_URL from "../services/serverURL";
import { Card, Row, Col } from "react-bootstrap";

const ViewVehicle = () => {
  const { cabTypeName } = useParams(); // get cab type from URL
  const [cabVehicles, setCabVehicles] = useState([]);

  useEffect(() => {
    const fetchCabVehicles = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/cabvehicles`);

        console.log("API vehicles:", res.data);
        console.log("cabTypeName from URL:", cabTypeName);

        // Filter vehicles by cabTypeName
        const filtered = res.data.filter(
          (v) => v.cabTypeName?.toLowerCase() === cabTypeName?.toLowerCase()
        );

        console.log("Filtered vehicles:", filtered);
        setCabVehicles(filtered);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      }
    };

    fetchCabVehicles();
  }, [cabTypeName]);

  return (
    <div className="container " style={{ marginTop: "150px" }}>
      <h3 className="mb-4 fw-bold text-center">
        Available Vehicles for {cabTypeName}
      </h3>
      <Row>
        {cabVehicles.length > 0 ? (
          cabVehicles.map((vehicle) => (
            <Col key={vehicle._id} md={4} className="mb-3">
              <Card className="shadow h-100">
                {/* Vehicle Image */}
                {vehicle.image && (
                  <Card.Img
                    variant="top"
                    src={`${SERVER_URL}/uploads/${vehicle.image}`}
                    alt={vehicle.modelName}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}

                <Card.Body>
                  <Card.Title>{vehicle.modelName}</Card.Title>
                  <Card.Text>
                    <strong>Capacity:</strong> {vehicle.capacity} <br />
                    <strong>Price/km:</strong> ₹{vehicle.pricePerKm}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center">
            No vehicles available for this cab type.
          </p>
        )}
      </Row>
    </div>
  );
};

export default ViewVehicle;
