
// Global variables
var map, autocomplete, infowindow, service; // OBJECTS
var mapCanvas, mapOptions; // map variables
var contentString; // Infowindow content
var markerMapOptions; // To set the style of the main marker in map (place)
var place,bounds;
var onClickClusterButton;
var service;

// Map function.
function initMap() {

  // OBJECTS UPDATE
  // --------------

  // MAP Object -----------------------------------------------------------------------------------
  // To define into a variable in which HTML element the map should be diplayed.
  var mapCanvas = document.getElementById("map");
  // To define into a variable the options to use with the map.  
  var mapOptions = {
    disableDefaultUI: true,
    mapTypeId: 'satellite',
    // to hide all labels from map
    // https://mapstyle.withgoogle.com/
    styles: [
      {
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.neighborhood",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      }
    ]
    
  };
  // To create the 'map' object, updating the values defined in a variable.
  // https://developers.google.com/maps/documentation/javascript/examples/map-simple
  map = new google.maps.Map(mapCanvas, mapOptions);
  
  // MARKER Object  -------------------------------------------------------------------------------
  // To define into a variable the options selected to modify the marker vehabiour an its style.
  // https://developers.google.com/maps/documentation/javascript/examples/marker-animations 
  var markerOptions = {
    animation: google.maps.Animation.BOUNCE,
    label: "Your destination",
    title: "Click to zoom"
    // https://developers.google.com/maps/documentation/javascript/examples/overlay-popup
    // icon: iconImage + 'parking_lot_maps.png',
  };
  // To create the 'marker' object, setting the options usig a variable previously defined.
  // https://developers.google.com/maps/documentation/javascript/markers
  marker = new google.maps.Marker(markerOptions)
  
  // INFOWINDOW Object  ---------------------------------------------------------------------------
  // To define into a variable the infowindow structure, storing inside an HTML Snippet 
  // in which to release the content retrieved
  contentString =
  '<div id="infowindow-content" class="d-flex flex-column justify-content-center ">'+
    '<h1 id="infowindow-heading" class="justify-content-center text-center"></h1>'+
    '<div id="bodyContent">'+
      '<div id="infowindow-description" class="text-center">Your destination is in <b><span id="place-type">(country)</span></b></div>'+
      '<div id="infowindow-image" class="justify-content-center img-responsive center-block"></div>' +
    '</div>'+
  '</div>';
  // To create the 'infowindow' object, setting the content retrieved using a variable 
  // previously defined.
  // https://developers.google.com/maps/documentation/javascript/infowindows
  infowindow = new google.maps.InfoWindow({content: contentString});
 
  // AUTOCOMPLETE Object  -------------------------------------------------------------------------
  // To define which HTML element is the input search box, setting that info in a variable.
  var searchInput = document.getElementById("search-input");
  // To define the search options to use with autocomplete, restricting the search to cities. 
  // This is to avoid street searches...
  var searchOptions = {
    type: ['(cities)'],
  };
  // To create the 'autocomplete' object, updating the values defined in two variables.
  // https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
  autocomplete = new google.maps.places.Autocomplete(searchInput, searchOptions);

  // To set 'bounds' values into map created.
  autocomplete.bindTo('bounds', map); 
   
  // SERVICE Object  ----------------------------------------------------------------------------- 
  // To create the 'service' object, relating the information to map created.
  //https://developers.google.com/maps/documentation/javascript/examples/place-search-pagination
  service = new google.maps.places.PlacesService(map); 
  
  // To add a listening method to the 'autocomplete' object,
  // that will run a custom callback function in response to the media query status changing.
  autocomplete.addListener('place_changed', function() {
    infowindow.close();

    // To add the marker created into the map.
    marker.setMap(map);

    var place = autocomplete.getPlace();
    // To add the name of the place searched into one of the HTML modal's elements
    document.getElementById('destination').innerHTML = place.name;

    
    // This condition checks if the name of a Place introduced
    // by the user after pressing the Enter key (not the Search button),
    // hasn't been suggested, or if the Place Details request failed.
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    };
    
    map.setCenter(place.geometry.location);
    map.setZoom(3); 

    // This condition checks if the place has a geometry,
    // then present the place zoomed in the map.
    // if (place.geometry.viewport) {
    //   map.setCenter(place.geometry.location);
    //   map.fitBounds(place.geometry.viewport);
    //   map.setZoom(10);
    // } else {
    //   map.setCenter(place.geometry.location);
    //   map.setZoom(10);
    // }    

    // Set the position of the marker using the place ID and location.
    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location,
    });
    marker.setVisible(true);
 
    marker.addListener('click', function() {

      // To stop the marker bouncing when clicking on it.
      // https://developers.google.com/maps/documentation/javascript/examples/marker-animations
      marker.setAnimation(google.maps.Animation.DROP);
      
      // To update map options when clicking on bouncing marker
      // https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions
      // https://www.w3schools.com/graphics/google_maps_types.asp
      // https://ourcodeworld.com/articles/read/831/how-to-change-and-preview-map-type-in-google-maps-dinamically-with-javascript
      map.setZoom(15); // Zoom
      map.setMapTypeId("roadmap"); // TypeId
      
      infowindow.open(map, marker);
      // To set the values retrieved from the calllback function to different HTML elements in the modal form.      
      document.getElementById('infowindow-heading').innerHTML = place.name; 

      // To select the first image available using a call back function as method to another previous function
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
    
    // To set an event listener to 'map' when clicking out of infowindow,
    // this one dissapears and the map is centered to the marker position  
    
    map.addListener('click', function() {
      infowindow.close();
      map.setCenter(place.geometry.location);
    });
    
 
  // display onClickClusterButton into an html element
   
  var onClickClusterButton = '';

  // Cluster buttons id list
  // hotel-markers, food-markers, pub-markers, atm-markers, 
  // museum-markers, gallery-markers, zoo-markers, stadium-markers,
  // bus-markers,  subway-markers, taxi-markers, airport-markers

  // Google maps search types values to assign to variable when onclick over an
  // specific button with defined id. 
  // https://developers.google.com/places/web-service/supported_types
  // lodging, restaurant, nigth_club, atm, museum, art_gallery, zoo, stadium,
  // bus_station, subway_station, taxi_stand, airport

// To assign the right value to a variable on different clicks
// https://stackoverflow.com/questions/7132547/set-a-variable-value-on-click-display-the-value
// Test to check that click on button works ok and the right value is set to the variable!
// https://stackoverflow.com/questions/4825295/javascript-onclick-to-get-the-id-of-the-clicked-button
// https://stackoverflow.com/questions/2788191/how-to-check-whether-a-button-is-clicked-by-using-javascript
// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button

  // Set variables for specific buttons id´s to check onClick events
  let hotelMarkers = document.querySelector('#hotel-markers');
  let foodMarkers = document.querySelector('#food-markers');
  let pubMarkers = document.querySelector('#pub-markers');
  let atmMarkers = document.querySelector('#atm-markers');
  let museumMarkers = document.querySelector('#museum-markers');
  let galleryMarkers = document.querySelector('#gallery-markers');
  let zooMarkers = document.querySelector('#zoo-markers');
  let stadiumMarkers = document.querySelector('#stadium-markers');
  let busMarkers = document.querySelector('#bus-markers');
  let subwayMarkers = document.querySelector('#subway-markers');
  let taxiMarkers = document.querySelector('#taxi-markers');
  let airportMarkers = document.querySelector('#airport-markers');
  
  hotelMarkers.onclick = function() {
    onClickClusterButton ='lodging';
    // test onClickClusterButton value change
    document.getElementById('map-user-selections').innerHTML = onClickClusterButton;
    infowindow.close();
    map.setCenter(place.geometry.location);
  };  
  foodMarkers.onclick = function() {
    onClickClusterButton ='restaurant';
    // test onClickClusterButton value change
    document.getElementById('map-user-selections').innerHTML = onClickClusterButton;
    infowindow.close();
    map.setCenter(place.geometry.location);
  };
  pubMarkers.onclick = function() {
    onClickClusterButton ='nigth_club';
    // test onClickClusterButton value change
    document.getElementById('map-user-selections').innerHTML = onClickClusterButton;
    infowindow.close();
    map.setCenter(place.geometry.location);
  };
  atmMarkers.onclick = function() {
    onClickClusterButton ='atm';
    // test onClickClusterButton value change
    document.getElementById('map-user-selections').innerHTML = onClickClusterButton;
    infowindow.close();
    map.setCenter(place.geometry.location);
  };
  museumMarkers.onclick = function() {
    onClickClusterButton ='museum';
    // test onClickClusterButton value change
    document.getElementById('map-user-selections').innerHTML = onClickClusterButton;
    infowindow.close();
    map.setCenter(place.geometry.location);
  };
  galleryMarkers.onclick = function() {
    onClickClusterButton ='art_gallery';
    // test onClickClusterButton value change
    document.getElementById('map-user-selections').innerHTML = onClickClusterButton;
    infowindow.close();
    map.setCenter(place.geometry.location);
  };
  zooMarkers.onclick = function() {
    onClickClusterButton ='zoo';
    // test onClickClusterButton value change
    document.getElementById('map-user-selections').innerHTML = onClickClusterButton;
    infowindow.close();
    map.setCenter(place.geometry.location);
  };
  stadiumMarkers.onclick = function() {
    onClickClusterButton ='stadium';
    // test onClickClusterButton value change
    document.getElementById('map-user-selections').innerHTML = onClickClusterButton;
    infowindow.close();
    map.setCenter(place.geometry.location);
  };
  busMarkers.onclick = function() {
    onClickClusterButton ='bus_station';
    // test onClickClusterButton value change
    document.getElementById('map-user-selections').innerHTML = onClickClusterButton;
    infowindow.close();
    map.setCenter(place.geometry.location);
  };
  subwayMarkers.onclick = function() {
    onClickClusterButton ='subway_station';
    // test onClickClusterButton value change
    document.getElementById('map-user-selections').innerHTML = onClickClusterButton;
    infowindow.close();
    map.setCenter(place.geometry.location);
  };
  taxiMarkers.onclick = function() {
    onClickClusterButton ='taxi_stand';
    // test onClickClusterButton value change
    document.getElementById('map-user-selections').innerHTML = onClickClusterButton;
    infowindow.close();
    map.setCenter(place.geometry.location);
  };
  // Autotrick to get the right size of map, defining a variable thet doesnt exist ,
  // so JS doesnt carry on and zoom is set to 3.
  airport.onclick = function() {
  // airportMarkers.onclick = function() {
    onClickClusterButton ='airport';
    // test onClickClusterButton value change
    document.getElementById('map-user-selections').innerHTML = onClickClusterButton;
    infowindow.close();
    map.setCenter(place.geometry.location);
  };

  // Perform a nearby search.
  // https://developers.google.com/maps/documentation/javascript/places

  // service.nearbySearch( {location: place.geometry.location, radius: 500, type: ['lodging']},
  service.nearbySearch({location: place.geometry.location, radius: 500, type: onClickClusterButton},
 
  function(results, status, pagination) {
    if (status !== 'OK') return;

      createMarkers(results);
      moreButton.disabled = !pagination.hasNextPage;
      getNextPage = pagination.hasNextPage && function() {
        pagination.nextPage();
      };
    });

  // RESULTS PAGINATION
  // ------------------
  // https://developers.google.com/maps/documentation/javascript/examples/place-search-pagination
  var getNextPage = null;
  var moreButton = document.getElementById('more');
        
  moreButton.onclick = function() {
      moreButton.disabled = true;
      if (getNextPage) getNextPage();
    }; 
  
  function createMarkers(places) {

    // var bounds = new google.maps.LatLngBounds();
    var serviceList = document.getElementById('map-displayed-markers');

    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // var marker = new google.maps.Marker({
      //   map: map,
      //   icon: image,
      //   title: place.name,
      //   position: place.geometry.location
      // });
      

      var li = document.createElement('li');
      li.textContent = place.name;
      serviceList.appendChild(li);

      // bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);    
  }
}); // End of autocomplete.addListener()
  

}; // End of initMap()





  
