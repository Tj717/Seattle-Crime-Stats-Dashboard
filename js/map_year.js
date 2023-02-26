mapboxgl.accessToken =
'pk.eyJ1IjoiZmF0bW9vc2UiLCJhIjoiY2t1eWY0ZXRoMmhiMzJ3bzZnczcyMXZ1NyJ9._RrkxwKkDAlgErLRDaVcEA';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-122.322, 47.6226], 
    zoom: 10.2,
    scrollZoom: true,
});

var year_menu = document.getElementById('year');
let year = year_menu.value;
// year_menu.addEventListener('change', function() {
//     geojsonFetch(year);
// });

async function geojsonFetch() { 
    // let response = await fetch(`assets/crimes_by_year/${year}.geojson`);
    let response18,  response19, response20, response21, response22, response23;
    response18 = await fetch(`assets/crimes_by_year/2018.geojson`);
    response19 = await fetch(`assets/crimes_by_year/2019.geojson`);
    response20 = await fetch(`assets/crimes_by_year/2020.geojson`);
    response21 = await fetch(`assets/crimes_by_year/2021.geojson`);
    response22 = await fetch(`assets/crimes_by_year/2022.geojson`);
    response23 = await fetch(`assets/crimes_by_year/2023.geojson`);

    let crime18 = await response18.json();
    let crime19 = await response19.json();
    let crime20 = await response20.json();
    let crime21 = await response21.json();
    let crime22 = await response22.json();
    let crime23 = await response23.json();

    // map.setProjection({name: 'Mercator'});

    map.on('load', () => {
        map.addSource('crime18', {
            type: 'geojson',
            data: crime18
        });

        map.addSource('crime19', {
            type: 'geojson',
            data: crime19
        });

        map.addSource('crime20', {
            type: 'geojson',
            data: crime20
        });

        map.addSource('crime21', {
            type: 'geojson',
            data: crime21
        });

        map.addSource('crime22', {
            type: 'geojson',
            data: crime22
        });

        map.addSource('crime23', {
            type: 'geojson',
            data: crime23
        });


    // Crime-records layer
    map.addLayer({
        'id': 'crime18',
        'type': 'symbol',
        'source': 'crime18',
        'layout': {
            // Make the layer visible by default.
            'visibility': 'visible',
            'icon-image': 'marker-15',
            'icon-size': 0.75,
            'icon-allow-overlap': true
        }
    });

    map.addLayer({
        'id': 'crime19',
        'type': 'symbol',
        'source': 'crime19',
        'layout': {
            'visibility': 'invisible',
            'icon-image': 'marker-15',
            'icon-size': 0.75,
            'icon-allow-overlap': true
        }
    });

    map.addLayer({
        'id': 'crime20',
        'type': 'symbol',
        'source': 'crime20',
        'layout': {
            'visibility': 'invisible',
            'icon-image': 'marker-15',
            'icon-size': 0.75,
            'icon-allow-overlap': true
        }
    });

    map.addLayer({
        'id': 'crime21',
        'type': 'symbol',
        'source': 'crime21',
        'layout': {
            'visibility': 'invisible',
            'icon-image': 'marker-15',
            'icon-size': 0.75,
            'icon-allow-overlap': true
        }
    });

    map.addLayer({
        'id': 'crime22',
        'type': 'symbol',
        'source': 'crime22',
        'layout': {
            'visibility': 'invisible',
            'icon-image': 'marker-15',
            'icon-size': 0.75,
            'icon-allow-overlap': true
        }
    });

    map.addLayer({
        'id': 'crime23',
        'type': 'symbol',
        'source': 'crime23',
        'layout': {
            'visibility': 'invisible',
            'icon-image': 'marker-15',
            'icon-size': 0.75,
            'icon-allow-overlap': true
        }
    });

        // map.addLayer(
        //     {
        //     'id': 'crimes-heat',
        //     'type': 'heatmap',
        //     'source': 'crime_source',
        //     'maxzoom': 9,
        //     'paint': {
        //     // Increase the heatmap weight based on frequency and property magnitude
        //     'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'],
        //     0,
        //     0,
        //     6,
        //     1
        //     ],
        //     // Increase the heatmap color weight weight by zoom level
        //     // heatmap-intensity is a multiplier on top of heatmap-weight
        //     'heatmap-intensity': [
        //     'interpolate',
        //     ['linear'],
        //     ['zoom'],
        //     0,
        //     1,
        //     9,
        //     3
        //     ],
        //     // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
        //     // Begin color ramp at 0-stop with a 0-transparancy color
        //     // to create a blur-like effect.
        //     'heatmap-color': [
        //     'interpolate',
        //     ['linear'],
        //     ['heatmap-density'],
        //     0,
        //     'rgba(33,102,172,0)',
        //     0.2,
        //     'rgb(103,169,207)',
        //     0.4,
        //     'rgb(209,229,240)',
        //     0.6,
        //     'rgb(253,219,199)',
        //     0.8,
        //     'rgb(239,138,98)',
        //     1,
        //     'rgb(178,24,43)'
        //     ],
        //     // Adjust the heatmap radius by zoom level
        //     'heatmap-radius': [
        //     'interpolate',
        //     ['linear'],
        //     ['zoom'],
        //     0,
        //     2,
        //     9,
        //     20
        //     ],
        //     // Transition from heatmap to circle layer by zoom level
        //     'heatmap-opacity': [
        //     'interpolate',
        //     ['linear'],
        //     ['zoom'],
        //     7,
        //     1,
        //     9,
        //     0
        //     ]
        //     }
        //     },
        //     'waterway-label'
        //     );
    });
};

geojsonFetch();