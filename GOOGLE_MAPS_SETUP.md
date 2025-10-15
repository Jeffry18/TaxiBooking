# Google Maps API Setup Instructions

## 1. Get Your Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API (optional, for additional features)

4. Go to "Credentials" and create a new API key
5. Restrict your API key for security:
   - Application restrictions: Choose "HTTP referrers (web sites)"
   - Add your website domains (e.g., `localhost:5173`, `yourdomain.com`)
   - API restrictions: Select the APIs you enabled above

## 2. Update Your Project

Replace `YOUR_GOOGLE_MAPS_API_KEY` in `index.html` with your actual API key:

```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&libraries=places"></script>
```

## 3. Features Added

- **Smart Place Search**: Users can type any location and get real-time suggestions
- **Fallback Mode**: If Google Maps fails to load, it falls back to your existing places database
- **Location Coordinates**: Saves precise lat/lng coordinates for better routing
- **Multiple Stop Support**: Google Places integration for all pickup, drop, and extra stops
- **India-focused**: Restricted to Indian locations for better relevance
- **Mobile Optimized**: Works smoothly on all devices

## 4. API Key Security Tips

- Never commit your API key to public repositories
- Use environment variables for production:
  ```javascript
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  ```
- Set up proper domain restrictions
- Monitor your API usage in Google Cloud Console
- Consider setting up billing alerts

## 5. Customization Options

You can modify the search behavior in `GooglePlacesAutocomplete.jsx`:

- `types`: Change search types (geocode, establishment, cities)
- `country`: Change country restriction (default: 'IN' for India)
- `fields`: Modify what data to retrieve from places

## 6. Testing

1. Start your development server: `npm run dev`
2. Open the booking form
3. Try typing locations in the pickup/drop fields
4. You should see Google Places suggestions appear

## 7. Troubleshooting

- **No suggestions appearing**: Check browser console for API errors
- **Billing errors**: Ensure billing is enabled in Google Cloud Console
- **CORS errors**: Make sure your domain is whitelisted in API key restrictions
- **Fallback mode**: If Google Maps is unavailable, the form falls back to your existing places database