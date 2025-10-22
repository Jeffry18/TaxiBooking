import React, { useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';

const SimpleGooglePlaces = ({ 
  label = "Location",
  placeholder = "Enter location",
  onPlaceSelect = () => {},
  className = "",
  required = false
}) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    const initializeAutocomplete = () => {
      if (!inputRef.current) return;
      
      // Check if Google Maps is available
      if (window.google && window.google.maps && window.google.maps.places) {
        try {
          console.log('Initializing Google Places...');
          
          // Use the working configuration from the HTML version
          autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ['geocode'],
            componentRestrictions: { country: 'IN' },
            fields: ['place_id', 'formatted_address', 'name', 'geometry']
          });

          autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current.getPlace();
            console.log('Place selected:', place);
            
            if (place && place.formatted_address) {
              onPlaceSelect({
                address: place.formatted_address,
                name: place.name,
                place_id: place.place_id,
                lat: place.geometry?.location?.lat(),
                lng: place.geometry?.location?.lng()
              });
            }
          });
          
          console.log('Google Places initialized successfully');
        } catch (error) {
          console.error('Error initializing Google Places:', error);
        }
      } else {
        console.log('Google Maps not available, retrying in 1 second...');
        setTimeout(initializeAutocomplete, 1000);
      }
    };

    // Try to initialize immediately or wait for Google Maps
    if (window.googleMapsLoaded || (window.google && window.google.maps && window.google.maps.places)) {
      initializeAutocomplete();
    } else {
      // Listen for the Google Maps loaded event
      const handleGoogleMapsLoaded = () => {
        console.log('Google Maps loaded event received');
        initializeAutocomplete();
      };
      
      window.addEventListener('googleMapsLoaded', handleGoogleMapsLoaded);
      
      // Also try periodically as fallback
      const interval = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          clearInterval(interval);
          initializeAutocomplete();
        }
      }, 500);

      return () => {
        window.removeEventListener('googleMapsLoaded', handleGoogleMapsLoaded);
        clearInterval(interval);
      };
    }
  }, []);

  return (
    <Form.Group className="">
      {label && <Form.Label className="booking-label">{label} {required && <span className="text-danger"></span>}</Form.Label>}
      <Form.Control
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className={className}
        autoComplete="off"
        required={required}
      />
      
    </Form.Group>
  );
};

export default SimpleGooglePlaces;