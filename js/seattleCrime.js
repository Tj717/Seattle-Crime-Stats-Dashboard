mapboxgl.accessToken =
'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/dark-v10',
zoom: 3, // starting zoom
center: [-95, 37] // starting center
});

const grades = [4, 5, 6],
colors = ['rgb(208,209,230)', 'rgb(103,169,207)', 'rgb(1,108,89)'],
radii = [5, 15, 20];

//load data to the map as new layers.
//map.on('load', function loadingData() {
map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function

// when loading a geojson, there are two steps
// add a source of the data and then add the layer out of the source
map.addSource('crimes', {
    type: 'geojson',
    data: 'assets/cleaned_data.geojson'
});

map.addLayer({
    'id': 'seattleCrimes-layer',
    'type': 'fill',
    'source': 'crimes',
    'paint': {
        'fill-color': [
            'step',
            ['get', 'crimes'],
            '#FFEDA0',   // stop_output_0
            10,          // stop_input_0
            '#FED976',   // stop_output_1
            20,          // stop_input_1
            '#FEB24C',   // stop_output_2
            50,          // stop_input_2
            '#FD8D3C',   // stop_output_3
            100,         // stop_input_3
            '#FC4E2A',   // stop_output_4
            200,         // stop_input_4
            '#E31A1C',   // stop_output_5
            500,         // stop_input_5
            '#BD0026',   // stop_output_6
            1000,        // stop_input_6
            "#800026"    // stop_output_7
        ],
        'fill-outline-color': '#BBBBBB',
        'fill-opacity': 0.7,
    }
});


// click on tree to view magnitude in a popup
map.on('click', 'earthquakes-point', (event) => {
    new mapboxgl.Popup()
        .setLngLat(event.features[0].geometry.coordinates)
        .setHTML(`<strong>Magnitude:</strong> ${event.features[0].properties.mag}`)
        .addTo(map);
    });

});


// create legend
const legend = document.getElementById('legend');

//set up legend grades and labels
var labels = ['<strong>Magnitude</strong>'], vbreak;
//iterate through grades and create a scaled circle and label for each
for (var i = 0; i < grades.length; i++) {
vbreak = grades[i];
// you need to manually adjust the radius of each dot on the legend 
// in order to make sure the legend can be properly referred to the dot on the map.
dot_radii = 2 * radii[i];
labels.push(
    '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
    'px; height: ' +
    dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
    '</span></p>');

}
const source =
'<p style="text-align: right; font-size:10pt">Source: <a href="https://earthquake.usgs.gov/earthquakes/">USGS</a></p>';

legend.innerHTML = labels.join('') + source;