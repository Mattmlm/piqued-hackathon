// main.js

var PiquedGlobal = {}
PiquedGlobal["overlays"] = []

$(document).ready(function() {

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: {lat: -33.9, lng: 151.2}
  });

  displayVenues = function(venues) {
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

    // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      var infoWindow = new google.maps.InfoWindow({map: map});

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      map.setCenter(pos);

      PiquedGlobal["currentLocation"] = pos;

      foursquarePosts(pos.lat, pos.lng, 1000, "");
    });
  }

});