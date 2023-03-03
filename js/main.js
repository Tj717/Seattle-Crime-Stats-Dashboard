mapboxgl.accessToken =
'pk.eyJ1IjoiZmF0bW9vc2UiLCJhIjoiY2t1eWY0ZXRoMmhiMzJ3bzZnczcyMXZ1NyJ9._RrkxwKkDAlgErLRDaVcEA';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-122.222, 47.63], 
    zoom: 10.4,
    scrollZoom: true,
});

let toggle = false;
const income = document.getElementById('income');
const container4 = document.getElementById('container4');
income.addEventListener('click', function() {
    if (!toggle) {
        map.flyTo({
                center: [-122.05, 47.63],
                zoom: 10.4,
                essential: false
                });
        toggle = true;
        income.classList.add('active');
        income.textContent = 'On';
    } else {
        map.flyTo({
            center: [-122.222, 47.63], 
            zoom: 10.4,
            essential: false
        });
        toggle = false;
        income.classList.remove('active');
        income.textContent = 'Off';
    }
});

let year;
let prev_year = 0;

const year_menu = document.getElementById('dropdown');
// year_menu.selectedIndex = -1;
year_menu.addEventListener('change', function() {
    // let year = parseInt(year_menu.value);
    year = parseInt(year_menu.value);
    form = document.getElementById('crimeAgainst');
    form.reset();
    if (year != 0) {
        // hideLayers();
        // let geojsonSource = map.getSource(`crime${year}`);
        if (prev_year > 2017) {
            removeLayer(prev_year);
            // geojsonSource.setData(`assets/crime_by_year/${year}.geojson`);
        }
        prev_year = year;
        // map.setLayoutProperty('crime2018-heat', 'visibility', 'visible');

        addData(year)
        .then(() => {addLayerHeat(year)})
        .then(() => {addLayerPoint(year)})
    }
});

const crimeAgainst = document.getElementById('crimeAgainst');
crimeAgainst.addEventListener("change", function() {
    removeLayer(prev_year);
    addData(year)
    .then(() => {addLayerHeat(year)})
    .then(() => {addLayerPoint(year)});
});

function removeLayer(year) {
    map.removeLayer(`crime${year}-heat`);
    map.removeLayer(`crime${year}-point`);
    map.removeSource(`crime${year}`);
}

function filterJson (data, keyWord) {
    let output = {
        "type": "FeatureCollection",
        "features": []
    };
    searchField = "CrimeAgainstCategory";
    searchVal = keyWord;
    length = Object.keys(data['features']).length;
    for (i = 0; i < length; i++) {
        // print(data['features'][i]['properties'])
        if (data['features'][i]['properties'][searchField].includes(searchVal)){
            output['features'].push(data['features'][i])
        }
    }
    console.log(output);
    return output
}

async function addData(year) {
    let response = await fetch(`assets/crimes_by_year/${year}.geojson`);
    let crime = await response.json();
    if (document.querySelector('input[name="question"]:checked')) {
        crime = filterJson(crime, document.querySelector('input[name="question"]:checked').value);
    }
    map.addSource(`crime${year}`, {
        type: 'geojson',
        data: crime
    });
}

function addLayerHeat(year) {
    map.addLayer(
        {
        'id': `crime${year}-heat`,
        'type': 'heatmap',
        'source': `crime${year}`,
        'layout': {'visibility': 'visible'},
        'maxzoom': 15,
        'paint': {
            // increase weight as diameter breast height increases
            'heatmap-weight': {
            'property': 'dbh',
            'type': 'exponential',
            'stops': [
                [1, 0],
                [62, 1]
            ]
            },
            // increase intensity as zoom level increases
            'heatmap-intensity': {
                'stops': [
                    [5, 1],
                    [8, 2],
                    [11, 3],
                    [15, 4]
                ]
            },
            // assign color values be applied to points depending on their density
            'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(236,222,239,0)',
            0.2,
            'rgb(0,209,230)',
            0.4,
            'rgb(255,100,255)',
            0.6,
            'rgb(255,0,255)',
            0.8,
            'rgb(102,0,102)'
            ],
            // increase radius as zoom increases
            'heatmap-radius': {
                'stops': [
                    [5, 1],
                    [8, 2],
                    [11, 3],
                    [15, 4]
                ]
            },
            // decrease opacity to transition into the circle layer
            'heatmap-opacity': {
            'default': 0.5,
            'stops': [
                [14, 1],
                [15, 0]
            ]
            }
        }
        },
        'waterway-label'
    );
}

function addLayerPoint(year) {
    map.addLayer(
        {
        'id': `crime${year}-point`,
        'type': 'circle',
        'source': `crime${year}`,
        'layout': {'visibility': 'visible'},
        'minzoom': 14,
        'paint': {
            // increase the radius of the circle as the zoom level and dbh value increases
            'circle-radius': {
            'property': 'dbh',
            'type': 'exponential',
            'stops': [
                [{ zoom: 15, value: 1 }, 5],
                [{ zoom: 15, value: 62 }, 10],
                [{ zoom: 22, value: 1 }, 20],
                [{ zoom: 22, value: 62 }, 50]
            ]
            },
            'circle-color': {
            'property': 'dbh',
            'type': 'exponential',
            'stops': [
                [0, 'rgba(236,222,239,0)'],
                [10, 'rgb(236,222,239)'],
                [20, 'rgb(208,209,230)'],
                [30, 'rgb(166,189,219)'],
                [40, 'rgb(103,169,207)'],
                [50, 'rgb(28,144,153)'],
                [60, 'rgb(1,108,89)']
            ]
            },
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': {
            'stops': [
                [14, 0],
                [15, 1]
            ]
            }
        }
        },
        'waterway-label'
    );
}

// TODO:
// 1. Add a Income Map
        // Use flyto when map is selected
// 2. Add treemap
// 3. Add Crime Stats
        // queryRenderedFeatures()
        // Or total records in the geojson
// 4. Add a Title