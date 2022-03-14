//Create a variable to hold the url for our earthquake data
var eq_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//Get request the url to read the data
d3.json(eq_url).then(function(data) {
    createFeatures(data.features);
})

function createFeatures(earthquakeData) {
    
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
      });
  
    createMap(earthquakes);

  }
  
  function createMap(earthquakes) {

    // Define map layer
    var mapLayer = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "light-v10",
      accessToken: API_KEY
    });
  
    // Create our map, giving it the mapLayer and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [0,0],
      zoom: 2,
      layers: [mapLayer, earthquakes]
    });

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = ['5+','5-4','4-3','3-2','2-1','1-0'];
      var colors = ["rgb(240,107,107)",
                      "rgb(240,167,107)",
                      "rgb(243,186,77)",
                      "rgb(243,219,77)",
                      "rgb(225,243,77)",
                      "rgb(183,243,77)"];
      var labels = [];
  
      var legendInfo = "<h3>Mag.</h3>"

      div.innerHTML = legendInfo;
 
      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"><strong>"+limits[index]+"</strong></li>");
      });
  
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };

    legend.addTo(myMap);

}

function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
}

function createMarker(feature,location){
    var options = {
        fillOpacity:0.5,
        fillColor: defineColor(feature.properties.mag),
        color: "black",
        weight: 0.5,
        radius: feature.properties.mag*5,
    }

    return L.circleMarker(location,options);
}
  
function defineColor(magnitude){
    if(magnitude>5){color = "rgb(240,107,107)";}
    
    else if(magnitude>4){color = "rgb(240,167,107)";}

    else if(magnitude>3){color = "rgb(243,186,77)";}

    else if(magnitude>2){color = "rgb(243,219,77)";}

    else if(magnitude>1){color = "rgb(225,243,77)";}

    else if(magnitude>0){color = "rgb(183,243,77)";}

    return color
}

