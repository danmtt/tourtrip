// Define variables to be used in all functions
var searchInput;
var setPlacePosition;

// Define variables to identify cluster buttons
var hotelMarker = getElementById('hotel-marker');
var foodMarker = getElementById('food-marker');
var pubMarker = getElementById('pub-marker');
var musicMarker = getElementById('music-marker');
var cultureMarker = getElementById('culture-marker');
var sportsMarker = getElementById('sports-marker');
var adventureMarker = getElementById('adventure-marker');
var relaxMarker = getElementById('relax-marker');

// Define map functionality
function initMap() {

  // To define the options to use with the map
  var mapOptions={
    disableDefaultUI: true,
    mapTypeId: 'satellite'
  }

  // To call the constructor from googleMaps API and build a new map defining the 
  // HTML element to render it and include the options stored in variable.
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);

  // To define which HTML element is the input search box.
  var searchInput = document.getElementById("search-input");

  // To help user to autocomplete the value typed into the searchInput HTML element, 
  // using google maps places library autocomplete functionality.
  autocomplete = new google.maps.places.Autocomplete(searchInput);

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

