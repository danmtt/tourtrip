// Define variables to identify cluster buttons.
var hotelMarkers = getElementById('hotel-markers');
var foodMarker = getElementById('food-marker');
var pubMarker = getElementById('pub-marker');
var musicMarker = getElementById('music-marker');
var artsMarker = getElementById('arts-marker');
var sportsMarker = getElementById('sports-marker');
var outingMarker = getElementById('outing-marker');
var relaxMarker = getElementById('relax-marker');


    hotelMarkers.addEventListener("click", function() {
      // map.setZoom(3);
      window.alert("Hotels have been selected for");
    });




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



  
