// Global scope declarations
var map, marker, infowindow, autocomplete, service; // map objects declaration
var searchInput; // autocomplete search box
var place, bounds; // autocomplete objects declaration

// var placeInfowindow,serviceInfowindow; // OBJECTS
var iwSearch_contentString; // Infowindow content HTML Snippet

// buttons declaration
var hotelMarkers, foodMarkers, pubMarkers, atmMarkers; 
var museumMarkers, galleryMarkers, zooMarkers, stadiumMarkers;
var busMarkers,  subwayMarkers, taxiMarkers, airportMarkers;
var onClickClusterButton;

// var markers;
var service;
var serviceInfo;
var serviceMarkers;


// Searched place infowindow gets HTML snippet 
var iwSearch_contentString =  
'<div id="infowindow-content" class="d-flex flex-column justify-content-center ">'+
'<h1 id="infowindow-heading" class="justify-content-center text-center"></h1>'+
'<div id="bodyContent">'+
  '<div id="infowindow-description" class="text-center">Your destination is in <b><span id="place-type"></span></b></div>'+
  '<div id="infowindow-image" class="justify-content-center img-responsive center-block"></div>' +
'</div>'+
'</div>';

// map function
function initMap() {
  
  // Button Definitions; Set variables to specific buttons id´s to check onClick events
  var hotelMarkers = document.querySelector('#hotel-markers');
  var foodMarkers = document.querySelector('#food-markers');
  var pubMarkers = document.querySelector('#pub-markers');
  var atmMarkers = document.querySelector('#atm-markers');
  var museumMarkers = document.querySelector('#museum-markers');
  var galleryMarkers = document.querySelector('#gallery-markers');
  var zooMarkers = document.querySelector('#zoo-markers');
  var stadiumMarkers = document.querySelector('#stadium-markers');
  var busMarkers = document.querySelector('#bus-markers');
  var subwayMarkers = document.querySelector('#subway-markers');
  var taxiMarkers = document.querySelector('#taxi-markers');
  var airportMarkers = document.querySelector('#airport-markers');

  var searchInput = document.getElementById("search-input");

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
  // infowindow Object + {content: HTML snippet}
  infowindow = new google.maps.InfoWindow({content: iwSearch_contentString
  });   
  // autocomplete Object ("HTML element "set into a variable, {options})  
  autocomplete = new google.maps.places.Autocomplete(searchInput, {
     // Places type specification to avoid street searches
     type: ['(cities)']
  });
  // service Object (All features of map to an array)
  service = new google.maps.places.PlacesService(map); 
  // https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-hotelsearch
     
  // Objects' Methods
 
  // autocomplete Methods 
  autocomplete.bindTo('bounds', map);   // To set 'bounds' values into map created.
  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    
    // Objects' Definition
    // place Object()
    var place = autocomplete.getPlace(); // This callback should return all places features to an array
    console.log (place); // Object check purposes only
    
    // Condition to cheeck if the name of a place typed in searchInput is empty
    // or hasn't been suggested, or if the Place Details request failed.
    if (!place.geometry || searchInput ==='') {
      window.alert("Please, select one of the suggested places and click on 'Search'. There are no current details available for your selection : '" + place.name + "'");
      return;
    };
      
    // marker Object Methods
    marker.setMap(map); // To add the marker created into the map      
    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location,
    });// To set the position of the marker using the place ID and location.
    marker.setVisible(true);
    
    // map Object Methods
    map.setCenter(place.geometry.location);
    map.setZoom(3);  
 
    // To set an event listener to 'map' when clicking out of infowindow, map is centered to the marker position 
    map.addListener('click', function() {
      infowindow.close();
      map.setCenter(place.geometry.location);
    });
    
    // To set an event listener to 'marker' when clicking on it, animation stops, 
    // type of map changes zoom to place, infowindow opens
    marker.addListener('click', function() {      
      
      map.setCenter(place.geometry.location); // To set the center of the map
      map.setZoom(15); // To zoom into the place area
      map.setMapTypeId("roadmap");  // To set up the type of map used      

      marker.setAnimation(google.maps.Animation.DROP); // To stop the marker bouncing when clicking on it.
           
      // infowindow Object Methods
      infowindow.close();
      infowindow.open(map, marker); // To open the infowindow to this marker  
      // infowindow content sets up     
      // To set the values retrieved from the calllback function to different HTML elements in the modal form.      
      document.getElementById('infowindow-heading').innerHTML = place.name;
      document.getElementById('place-type').innerHTML = place.country;
      var placeImg = place.photos[0].getUrl({maxWidth: 300, maxHeight: 300}); // To select the first image available when callback places.
      var img = document.createElement("img"); // To create an img object to set its attributes. 
      img.setAttribute('src', placeImg);
      // var placeCountry = place.country;
      // To avoid the appending of more than one picture when click on marker several times
      var infowindowImageCount = document.getElementById('infowindow-image').childElementCount;
      if (infowindowImageCount >0) {
        document.getElementById('infowindow-image').removeChild(img);
        } else {
          document.getElementById('infowindow-image').appendChild(img); 
      }   
    });    
      
    hotelMarkers.onclick = function() {
      // clearMarkers();    
      infowindow.close();
      map.setCenter(place.geometry.location);
      map.setZoom(15); // Zoom
      map.setMapTypeId("roadmap"); // TypeId
      onClickClusterButton ='lodging';

      // Check display onClickClusterButton into an html element
      document.getElementById('map-user-selections').innerHTML = onClickClusterButton;

      // Perform a nearby search.
      // https://developers.google.com/maps/documentation/javascript/places

      service.nearbySearch({location: place.geometry.location, radius: 500, type: onClickClusterButton},
        function(results, status, pagination) {
        if (status == google.maps.places.PlacesServiceStatus.OK) return;

        createMarkers(results);
        // moreButton.disabled = !pagination.hasNextPage;
        getNextPage = pagination.hasNextPage && function() {
            pagination.nextPage();
          };
        });


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
            label: labels[labelIndex++ % labels.length],            
            position: place.geometry.location,
            animation: google.maps.Animation.DROP,
          });

          serviceMarkers.setPlace({
            placeId: place.place_id,
            location: place.geometry.location,
            });

          serviceMarkers.addListener('click', function(){

            infowindow = new google.maps.InfoWindow({content: iwSearch_contentString});
      
            map.setCenter(place.geometry.location); // To set the center of the map
            
            infowindow.close();
            infowindow.open(map, serviceMarkers); // To open the infowindow to this marker  
            document.getElementById('infowindow-heading').innerHTML = place.name;
            document.getElementById('place-type').innerHTML = place.country;
            var placeImg = place.photos[0].getUrl({maxWidth: 300, maxHeight: 300}); // To select the first image available when callback places.
            var img = document.createElement("img"); // To create an img object to set its attributes. 
            img.setAttribute('src', placeImg);
            // var placeCountry = place.country;
            // To avoid the appending of more than one picture when click on marker several times
            var infowindowImageCount = document.getElementById('infowindow-image').childElementCount;
            if (infowindowImageCount >0) {
              document.getElementById('infowindow-image').removeChild(img);
              } else {
                document.getElementById('infowindow-image').appendChild(img);      
              }   
          });

          var serviceInfo = place.getDetails({placeId: serviceMarkers.placeId});
          console.log (serviceInfo); // Object check purposes only 

          var li = document.createElement('li');
          li.textContent = place.name + " "+labels[i];
          serviceList.appendChild(li);
        }
      };

    }; // End of hotelMarkers.onclick
  }); // End of aurocomplete.addListener()    
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

    // function clearMarkers() {
    //   for (var i = 0; i < erviceMmarkers.length; i++) {
    //   serviceMarkers[i].setMap(null);
    //   }
    //   serviceMarkers = [];
    // };
    
    // service = new google.maps.places.PlacesService(map);
    //place.getDetails({placeId: serviceMarkers.placeId});
    // var place = autocomplete.getPlace();
    // service.getDetails(place.placeId);
    // var serviceInfo = service.getDetails();
    // console.log (serviceMarkers); // Object check purposes only 
    // infowindow = new google.maps.InfoWindow({content: contentString});


    // To select the first image available using a call back function as method to another previous function
    // and store it into a variable.
    // var placeImg = place.photos[0].getUrl({maxWidth: 300, maxHeight: 300});
  
    // To create an img object and set its attributes using a variable
    // and append its value to the infowindow HTML snippet element. 
    // var serviceImg = document.createElement("img");    
    // img.setAttribute('src', placeImg);
    
    // To avoid the appending of more than one picture when click on marker several times
    // var infowindowImageCount = document.getElementById('infowindow-image').childElementCount;
    // if (infowindowImageCount >0) {
    // document.getElementById('infowindow-image').removeChild(serviceImg);
    //   } else {
    //    document.getElementById('infowindow-image').appendChild(serviceImg); 