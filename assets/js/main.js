

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
  '<div id="infowindow-content" class="d-flex flex-column justify-content-center ">'+
    '<h1 id="infowindow-heading" class="justify-content-center text-center"></h1>'+
    '<div id="bodyContent">'+
      '<div id="infowindow-description" class="text-center">Your destination is in <b><span id="place-type">(country)</span></b></div>'+
      '<div id="infowindow-image" class="justify-content-center img-responsive center-block"></div>' +
    '</div>'+
  '</div>';


  // To create the 'infowindow' object,
  // calling the constructor from googleMaps API
  // setting the content retrieved using a variable previously defined.
  infowindow = new google.maps.InfoWindow({
    content: contentString,
    // pixelOffset: new google.maps.Size(150,275)
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
    
      // To set the values retrieved from the calllback function
      // to different HTML elements in the modal form.
      
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


  //https://developers.google.com/maps/documentation/javascript/examples/place-search-pagination
  // Create the places service.
  var service = new google.maps.places.PlacesService(map);
  
  var pyrmont = {lat: -33.866, lng: 151.196};
  // var place = autocomplete.getPlace();

  // Define variables to identify cluster buttons.
  // var hotelMarkers = getElementById('hotel-markers');
  // var foodMarker = getElementById('food-marker');
  // var pubMarker = getElementById('pub-marker');
  // var musicMarker = getElementById('music-marker');
  // var artsMarker = getElementById('arts-marker');
  // var sportsMarker = getElementById('sports-marker');
  // var outingMarker = getElementById('outing-marker');
  // var relaxMarker = getElementById('relax-marker');
  
  var getNextPage = null;
  var moreButton = document.getElementById('more');
        moreButton.onclick = function() {
          moreButton.disabled = true;
          if (getNextPage) getNextPage();
        };
  
  // Perform a nearby search.
  service.nearbySearch(  {location: pyrmont, radius: 500, type: ['lodging']},
      function(results, status, pagination) {
        if (status !== 'OK') return;

        createMarkers(results);
        moreButton.disabled = !pagination.hasNextPage;
        getNextPage = pagination.hasNextPage && function() {
          pagination.nextPage();
        };
      });
      
  function createMarkers(places) {
    var bounds = new google.maps.LatLngBounds();
    var placesList = document.getElementById('map-displayed-markers');

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
      placesList.appendChild(li);

      bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);
  }    

};





  
