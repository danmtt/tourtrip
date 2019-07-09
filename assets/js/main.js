var map, marker;
var autocomplete, placeInfowindow,serviceInfowindow, service; // OBJECTS
var contentString; // Infowindow content


var markers = [];
var place,bounds;
var onClickClusterButton;
var service;

// Map function.
function initMap() {

  // map Object ("HTML element", {options})
  map = new google.maps.Map(document.getElementById("map"),{
    // To disable all map controls
    disableDefaultUI: true,
    // To display an specific type of map
    mapTypeId: 'satellite',
    zoom:5,
    // To empty map completely
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
  });

   // marker Object ({options})
  marker = new google.maps.Marker({
    label: "Your destination",
    title: "Click to zoom",
    animation: google.maps.Animation.BOUNCE
  });
  
  // infoiwindow Object + {content}
  contentString =
  '<div id="infowindow-content" class="d-flex flex-column justify-content-center ">'+
    '<h1 id="infowindow-heading" class="justify-content-center text-center"></h1>'+
    '<div id="bodyContent">'+
      '<div id="infowindow-description" class="text-center">Your destination is in <b><span id="place-type">(country)</span></b></div>'+
      '<div id="infowindow-image" class="justify-content-center img-responsive center-block"></div>' +
    '</div>'+
  '</div>';
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

    place = autocomplete.getPlace();
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
    
    // document.getElementById('map-user-selections').innerHTML = service.type;

    
    // function clearMarkers() {
    //   for (var i = 0; i < markers.length; i++) {
    //     markers[i].setMap(null);
    //   }
    //   markers = [];
    // };

    hotelMarkers.onclick = function() {      
      infowindow.close();
      map.setCenter(place.geometry.location);
      map.setZoom(15); // Zoom
      map.setMapTypeId("roadmap"); // TypeId
      onClickClusterButton ='lodging';

      // including the service into the .onclick event functionality make it works as desired, but...
      
                // To clear previous services existing markers
                // clearMarkers();
                // markers.setMap(null);

      // Perform a nearby search.
      // https://developers.google.com/maps/documentation/javascript/places

      service.nearbySearch({location: place.geometry.location, radius: 500, type: onClickClusterButton},
  
      function(results, status, pagination) {
        if (status !== 'OK') return;

        createMarkers(results);
        // moreButton.disabled = !pagination.hasNextPage;
        getNextPage = pagination.hasNextPage && function() {
            pagination.nextPage();
        };
      }
      );

      function createMarkers(places) {
        if (serviceMarker && serviceMarker.setMap) {
          marker.setMap(null);
        }
        
        // var bounds = new google.maps.LatLngBounds();
        var serviceList = document.getElementById('map-displayed-markers');
        
        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var labelIndex = 0;

        for (var i = 0, place; place = places[i]; i++) {  

          var serviceImage = {
            url: place.icon,
            size: new google.maps.Size(60, 60),
            origin: new google.maps.Point(0, 0),
            // anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25),
            // https://stackoverflow.com/questions/37441729/google-maps-custom-label-x-and-y-position
            labelOrigin: new google.maps.Point(12,0),
          };


          var serviceMarker = new google.maps.Marker({
            map: map,
            icon: serviceImage,
            title: place.name,
            // https://developers.google.com/maps/documentation/javascript/examples/marker-labels
            // https://github.com/jesstelford/node-MarkerWithLabel
            label: labels[labelIndex++ % labels.length],
            
            // label: place.name,
            position: place.geometry.location,
            animation: google.maps.Animation.DROP,
          });
          
          serviceMarker.addListener('click', function(){
            serviceInfowindow = new google.maps.InfoWindow();//{content: contentString}
            serviceInfowindow.open(map, serviceMarker);
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
          

          var li = document.createElement('li');
          li.textContent = place.name;
          serviceList.appendChild(li);
        }          
      }
    };
    foodMarkers.onclick = function() {      
      infowindow.close();
      map.setCenter(place.geometry.location);
      map.setZoom(20); // Zoom
      map.setMapTypeId("roadmap"); // TypeId
      onClickClusterButton ='restaurant';

      // including the service into the .onclick event functionality make it works as desired, but...
      
                // To clear previous services existing markers
                // clearMarkers();
                // markers.setMap(null);

      // Perform a nearby search.
      // https://developers.google.com/maps/documentation/javascript/places

      service.nearbySearch({location: place.geometry.location, radius: 500, type: onClickClusterButton},
  
      function(results, status, pagination) {
        if (status !== 'OK') return;

        createMarkers(results);
        // moreButton.disabled = !pagination.hasNextPage;
        getNextPage = pagination.hasNextPage && function() {
            pagination.nextPage();
        };
      }
      );

      function createMarkers(places) {
        if (marker && marker.setMap) {
          marker.setMap(null);
        }

        // var bounds = new google.maps.LatLngBounds();
        var serviceList = document.getElementById('map-displayed-markers');

        for (var i = 0, place; place = places[i]; i++) {
          // marker.setAnimation(google.maps.Animation.DROP);

          var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          var marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            // label: place.name,
            position: place.geometry.location,
            animation: google.maps.Animation.DROP,
          });
          

          var li = document.createElement('li');
          li.textContent = place.name;
          serviceList.appendChild(li);
        }          
      }
    };
  
  
  }); // End of autocomplete.addListener()

  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
}; // End of initMap()