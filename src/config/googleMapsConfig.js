// Google Maps API Configuration
export const GOOGLE_MAPS_CONFIG = {
  // Your Places API (New) key
  API_KEY: 'AIzaSyD1hya_2cUTOJIKAi6m0gDywebNBJd4rEA',
  
  // Default settings for Places API (New)
  DEFAULT_COUNTRY: 'IN',
  DEFAULT_TYPES: ['geocode'],
  
  // Enhanced field selection for Places API (New)
  PLACE_FIELDS: [
    'place_id',
    'formatted_address',
    'name',
    'geometry.location',
    'address_components',
    'types',
    'plus_code',
    'business_status',
    'opening_hours',
    'rating'
  ],
  
  // Autocomplete options for taxi booking
  AUTOCOMPLETE_OPTIONS: {
    strictBounds: false,
    bounds: null,
    // Restrict to places in India for taxi service
    componentRestrictions: { country: 'IN' },
    // Prefer locations that are good for taxi pickup/drop
    types: ['geocode', 'establishment']
  },
  
  // API URLs for Places API (New)
  PLACES_API_BASE_URL: 'https://places.googleapis.com/v1',
  
  // Rate limiting and performance settings
  DEBOUNCE_DELAY: 300, // ms to wait before making API calls
  MAX_SUGGESTIONS: 5,
  
  // Error messages
  ERROR_MESSAGES: {
    API_KEY_INVALID: 'Google Maps API key is invalid or not authorized',
    PLACES_NOT_LOADED: 'Google Places API is not loaded',
    GEOCODING_FAILED: 'Failed to get location coordinates',
    NETWORK_ERROR: 'Network error while accessing Google Places API'
  }
};

// Helper functions for Places API (New)
export const GOOGLE_MAPS_UTILS = {
  // Extract specific address component
  extractAddressComponent: (addressComponents, type) => {
    if (!addressComponents) return null;
    const component = addressComponents.find(comp => comp.types.includes(type));
    return component ? component.long_name : null;
  },
  
  // Format place data for taxi booking
  formatPlaceForBooking: (place) => {
    if (!place) return null;
    
    return {
      // Basic location info
      address: place.formatted_address,
      name: place.name,
      place_id: place.place_id,
      
      // Coordinates
      lat: place.geometry?.location?.lat(),
      lng: place.geometry?.location?.lng(),
      
      // Detailed address breakdown
      city: GOOGLE_MAPS_UTILS.extractAddressComponent(place.address_components, 'locality'),
      state: GOOGLE_MAPS_UTILS.extractAddressComponent(place.address_components, 'administrative_area_level_1'),
      country: GOOGLE_MAPS_UTILS.extractAddressComponent(place.address_components, 'country'),
      postal_code: GOOGLE_MAPS_UTILS.extractAddressComponent(place.address_components, 'postal_code'),
      
      // Additional metadata
      types: place.types || [],
      plus_code: place.plus_code?.global_code || null,
      
      // Business info (if available)
      business_status: place.business_status || null,
      rating: place.rating || null,
      is_open: place.opening_hours?.open_now || null
    };
  },
  
  // Validate if a place is suitable for taxi pickup/drop
  isValidTaxiLocation: (place) => {
    if (!place || !place.geometry) return false;
    
    // Check if it's a valid location type for taxi service
    const validTypes = [
      'premise', 'subpremise', 'street_address', 'route',
      'intersection', 'neighborhood', 'locality',
      'establishment', 'point_of_interest', 'airport',
      'train_station', 'bus_station', 'shopping_mall',
      'hospital', 'hotel', 'restaurant'
    ];
    
    return place.types && place.types.some(type => validTypes.includes(type));
  }
};

export default GOOGLE_MAPS_CONFIG;