// Add these variables at the top of your script
let map;
let marker;
let geocoder;

// Update the initMap function
function initMap() {
  // ... (keep existing code)

  geocoder = new google.maps.Geocoder();

  const searchButton = document.getElementById('search-button');
  searchButton.addEventListener('click', () => {
    const address = document.getElementById('search-input').value;
    geocodeAddress(address);
  });
}

// Add this new function
function geocodeAddress(address) {
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === 'OK') {
      map.setCenter(results[0].geometry.location);
      if (marker) {
        marker.setMap(null);
      }
      marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
