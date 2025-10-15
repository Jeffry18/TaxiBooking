import React, { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import { GOOGLE_MAPS_CONFIG, GOOGLE_MAPS_UTILS } from '../config/googleMapsConfig';

const GooglePlacesAutocomplete = ({ 
  value, 
  onPlaceSelect = () => {}, 
  placeholder = "Enter location", 
  className = "",
  label = "",
  required = false,
  name = "",
  types = ['geocode'],
  country = 'IN',
  fallbackOptions = []
}) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [useUncontrolled, setUseUncontrolled] = useState(false);

  // Initialize input value from props only once
  useEffect(() => {
    if (value && !isInitialized) {
      setInputValue(value);
      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  useEffect(() => {
    // Check if Google Maps API is loaded
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsGoogleMapsLoaded(true);
        return true;
      }
      return false;
    };

    if (checkGoogleMaps()) {
      initializeAutocomplete();
    } else {
      // Wait for Google Maps to load
      const interval = setInterval(() => {
        if (checkGoogleMaps()) {
          clearInterval(interval);
          initializeAutocomplete();
        }
      }, 100);

      // Stop checking after 10 seconds
      setTimeout(() => {
        clearInterval(interval);
        if (!isGoogleMapsLoaded) {
          console.warn('Google Maps API failed to load. Using fallback mode.');
        }
      }, 10000);

      return () => clearInterval(interval);
    }
  }, []);

  const initializeAutocomplete = () => {
    if (!inputRef.current) return;

    // Initialize the autocomplete with enhanced options for Places API (New)
    const options = {
      ...GOOGLE_MAPS_CONFIG.AUTOCOMPLETE_OPTIONS,
      types: types,
      componentRestrictions: { country: country },
      fields: GOOGLE_MAPS_CONFIG.PLACE_FIELDS
    };

    // Small delay to ensure the input is ready
    setTimeout(() => {
      try {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          options
        );

        // Add place changed listener with enhanced data extraction
        const listener = autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          
          if (place && place.formatted_address) {
            // Use the enhanced formatting from config
            const selectedPlace = GOOGLE_MAPS_UTILS.formatPlaceForBooking(place);
            
            // Validate if it's a good taxi location
            if (GOOGLE_MAPS_UTILS.isValidTaxiLocation(place)) {
              setInputValue(place.formatted_address);
              onPlaceSelect(selectedPlace);
            } else {
              // Still allow the selection but maybe show a warning
              setInputValue(place.formatted_address);
              onPlaceSelect({
                ...selectedPlace,
                warning: 'This location might not be ideal for taxi pickup/drop'
              });
            }
          }
        });

        setIsGoogleMapsLoaded(true);
        setUseUncontrolled(true); // Switch to uncontrolled mode for Google Places

        // Cleanup function
        return () => {
          if (listener) {
            window.google.maps.event.removeListener(listener);
          }
        };
      } catch (error) {
        console.error('Error initializing autocomplete:', error);
      }
    }, 100);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // If user clears the input, notify parent
    if (!newValue) {
      onPlaceSelect({ address: '', name: '', place_id: '', lat: null, lng: null });
    }
  };

  const handleKeyDown = (e) => {
    // Prevent form submission when Enter is pressed while selecting from dropdown
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleFallbackSelect = (selectedOption) => {
    const selectedPlace = {
      address: selectedOption.value,
      name: selectedOption.label,
      place_id: '',
      lat: null,
      lng: null
    };
    setInputValue(selectedOption.value);
    onPlaceSelect(selectedPlace);
  };

  // If Google Maps is not loaded and fallback options are provided, use Select component
  if (!isGoogleMapsLoaded && fallbackOptions && fallbackOptions.length > 0) {
    return (
      <Form.Group className="mb-3">
        {label && <Form.Label>{label} {required && <span className="text-danger">*</span>}</Form.Label>}
        <Select
          options={fallbackOptions}
          value={inputValue ? { value: inputValue, label: inputValue } : null}
          onChange={handleFallbackSelect}
          placeholder={placeholder}
          className={className}
          isSearchable
          required={required}
        />
        <Form.Text className="text-muted">
          <small>Google Maps unavailable - using preset locations</small>
        </Form.Text>
      </Form.Group>
    );
  }

  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label} {required && <span className="text-danger">*</span>}</Form.Label>}
      <div className="position-relative">
        <Form.Control
          ref={inputRef}
          type="text"
          name={name}
          {...(useUncontrolled ? {} : { value: inputValue })}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`${className} google-places-input`}
          autoComplete="off"
          required={required}
        />
        <i className="bi bi-geo-alt position-absolute end-0 top-50 translate-middle-y me-3 text-muted"></i>
      </div>
      <Form.Text className="text-muted">
        <small>
          {isGoogleMapsLoaded 
            ? "Start typing to search for places" 
            : "Loading Google Maps..."
          }
        </small>
      </Form.Text>
    </Form.Group>
  );
};

export default GooglePlacesAutocomplete;