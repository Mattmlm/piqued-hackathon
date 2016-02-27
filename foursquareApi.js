// function to catch generic errors (*Required)
var jsError = function(text) {
  alert(text);
};

// function to test whether obj is a number (*Required)
var isNumber = function(obj) {
  return typeof(obj) == 'number';
};

// function to test whether obj is a string (*Required)
var isString = function(obj) {
  return typeof(obj) == 'string';
};

// function to get the first group of \w characters via regex (*Required)
// *query string query to find the first non-symbol group in
var stringify = function(query) {
  if (!isString(query)) {
    return null;
  }
  return query.match(/\W*(\w*)/)[1];
};

// generates a foursquare api url from parameters passed in (*Required)
// *lat float latitude of location
// *lng float longitude of location
// *radius integer radius to extend search outward
// query string filter search parameter
var generateFoursquareReqUrl = function(lat, lng, radius, query) {
  if (!isNumber(lat) || !isNumber(lng) || !isNumber(radius)) {
    jsError("Could not generate request Url!");
    return null;
  }

  var reqUrl = "https://api.foursquare.com/v2/venues/explore?ll="+lat+","+lng+"&radius"+radius+"&venuePhotos=1&oauth_token=CLLNSCL4FMW0PG0SHBIENOKCKWZI3Z4TTDRRFJDK4JEMJBUG&v=20160226";
  if (query) {
    // make sure to use stringify to prevent code injection
    if (!(safeQuery = stringify(query))) {
      jsError("query included but not a valid string");
      return null;
    }
    reqUrl += "&query="+safeQuery;
  }

  return reqUrl;
};

// Function to display venues on page
// *venues list entire set of venues returned by foursquare in the area
var displayVenues = function(venues) {
  console.log(venues);
}

// Function to handle api response data from foursquare and call displayVenues with list of venues
// *data hash entire data object returned by foursquare
// ===
// => calls displayVenues with the new list of venues
var foursquareOnSuccess = function(data) {
  var response = data.response;
  if (!response) {
    jsError("Invalid response from foursquare");
    return null;
  }

  if (response.totalResults <= 0) {
    jsError("No results found in foursquare");
    return null;
  }

  var groups = response.groups;
  if (!groups || groups.length <= 0) {
    jsError("No groups found in foursquare");
    return null;
  }

  var venues = [];
  groups.forEach(function(group) {
    var items = group.items;
    if (!items || items.length <= 0) {
      return null;
    }

    items.forEach(function(item) {
      var venue = item.venue;
      if (!venue) {
        return null;
      }

      posts.push(item.venue);
    });
  });

  displayVenues(venues);
};

// gets posts from foursquare api (*Required)
// *lat float latitude of location
// *lng float longitude of location
// *radius integer radius to extend search outward
// query string filter search parameter
var foursquarePosts = function(lat, lng, radius, query) {
  var reqUrl = generateFoursquareReqUrl(lat, lng, radius, query);
  if (!reqUrl) {
    jsError("Could not generate valid reqUrl from foursquarePosts params");
    return null;
  }

  $.ajax({
      type: "GET",
      dataType: "jsonp",
      url: reqUrl,
      success: foursquareOnSuccess,
      error: function(err) {
        jsError("Error requesting locations from foursquare: "+err);
      },
      complete: function() {
        console.log("Api request complete!");
      }
  });
};
