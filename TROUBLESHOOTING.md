# Google Places Troubleshooting Guide

## 🔍 **Current Status Check**

Your app now has comprehensive debugging. Open your website and look for the debug information under the "From (Test)" field. It will show:

- ✅ or ❌ for Google API loading status
- Real-time loading messages
- "Test API Key" button for manual testing

## 🚨 **Common Issues & Solutions**

### **1. Google Maps Not Loading**

**Symptoms:**
- Debug shows: Google: ❌, Maps: ❌, Places: ❌
- Message: "Loading Google Maps API..."

**Solutions:**
- Check your internet connection
- Verify the API key is correct in `index.html`
- Check browser console for network errors

### **2. API Key Issues**

**Symptoms:**
- Browser console shows "Google Maps JavaScript API error: ApiNotActivatedMapError"
- Debug shows loading but no autocomplete

**Solutions:**
- Enable Maps JavaScript API in Google Cloud Console
- Enable Places API in Google Cloud Console
- Check API key restrictions (allow your domain)

### **3. Billing Issues**

**Symptoms:**
- Console error: "Google Maps JavaScript API error: UnauthorizedURLForClientIdMapError"
- API works but stops after a few requests

**Solutions:**
- Enable billing in Google Cloud Console
- Check your usage limits
- Verify payment method is valid

### **4. Domain Restrictions**

**Symptoms:**
- Works on localhost but not on production domain
- Console error: "RefererNotAllowedMapError"

**Solutions:**
- Add your production domain to API key restrictions
- For development: add `localhost:5175`, `localhost:5173`, etc.
- For production: add your actual domain

## 🧪 **Testing Steps**

### **Step 1: Check Debug Information**
1. Open your website at http://localhost:5175/
2. Look at the "From (Test)" field
3. Check the debug status indicators
4. Click "Test API Key" button

### **Step 2: Browser Console**
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for Google Maps related messages
4. Check for any red error messages

### **Step 3: Network Tab**
1. In Developer Tools, go to Network tab
2. Refresh the page
3. Look for `maps.googleapis.com` requests
4. Check if they return 200 (success) or error codes

## 🔧 **Quick Fixes**

### **If Nothing Loads:**
```html
<!-- Check this script in index.html -->
<script async defer 
  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD1hya_2cUTOJIKAi6m0gDywebNBJd4rEA&libraries=places&callback=initGoogleMaps"
  onerror="googleMapsError()">
</script>
```

### **If API Key is Invalid:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Check your API key restrictions
4. Ensure Places API and Maps JavaScript API are enabled

### **If Working on Localhost but Not Production:**
1. Update API key restrictions
2. Add your production domain
3. Ensure HTTPS is used for production

## 📋 **Debug Checklist**

- [ ] Internet connection working
- [ ] Google Cloud Console APIs enabled
- [ ] Billing enabled (if using more than free tier)
- [ ] API key has correct restrictions
- [ ] Browser console shows no errors
- [ ] Debug status shows all ✅
- [ ] Can type in the input field
- [ ] Autocomplete suggestions appear

## 🆘 **Still Not Working?**

If you're still having issues, please share:

1. **Debug Status**: What do you see under "From (Test)" field?
2. **Console Errors**: Any red errors in browser console?
3. **Network Status**: Are there failed requests to maps.googleapis.com?
4. **Environment**: Localhost or production domain?

Common error messages and their meanings:

- `ApiNotActivatedMapError`: Enable Maps JavaScript API
- `RefererNotAllowedMapError`: Add your domain to API restrictions
- `UnauthorizedURLForClientIdMapError`: Check billing/API key
- `RequestDeniedMapError`: API key invalid or quota exceeded

## 🎯 **Expected Behavior When Working**

1. Page loads → Debug shows "Loading Google Maps API..."
2. After 1-2 seconds → Debug shows all ✅
3. Message changes to "Google Places ready! Start typing..."
4. Typing in field → Dropdown suggestions appear
5. Selecting suggestion → Field fills with full address