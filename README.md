# leaflet-challenge
## Monash Data Course Wk 17

## Deployment available here
https://jt-lowe.github.io/leaflet-challenge/


### Earthquake Locations - Color and Size

First we selected our dataset from the earthquake.usgs.gov site and stored that as a url string to call as a geojson. We used the d3.json() function to call the data from the url as a promise, then we called the createFeatures() function we created.

#### createFeatures
Using the data.features attribute as our data, we used the L.goejson() function from leaflet to read the information. further calling the onEachFeature and createMarker functions that we create later on.
Within this function is also where we created our map using the createMap function (which we also create later in the js file)

#### createMap
Using the unpacked geojson information from createFeatures, we create a map layer (leaflet-1) or multiple layers (leaflet-2) depending on our endpoint, storing the layer(s) in a variable. The key to changing the different layers is ensuring the "id:" attribute is changed according to the current mapbox api call.

To create the actual map we use the L.map() function from the leaflet library. We then create a legend using the L.control() function, positioning it in the bottom right and adding it to the map.

#### onEachFeature
We use this function to create the marker popups on each by binding html script

#### createMarker
Create a variable for the options to attach to each marker, defining fill opacity and color (which defines the boundary rather than the fill) as static values and referring the radius as a variable based on the magnitude and refer the fill color to a defineColor function we are about to create.

#### defineColor
We create a couple of conditionals to capture the magnitude of the earthquake, definining and returning a color based on the value.


#### leaflet-2 specifics

For leaflet-2 it's important to use the Promise.all() function to be able to call in the geojson data for the earthquakes as well as the json file for the tectonic plates.
Other than that we just need to add an extra overlay layer, ensuring that both the earthquake markers and the plate lines are available.
We then ensure that a layer selector is placed on the page for the interactivity.
