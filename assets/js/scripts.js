// Define variables to be used in all functions
let searchInput;

// Define map functionality
function initMap() {

  // To call back from googleMaps API for a new map and select the 
  // identity of the HTML element to render it.
  var map = new google.maps.Map(document.getElementById('map'));
 
    // Options to include in the future
    // { 
    // center: {lat: 51.4934, lng: 0.0098}, // Greenwich coordinates,
    // zoom: 13, // Zoom definition, far away at first...
    // mapTypeId: 'roadmap' // Default 2D map
    // }

  // To define which HTML element is the input search box.
  searchInput = document.getElementById("search-input");

  // To help user to autocomplete the value typed into the searchInput HTML element, 
  // using google maps places library autocomplete functionality.
  autocomplete = new google.maps.places.Autocomplete(searchInput);

  // To link that place / set its limits into the map.
  autocomplete.bindTo('bounds', map);

  // To select only the data fields needed.
  autocomplete.setFields(['place_id', 'geometry', 'name']);

// To call back from googleMaps API for InfoWindow information about window for the place selected.
var infowindow = new google.maps.InfoWindow();
// To define the identity of the element that will contain the informationthe information retrieved from googlemaps into a variable.
var infowindowContent = document.getElementById('infowindow-content');
// To send the information retrieved from googlemaps into a variable.
        infowindow.setContent(infowindowContent);

        var marker = new google.maps.Marker({map: map});

        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });

        autocomplete.addListener('place_changed', function() {
          infowindow.close();

          var place = autocomplete.getPlace();

          if (!place.geometry) {
            return;
          }

          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
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
          infowindowContent.children['place-address'].textContent =
              place.formatted_address;
          infowindow.open(map, marker);
        });

}