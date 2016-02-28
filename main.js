// main.js

var PiquedGlobal = {}
PiquedGlobal["overlays"] = []

var map = new google.maps.Map(document.getElementById('map'), {
  zoom: 15,
  center: {lat: -33.9, lng: 151.2}
});

var displayVenues = function(venues) {
  displayVenuesOnMap(venues);
};

var displayVenuesOnMap = function(venues) {
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

      PiquedGlobal["overlays"].push(overlay)
    }

  });
}

foursquarePosts(-33.9, 151.2, 5000, "", displayVenues);

google.maps.event.addDomListener(div, "click", function(event) {
  alert('You clicked on a custom marker!');
  google.maps.event.trigger(self, "click");
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