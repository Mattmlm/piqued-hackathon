// function to catch generic errors (*Required)
// *text string what to print
// data object will console.log for debugging
var jsError = function(text, data) {
  if (data) {
    console.log(data);
  }
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

  console.log(reqUrl)
  return reqUrl;
};

// Function to display venues on page
// *venues list entire set of venues returned by foursquare in the area
var displayVenues = function(venues) {
  console.log(venues);
};

// Function to handle api response data from foursquare and call displayVenues with list of venues
// *data hash entire data object returned by foursquare
// ===
// => calls displayVenues with the new list of venues
var foursquareOnSuccess = function(data) {
  var response = data.response;
  if (!response) {
    jsError("Invalid response from foursquare", data);
    return null;
  }

  if (response.totalResults <= 0) {
    jsError("No results found in foursquare", data);
    return null;
  }

  var groups = response.groups;
  if (!groups || groups.length <= 0) {
    jsError("No groups found in foursquare", data);
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

      venues.push(item.venue);
    });
  });

  displayVenues(venues);
};

// generates a foursquare api url from parameters passed in (*Required)
// *lat float latitude of location
// *lng float longitude of location
// *radius integer radius to extend search outward
// query string filter search parameter
var generateFoursquareReqUrl = function(lat, lng, radius, query) {
  if (!isNumber(lat) || !isNumber(lng) || !isNumber(radius)) {
    jsError("Could not generate request Url!", [lat, lng, radius]);
    return null;
  }

  var reqUrl = "https://api.foursquare.com/v2/venues/explore?ll="+lat+","+lng+"&radius"+radius+"&venuePhotos=1&client_id=DOUDECYXSQ2TKZA0XM52MJNFSJZQ5OQ1QUU0TYSHKNHQWSDC&client_secret=CB2XICDAOYNEGVRVH5HBS2WXBQPWL5PTSFC2NW5SJWD0YI01&v="+(new Date().toLocaleFormat('%Y%m%d'));
  if (query) {
    // make sure to use stringify to prevent code injection
    if (!(safeQuery = stringify(query))) {
      jsError("query included but not a valid string", query);
      return null;
    }
    reqUrl += "&query="+safeQuery;
  }

  return reqUrl;
};

// gets posts from foursquare api (*Required)
// *lat float latitude of location
// *lng float longitude of location
// *radius integer radius to extend search outward
// query string filter search parameter
var foursquarePosts = function(lat, lng, radius, query) {
  var reqUrl = generateFoursquareReqUrl(lat, lng, radius, query);
  if (!reqUrl) {
    jsError("Could not generate valid reqUrl from foursquarePosts params", [lat, lng, radius, query]);
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
