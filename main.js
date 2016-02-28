// main.js

var PiquedGlobal = {}
PiquedGlobal["overlays"] = []
PiquedGlobal["overlays_set"] = new Set()

var map = new google.maps.Map(document.getElementById('map'), {
  zoom: 15,
  center: {lat: -33.9, lng: 151.2}
});

var displayVenues = function(venues) {
  displayVenuesOnMap(venues);
};

var displayVenuesOnMap = function(venues) {
  var newPins = []
  venues.forEach(function(venue) {
    var myLatlng = new google.maps.LatLng(venue.location.lat, venue.location.lng);

    if (venue.photos.groups[0].items[0]) {
      var photo = venue.photos.groups[0].items[0]
      var photoURL = photo.prefix + "60" + photo.suffix
      var overlay = new CustomMarker(
        myLatlng, 
        map,
        {
          image_url: photoURL,
          marker_id: venue.id
        }
      );
      newPins.push(overlay)
    }
  });

  var originalPins = PiquedGlobal["overlays_set"];
  var pinsToAdd = [];

  newPins.forEach(function(overlay) {
    if (!originalPins.has(overlay.valueOf())) {
      console.log(overlay.args.marker_id)
      pinsToAdd.push(overlay);
      PiquedGlobal["overlays"].push(overlay);
    }
  });

  pinsToAdd.forEach(function(overlay) {
    PiquedGlobal["overlays_set"].add(overlay.valueOf())
  });

}

foursquarePosts(-33.9, 151.2, 5000, "", displayVenues);

google.maps.event.addListener(map, "dragend", function(event) {
  foursquarePosts(map.getCenter().lat(), map.getCenter().lng(), 5000, "", displayVenues);
});

// Try HTML5 geolocation.
// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(function(position) {
//     var pos = {
//       lat: position.coords.latitude,
//       lng: position.coords.longitude
//     };

//     map.setCenter(pos);

//     PiquedGlobal["currentLocation"] = pos;

//     foursquarePosts(pos.lat, pos.lng, 5000, "", displayVenues);
//   });
// }
//   