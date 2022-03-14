var eq_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var tect_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"


Promise.all([d3.json(eq_url),d3.json(tect_url)]).then(function(data) {
    createFeatures(data[0].features,data[1].features);
})



function createFeatures(earthquakeData,tectonicData) {
    
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
      });

    var plates = L.geoJSON(tectonicData);
  
    createMap(earthquakes,plates);
  }
  
  function createMap(earthquakes,plates) {

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "satellite-v9",
      accessToken: API_KEY
    });
  
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });

    var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "outdoors-v11",
      accessToken: API_KEY
    });
    
    var baseMaps = {
      "Satellite": satellitemap,
      "Greyscale": lightmap,
      "Outdoors": outdoormap
    };
  
    var overlayMaps = {
      Earthquakes: earthquakes,
      Plates: plates
    };
    var myMap = L.map("map", {
      center: [0,0],
      zoom: 2,
      layers: [satellitemap, earthquakes,plates]
    });

    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

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

