

let map, autocomplete, infowindow, service; // objects
var mapCanvas, mapOptions; // map variables
var contentString; // infowindow content
var markerMapOptions; //
var place, servicePlace,bounds; 

// Map functionality.
function initMap() {

  // VARIABLES UPDATE
  // ----------------
  // To define into a variable in which HTML element the map should be diplayed.
  var mapCanvas = document.getElementById("map");
  // To define into a variable the options to use with the map.  
  var mapOptions={
    disableDefaultUI: true,
    mapTypeId: 'satellite'
  };
  // To define into a variable the infowindow structure, storing inside an HTML Snippet in which to release the content retrieved
  var contentString =
  '<div id="infowindow-content" class="d-flex flex-column justify-content-center ">'+
    '<h1 id="infowindow-heading" class="justify-content-center text-center"></h1>'+
    '<div id="bodyContent">'+
      '<div id="infowindow-description" class="text-center">Your destination is in <b><span id="place-type">(country)</span></b></div>'+
      '<div id="infowindow-image" class="justify-content-center img-responsive center-block"></div>' +
    '</div>'+
  '</div>';
  
  var markerMapOptions = {
    // https://developers.google.com/maps/documentation/javascript/examples/marker-animations
    animation: google.maps.Animation.BOUNCE,
    label: "Your destination",
    // content: markerLabel,
    // label: markerLabel,
    title: "Click to zoom"
    // https://developers.google.com/maps/documentation/javascript/examples/overlay-popup
    // icon: iconImage + 'parking_lot_maps.png',
   };
  // To define which HTML element is the input search box, setting that info in a variable.
  var searchInput = document.getElementById("search-input");

  // To define the search options to use with autocomplete, restricting the search to cities. This is to avoid street searches...
  var searchOptions={
    type: ['(cities)'],
  };

  // OBJECTS UPDATE
  // --------------
  
  // To create the 'map' object, updating the values defined in a variable.
  // https://developers.google.com/maps/documentation/javascript/examples/map-simple
  map = new google.maps.Map(mapCanvas, mapOptions);

  // To create the 'infowindow' object, setting the content retrieved using a variable previously defined.
  // https://developers.google.com/maps/documentation/javascript/infowindows
  infowindow = new google.maps.InfoWindow({content: contentString});

  // To create the 'marker' object, setting the options usig a variable previously defined.
  // https://developers.google.com/maps/documentation/javascript/markers
  marker = new google.maps.Marker(markerMapOptions)
  // To add the marker created into the map.
  marker.setMap(map);
 
  // To create the 'autocomplete' object, updating the values defined in two variables.
  // https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
  autocomplete = new google.maps.places.Autocomplete(searchInput, searchOptions);

  // To set 'bounds' values into map created.
  autocomplete.bindTo('bounds', map); 
  
  // To create the 'service' object, relating the information to map created.
  //https://developers.google.com/maps/documentation/javascript/examples/place-search-pagination
  service = new google.maps.places.PlacesService(map); 
  
  // To add a listening method to the 'autocomplete' object,
  // that will run a custom callback function in response to the media query status changing.
  autocomplete.addListener('place_changed', function() {
    infowindow.close();

    var place = autocomplete.getPlace();

    document.getElementById('destination').innerHTML = place.name;
    
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
      
      // To stop the marker bouncing when clicking on it.
      // https://developers.google.com/maps/documentation/javascript/examples/marker-animations
      marker.setAnimation(google.maps.Animation.DROP);
      
      // To set the values retrieved from the calllback function to different HTML elements in the modal form.      
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
 
  // Perform a nearby search.
  service.nearbySearch( {location: place.geometry.location, radius: 500, type: ['lodging']},
    function(results, status, pagination) {
      if (status !== 'OK') return;

        createMarkers(results);
        moreButton.disabled = !pagination.hasNextPage;
        getNextPage = pagination.hasNextPage && function() {
          pagination.nextPage();
        };
      });

  // RESULTS PAGINATION
  // ----------
  // https://developers.google.com/maps/documentation/javascript/examples/place-search-pagination
  var getNextPage = null;
  var moreButton = document.getElementById('more');
        
  moreButton.onclick = function() {
      moreButton.disabled = true;
      if (getNextPage) getNextPage();
    }; 
      
  function createMarkers(places) {
    var bounds = new google.maps.LatLngBounds();
    var serviceList = document.getElementById('map-displayed-markers');

    for (var i = 0, place; place = places[i]; i++) {
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
        position: place.geometry.location
      });

      var li = document.createElement('li');
      li.textContent = place.name;
      serviceList.appendChild(li);

      bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);    
  }


});   

  // https://developers.google.com/maps/documentation/javascript/places#place_details_requests
  // var request = {
  //   placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
  //   fields: ['name', 'rating', 'formatted_phone_number', 'geometry']
  // };
  
  // https://developers.google.com/maps/documentation/javascript/places#placeid
  // service.textSearch(request, callback);
  // var request = {
  //   location: map.getCenter(),
      // radius: '500',
      // query: 'Google Sydney'
  // };
    
  // function callback(results, status) {
  //   if (status == google.maps.places.PlacesServiceStatus.OK) {
  //     var marker = new google.maps.Marker({
  //       map: map,
  //       place: {
  //         placeId: results[0].place_id,
  //         location: results[0].geometry.location
  //       }
  //     });
  //   }
  // }
 
  // service.getDetails(request, callback);


  
  // Define variables to identify cluster buttons.
  // var hotelMarkers = getElementById('hotel-markers');
  // var foodMarker = getElementById('food-marker');
  // var pubMarker = getElementById('pub-marker');
  // var musicMarker = getElementById('music-marker');
  // var artsMarker = getElementById('arts-marker');
  // var sportsMarker = getElementById('sports-marker');
  // var outingMarker = getElementById('outing-marker');
  // var relaxMarker = getElementById('relax-marker');
  

};





  
