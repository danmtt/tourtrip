// Define variables to identify cluster buttons.
var hotelMarker = getElementById('hotel-marker');
var foodMarker = getElementById('food-marker');
var pubMarker = getElementById('pub-marker');
var musicMarker = getElementById('music-marker');
var cultureMarker = getElementById('culture-marker');
var sportsMarker = getElementById('sports-marker');
var adventureMarker = getElementById('adventure-marker');
var relaxMarker = getElementById('relax-marker');
  
// Map functionality.
function initMap() {

  // To define in which HTML element the map should be diplayed.
  var mapCanvas = document.getElementById("map");
    
  // To define the options to use with the map.
  var mapOptions={
    disableDefaultUI: true,
    mapTypeId: 'satellite'
  };

  // To define which HTML element is the input search box, 
  // storing the value typed in a variable.
  var searchInput = document.getElementById("search-input");
  
  // To define the search options to use with autocomplete, restricting the 
  // search to cities. This is to avoid street searches...
  var searchOptions={
    type: ['(cities)'],
  };

  // To create the 'map' object,
  // call the constructor from googleMaps API
  // associating to it the mapCanvas and the mapOptions.
  // https://developers.google.com/maps/documentation/javascript/examples/map-simple
  map = new google.maps.Map(mapCanvas, mapOptions);

  // To create the 'autocomplete' object,
  // calling the constructor from googleMaps API
  // and associating to it the searchInput and the searchOptions.
  // https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
  autocomplete = new google.maps.places.Autocomplete(searchInput, searchOptions); 
 
  
  // autocomplete.addListener('place_changed', onPlaceChanged);
  
  // To link that place / set its limits into the map.
  autocomplete.bindTo('bounds', map);

  // To select only the data fields needed.
  autocomplete.setFields(['place_id', 'geometry', 'name']);

  // To call back from googleMaps API for an information window 
  // without setting the HTML element to render. 
  var infowindow = new google.maps.InfoWindow();

  // To define the identity of the element that will contain the informationthe information retrieved from googlemaps into a variable.
  var infowindowContent = document.getElementById('infowindow-content');

  // To send the information retrieved from googlemaps into a variable.
  infowindow.setContent(infowindowContent);

  var marker = new google.maps.Marker({map: map});
  // To set an event listener when clicking the marker, opening the info window
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });

        autocomplete.addListener('place_changed', function() {
          infowindow.close();

          var place = autocomplete.getPlace();
          // var pos = map.getZoom();

          if (!place.geometry) {
            return;
          }

          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            // map.setCenter(marker.getPosition());
            // map.setZoom(pos);
            map.setCenter(place.geometry.location);
            map.setZoom(17);        
          }

          // Set the position of the marker using the place ID and location.
          marker.setPlace({
            placeId: place.place_id,
            location: place.geometry.location
          });

          marker.setVisible(true);

          infowindowContent.children['place-name'].textContent = place.name;
          infowindowContent.children['place-id'].textContent = place.place_id;
          infowindowContent.children['place-address'].textContent = place.formatted_address;
          infowindow.open(map, marker);
        });

};

// Cluster functionality

// Add event listeners to every cluster in the modal form so when clicked ,
// markers related are updated to map.

// Hotel markers
// https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-hotelsearch
hotelMarker.addEventListener("click", function lookFor() {

  var lookFor = {
    bounds: map.getBounds(),
    types: ["lodging"]
  };
 
  // To create the 'service' object,
  // calling the constructor from googleMaps API,
  // looking for all the services offered within the the map object.
  // This should allow further selection clicking in cluster buttons...
  // https://developers.google.com/maps/documentation/javascript/examples/place-details
  services = new google.maps.places.PlaceService(map);

  services.nearbySearch(lookFor, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      clearResults();
      clearMarkers();
      // Create a marker for each hotel found, and
      // assign a letter of the alphabetic to each marker icon.
      for (var i = 0; i < results.length; i++) {
        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
        var markerIcon = MARKER_PATH + markerLetter + '.png';
        // Use marker animation to drop the icons incrementally on the map.
        markers[i] = new google.maps.Marker({
          position: results[i].geometry.location,
          animation: google.maps.Animation.DROP,
          icon: markerIcon
        });
        // If the user clicks a hotel marker, show the details of that hotel
        // in an info window.
        markers[i].placeResult = results[i];
        google.maps.event.addListener(markers[i], 'click', showInfoWindow);
        setTimeout(dropMarker(i), i * 100);
        addResult(results[i], i);
      }
    }
  });
});

// Function to clear markers in map
function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
    }
  }
  markers = [];
};
// Function to clear results in map
function clearResults() {
  var results = document.getElementById('results');
  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
};

function onPlaceChanged() {
  var place = autocomplete.getPlace();
  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(15);
    search();
  } else {
    document.getElementById('autocomplete').placeholder = 'Enter a city';
  }
}
