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

  // MAP
  // ---
  // To define in which HTML element the map should be diplayed.
  var mapCanvas = document.getElementById("map");

  // To define the options to use with the map.
  var mapOptions={
    disableDefaultUI: true,
    mapTypeId: 'satellite'
  };

  // To create the 'map' object,
  // call the constructor from googleMaps API
  // associating to it the mapCanvas and the mapOptions.
  // https://developers.google.com/maps/documentation/javascript/examples/map-simple
  map = new google.maps.Map(mapCanvas, mapOptions);

  // INFO WINDOW
  // -----------
  // To define the infowindow content in a variable.
  // creating an HTML Snippet in which to release
  // the 'infowindow' content,
  // storing that element

  var contentString =
  '<div id="infowindow-content" class="justify-content-center">'+
    '<h1 id="infowindow-heading" class="justify-content-center"></h1>'+
    '<div id="bodyContent" class="justify-content-center">'+
      '<div id="infowindow-description">Your destination is a <b><span id="place-type"></span></b></div>'+
      '<div id="infowindow-image" class="justify-content-center media-middle"></div>' +
    '</div>'+
  '</div>';


  // To create the 'infowindow' object,
  // calling the constructor from googleMaps API
  // setting the content retrieved using a variable previously defined.
  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });


  // MARKER
  // ------------

  marker = new google.maps.Marker({
    map:map,
    animation: google.maps.Animation.DROP,
    title: "Your destination"
    // icon: iconImage + 'parking_lot_maps.png',
   });

   // AUTOCOMPLETE
  // ------------
  // To define which HTML element is the input search box,
  // storing that link in a variable.
  var searchInput = document.getElementById("search-input");

  // To define the search options to use with autocomplete, restricting the
  // search to cities. This is to avoid street searches...
  var searchOptions={
    type: ['(cities)'],
  };

  // To create the 'autocomplete' object,
  // calling the constructor from googleMaps API
  // and associating to it the searchInput and the searchOptions.
  // https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
  autocomplete = new google.maps.places.Autocomplete(searchInput, searchOptions);

  // To transfer from 'autocomplete' object,
  // the area in which to search for the Place
  // into the map created.
  autocomplete.bindTo('bounds', map);  

  // To add a listening method to the 'autocomplete' object,
  // that will run a custom callback function in response to the media query status changing.
  autocomplete.addListener('place_changed', function() {
    infowindow.close();

    var place = autocomplete.getPlace();
    
    // This condition checks if the name of a Place introduced
    // by the user after pressing the Enter key (not the Search button),
    // hasn't been suggested, or if the Place Details request failed.
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // This condition checks if the place has a geometry,
    // then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
      map.setZoom(3);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(3);
    }    

    // Set the position of the marker using the place ID and location.
    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location,
    });

    marker.setVisible(true);
      
    // To set an event listener when clicking the marker, opening the info window
    // updating information about the place selected
    // and zooming into the location.
    marker.addListener('click', function() {

      // document.getElementById('infowindow-image').removeChild(img);
      infowindow.open(map, marker);
      map.setZoom(8);
    
      // To set the values retrieved from the calllback function
      // to different HTML elements in the modal form.
      document.getElementById('destination').innerHTML = place.name;
      document.getElementById('infowindow-heading').innerHTML = place.name;
    
      // To select the first image available using a call back function
      // as method to another previous function
      // and store it into a variable.

      var placeImg = place.photos[0].getUrl({maxWidth: 300, maxHeight: 300});
    
      // To create an img object and set its attributes using a variable
      // and append its value to the infowindow HTML snippet element. 
      var img = document.createElement("img");    
      img.setAttribute('src', placeImg);
      
      // To avoid the appending of more than one picture when click on marker several times
      var infowindowImageCount = document.getElementById('infowindow-image').childElementCount;
      if (infowindowImageCount >0) {
        document.getElementById('infowindow-image').removeChild(img);
        } else {
          document.getElementById('infowindow-image').appendChild(img); 
      }   
    });
  });
};

// Cluster functionality

// Add event listeners to every cluster in the modal form so when clicked ,
// markers related are updated to map.

// function onClickClusterButton(){
//   var lookFor = {
//     bounds: map.getBounds(),
//     types: ["lodging"]
//   };
//   window.alert("Hotels have been selected for : '" + place.name + "'");
// };

// Hotel markers
// https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-hotelsearch



hotelMarker.addEventListener("click", function lookFor() {

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
