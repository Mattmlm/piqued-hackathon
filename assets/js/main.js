// main.js

var PiquedGlobal = {}
PiquedGlobal["overlays"] = []
PiquedGlobal["overlays_set"] = new Set()

var map = new google.maps.Map(document.getElementById('map'), {
  mapTypeControl: false,
  streetViewControl: false,
  zoom: 15,
  center: {lat: -33.9, lng: 151.2}
});

var displayVenues = function(venues) {
  displayVenuesOnMap(venues);
  displayVenuesOnList(venues);
};

var getVenueImage = function(venue, size) {
    if (!isNumber(size)) {
      return null;
    }

    var photos = venue.photos;
    if (!photos) {
      return null;
    }

    var groups = photos.groups;
    if (!groups || groups.length < 1) {
      return null;
    }

    var photo = groups[0].items[0];

    return photo.prefix + size + photo.suffix
};

var displayVenuesOnMap = function(venues) {
  var newPins = []
  venues.forEach(function(venue) {
    var myLatlng = new google.maps.LatLng(venue.location.lat, venue.location.lng);

    var photoURL = getVenueImage(venue, 60);
    if (photoURL) {
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

};

var venueHtml = function(id, image, name, type, address, distance) {
  return '<li class="placeCard" id="'+id+'"><img class="placeImg" src="'+image+'" /><div class="placeInfo"><span class="placeName">'+name+'</span><span class="placeType">'+type+'</span><span class="placeAddress">'+address+'</span><span class="placeDistance">'+distance+'</span></div></li>';
};

var getVenueType = function(venue) {
    var categories = venue.categories.slice(0,2);
    if (categories.length < 1) {
      return null;
    }
    return categories.map(function(e) { return e.name; }).join(', ');
};

var displayVenuesOnList = function(venues) {
  $('#feed > ul').empty();
  venues.forEach(function(venue) {
    var id = venue.id;
    var image = getVenueImage(venue, 260);
    var name = venue.name;
    var type = getVenueType(venue);
    var address = venue.location.address;
    var distance = venue.location.distance;

    console.log([id, image, name, type, address, distance]);
    if (id && name && type && address && distance) {
      $('#feed > ul').prepend(venueHtml(id, image, name, type, address, distance));
    }
  });
  setTimeout(function () {
    var placeCards = PiquedGlobal['placeCards'];
    if (placeCards) {
      placeCards.refresh();
      placeCards.scrollTo(0, 0, 1500, IScroll.utils.ease.circular);
    } else {
      PiquedGlobal['placeCards'] = new IScroll('#feed');
    }
  }, 0);
};


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
