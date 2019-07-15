// Global scope declarations
var map, marker, infowindow, autocomplete, service; // map objects declaration
var searchInput; // autocomplete search box
// var place; // autocomplete objects declaration
// var placeInfowindow,serviceInfowindow; // OBJECTS
var contentString; // Infowindow content

var markers;
var place, bounds;
var onClickClusterButton;
var serviceMarkers;
// var service;

// map function
function initMap() {

  // Objects' Definitions
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

   // Infowindow content 
   var contentString =  
    '<div id="infowindow-content" class="d-flex flex-column justify-content-center ">'+
    '<h1 id="infowindow-heading" class="justify-content-center text-center"></h1>'+
    '<div id="bodyContent">'+
      '<div id="infowindow-description" class="text-center">Your destination is in <b><span id="place-type">(country)</span></b></div>'+
      '<div id="infowindow-image" class="justify-content-center img-responsive center-block"></div>' +
    '</div>'+
  '</div>';
    
  // infowindow Object + {content: HTML snippet}
  infowindow = new google.maps.InfoWindow({content: contentString});
  
  // autocomplete Object ("HTML element"set into a variable, {options})
  var searchInput = document.getElementById("search-input"); 
  autocomplete = new google.maps.places.Autocomplete(searchInput, {
     // Places type specification to avoid street searches
     type: ['(cities)']
  });
  // service Object (object referral)
  service = new google.maps.places.PlacesService(map); 
  // https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-hotelsearch

  // Objects' Methods
  // autocomplete Methods
 
  autocomplete.bindTo('bounds', map);   // To set 'bounds' values into map created.
  // To add a listening method to return a response due to the media query status changing.
  autocomplete.addListener('place_changed', function() {
    
    // Objects' Definition
    // place Object()
    var place = autocomplete.getPlace(); // This callback should return all places features to an array, inside a variabke
    // console.log (place); // Object check purposes only

    // Objects' Methods called inside autocomplete (related to its results)
    infowindow.close(); // To close and reset any previous value set to this object   
    marker.setMap(map); // To add the marker created into the map
    
    // Condition to cheeck if the name of a place typed in searchInput is empty
    // or hasn't been suggested, or if the Place Details request failed.
    if (!place.geometry || searchInput ==='') {
      window.alert("Please, select one of the suggested places and click on 'Search'. There are no current details available for your selection : '" + place.name + "'");
      return;
    };

    map.setCenter(place.geometry.location);
    map.setZoom(3);        

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

    var onClickClusterButton = '';
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
      // clearMarkers();    
      infowindow.close();
      map.setCenter(place.geometry.location);
      map.setZoom(15); // Zoom
      map.setMapTypeId("roadmap"); // TypeId
      onClickClusterButton ='lodging';

      // function clearMarkers() {
      //   for (var i = 0; i < erviceMmarkers.length; i++) {
      //   serviceMarkers[i].setMap(null);
      //   }
      //   serviceMarkers = [];
      // };

      // Check display onClickClusterButton into an html element
      document.getElementById('map-user-selections').innerHTML = onClickClusterButton;

      // including the service into the .onclick event functionality make it works as desired, but...

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
        if (serviceMarkers && serviceMarkers.setMap) {
          serviceMarkers.setMap(null);
        }
        
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

          var serviceMarkers = new google.maps.Marker({
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


          serviceMarkers.setPlace({
            placeId: place.place_id,
            location: place.geometry.location,
            });

          var li = document.createElement('li');
          li.textContent = place.name + " "+labels[i];
          serviceList.appendChild(li);
        }
        
        serviceMarkers.addListener('click', function(){
          // var serviceInfo  = autocomplete.getPlace();
          // service = new google.maps.places.PlacesService(map);
          place.getDetails({placeId: serviceMarkers.placeId});
          // var place = autocomplete.getPlace();
          // service.getDetails(place.placeId);
          // var serviceInfo = service.getDetails();
          console.log (serviceMarkers); // Object check purposes only 
          // infowindow = new google.maps.InfoWindow({content: contentString});
          infowindow.open(map, place);
          // To set the values retrieved from the calllback function to different HTML elements in the modal form.      
          document.getElementById('infowindow-heading').innerHTML = place.name; 

          // To select the first image available using a call back function as method to another previous function
          // and store it into a variable.
          var placeImg = place.photos[0].getUrl({maxWidth: 300, maxHeight: 300});
        
          // To create an img object and set its attributes using a variable
          // and append its value to the infowindow HTML snippet element. 
          var serviceImg = document.createElement("img");    
          img.setAttribute('src', placeImg);
          
          // To avoid the appending of more than one picture when click on marker several times
          var infowindowImageCount = document.getElementById('infowindow-image').childElementCount;
          if (infowindowImageCount >0) {
            document.getElementById('infowindow-image').removeChild(serviceImg);
            } else {
              document.getElementById('infowindow-image').appendChild(serviceImg); 
            }   
          });

      }
    };
  }); // End of autocomplete.addListener()


}; // End of initMap()


// DUSTBIN ------------------------------------------------------------------------------------

    // Object definition to use in event listener, looking for an 'Enter' key stroke in the keyboard
    // after autocomplete and user has done the writing in to search-Box
    // var searchInput = document.getElementById("search-input");
    
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

    // // Execute a function when the user releases a key on the keyboard
    // searchInput.addEventListener("keyup", function(event) {
    // // Number 13 is the "Enter" key on the keyboard
    // if (event.keyCode === 13 ) {
    //     // Cancel the default action, if needed
    //     event.preventDefault();
    //     // Trigger the button element with a click
    //     document.getElementById("search-btn").click();
    //   }
    // });