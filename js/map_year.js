mapboxgl.accessToken =
'pk.eyJ1IjoiZmF0bW9vc2UiLCJhIjoiY2t1eWY0ZXRoMmhiMzJ3bzZnczcyMXZ1NyJ9._RrkxwKkDAlgErLRDaVcEA';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-122.222, 47.6026], 
    zoom: 10.2,
    scrollZoom: true,
});
let prev_year = 0;
const year_menu = document.getElementById('dropdown');
// year_menu.selectedIndex = -1;
year_menu.addEventListener('change', function() {
    let year = parseInt(year_menu.value);
    if (year != 0) {
        // hideLayers();
        // let geojsonSource = map.getSource(`crime${year}`);
        if (prev_year > 2017) {
            // map.setLayoutProperty(`crime${prev_year}`, 'visibility', 'none');
            // map.setLayoutProperty(`crime${prev_year}-heat`, 'visibility', 'none');
            map.removeLayer(`crime${prev_year}-heat`);
            map.removeLayer(`crime${prev_year}-point`);
            map.removeSource(`crime${prev_year}`);
            // geojsonSource.setData(`assets/crime_by_year/${year}.geojson`);
        }
        prev_year = year;
        // map.setLayoutProperty('crime2018-heat', 'visibility', 'visible');

        addData(year)
        // .then(() => {console.log(map.getSource(`crime${year}`))})
        .then(() => {addLayerHeat(year)})
        // .then(() => {console.log("added heat")})
        .then(() => {addLayerPoint(year)})
        // .then(() => {console.log("added point")})
        // .then(() => {map.setLayoutProperty(`crime${year}-heat`, 'visibility', 'visible')})
        // .then(() => {map.setLayoutProperty(`crime${year}-point`, 'visibility', 'visible')})
    }
});

async function addData(year) {
    let response = await fetch(`assets/crimes_by_year/${year}.geojson`);
    let crime = await response.json();
    // let data = map.addSource(`crime${year}`, {
    map.addSource(`crime${year}`, {
        type: 'geojson',
        data: crime
    });
}

function addLayerHeat(year) {
    // alert(`crime${year}`);  
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
                [11, 1],
                [15, 3]
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
            'rgb(208,209,230)',
            0.4,
            'rgb(166,189,219)',
            0.6,
            'rgb(103,169,207)',
            0.8,
            'rgb(28,144,153)'
            ],
            // increase radius as zoom increases
            'heatmap-radius': {
            'stops': [
                [11, 15],
                [15, 20]
            ]
            },
            // decrease opacity to transition into the circle layer
            'heatmap-opacity': {
            'default': 1,
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

// function hideLayers() {
//     // itereaete over map layers and hide all layers that include 'crime' in their id
//     let layers = map.getLayers;
//     console.log(layers);
//     // for (let i = 0; i < layers.length; i++) {
//     //     if (layers.id.includes('crime')) {
//     //         map.setLayoutProperty(layers.id, 'visibility', 'none');
//     //     }
//     // };
//     // map.setLayoutProperty('crime2018', 'visibility', 'none');
//     // map.setLayoutProperty('crime2019', 'visibility', 'none');
//     // map.setLayoutProperty('crime2020', 'visibility', 'none');
//     // map.setLayoutProperty('crime2021', 'visibility', 'none');
//     // map.setLayoutProperty('crime2022', 'visibility', 'none');
//     // map.setLayoutProperty('crime2023', 'visibility', 'none');
//     map.setLayoutProperty('crime2018-heat', 'visibility', 'none');
//     map.setLayoutProperty('crime2019-heat', 'visibility', 'none');
//     map.setLayoutProperty('crime2020-heat', 'visibility', 'none');
//     map.setLayoutProperty('crime2021-heat', 'visibility', 'none');
//     map.setLayoutProperty('crime2022-heat', 'visibility', 'none');
//     map.setLayoutProperty('crime2023-heat', 'visibility', 'none');
    
//     // map.getStyle().layers 
//     // .forEach(function(layer) {
//     //     if (layer.id.includes('crime')) {
//     //         console.log(123)
//     //         map.setLayoutProperty(layer, 'visibility', 'none');
//     //     }
//     // });
// }



// async function addData() {
//     let response = await fetch(`assets/crimes_by_year/2018.geojson`);
//     let crime = await response.json();
//     let source = map.addSource(crime2018, {
//         type: 'geojson',
//         data: crime
//     });
// }

// let response2018, response2019, response2020, response2021, response2022, response2023, crime2018, crime2019, crime2020, crime2021, crime2022, crime2023;
// async function getData() {
//     response2018 = await fetch('assets/crimes_by_year/2018.geojson');
//     response2019 = await fetch('assets/crimes_by_year/2019.geojson');
//     response2020 = await fetch('assets/crimes_by_year/2020.geojson');
//     response2021 = await fetch('assets/crimes_by_year/2021.geojson');
//     response2022 = await fetch('assets/crimes_by_year/2022.geojson');
//     response2023 = await fetch('assets/crimes_by_year/2023.geojson');
//     crime2018 = await response2018.json();
//     crime2019 = await response2019.json();
//     crime2020 = await response2020.json();
//     crime2021 = await response2021.json();
//     crime2022 = await response2022.json();
//     crime2023 = await response2023.json();
// }

async function geojsonFetch() { 
    // let response2018 = await fetch('assets/crimes_by_year/2018.geojson');
    // let response2019 = await fetch('assets/crimes_by_year/2019.geojson');
    // let response2020 = await fetch('assets/crimes_by_year/2020.geojson');
    // let response2021 = await fetch('assets/crimes_by_year/2021.geojson');
    // let response2022 = await fetch('assets/crimes_by_year/2022.geojson');
    // let response2023 = await fetch('assets/crimes_by_year/2023.geojson');
    // let crime2018 = await response2018.json();
    // let crime2019 = await response2019.json();
    // let crime2020 = await response2020.json();
    // let crime2021 = await response2021.json();
    // let crime2022 = await response2022.json();
    // let crime2023 = await response2023.json();

    // getData();
    // map.setProjection({name: 'Mercator'});

    map.on('load', () => {
        // for (let i = 2018; i < 2024; i++) {
        //     map.addSource(`crime${i}`, {
        //         'type': 'geojson',
        //         'data': `crime${i}`
        //     });
        // }

        // map.addSource('crime2018', {
        //     type: 'geojson',
        //     data: crime2018
        // });

        // map.addSource('crime2019', {
        //     type: 'geojson',
        //     data: crime2019
        // });

        // map.addSource('crime2020', {
        //     type: 'geojson',
        //     data: crime2020
        // });

        // map.addSource('crime2021', {
        //     type: 'geojson',
        //     data: crime2021
        // });

        // map.addSource('crime2022', {
        //     type: 'geojson',
        //     data: crime2022
        // });

        // map.addSource('crime2023', {
        //     type: 'geojson',
        //     data: crime2023
        // });

        // map.addLayer(
        //     {
        //     'id': 'crime2018-heat',
        //     'type': 'heatmap',
        //     'source': 'crime2018',
        //     'layout': {'visibility': 'none'},
        //     'maxzoom': 15,
        //     'paint': {
        //         // increase weight as diameter breast height increases
        //         'heatmap-weight': {
        //         'property': 'dbh',
        //         'type': 'exponential',
        //         'stops': [
        //             [1, 0],
        //             [62, 1]
        //         ]
        //         },
        //         // increase intensity as zoom level increases
        //         'heatmap-intensity': {
        //         'stops': [
        //             [11, 1],
        //             [15, 3]
        //         ]
        //         },
        //         // assign color values be applied to points depending on their density
        //         'heatmap-color': [
        //         'interpolate',
        //         ['linear'],
        //         ['heatmap-density'],
        //         0,
        //         'rgba(236,222,239,0)',
        //         0.2,
        //         'rgb(208,209,230)',
        //         0.4,
        //         'rgb(166,189,219)',
        //         0.6,
        //         'rgb(103,169,207)',
        //         0.8,
        //         'rgb(28,144,153)'
        //         ],
        //         // increase radius as zoom increases
        //         'heatmap-radius': {
        //         'stops': [
        //             [11, 15],
        //             [15, 20]
        //         ]
        //         },
        //         // decrease opacity to transition into the circle layer
        //         'heatmap-opacity': {
        //         'default': 1,
        //         'stops': [
        //             [14, 1],
        //             [15, 0]
        //         ]
        //         }
        //     }
        //     },
        //     'waterway-label'
        // );

        // map.addLayer(
        //     {
        //     'id': 'crime2018-point',
        //     'type': 'circle',
        //     'source':'crime2018',
        //     'layout': {'visibility': 'none'},
        //     'minzoom': 14,
        //     'paint': {
        //         // increase the radius of the circle as the zoom level and dbh value increases
        //         'circle-radius': {
        //         'property': 'dbh',
        //         'type': 'exponential',
        //         'stops': [
        //             [{ zoom: 15, value: 1 }, 5],
        //             [{ zoom: 15, value: 62 }, 10],
        //             [{ zoom: 22, value: 1 }, 20],
        //             [{ zoom: 22, value: 62 }, 50]
        //         ]
        //         },
        //         'circle-color': {
        //         'property': 'dbh',
        //         'type': 'exponential',
        //         'stops': [
        //             [0, 'rgba(236,222,239,0)'],
        //             [10, 'rgb(236,222,239)'],
        //             [20, 'rgb(208,209,230)'],
        //             [30, 'rgb(166,189,219)'],
        //             [40, 'rgb(103,169,207)'],
        //             [50, 'rgb(28,144,153)'],
        //             [60, 'rgb(1,108,89)']
        //         ]
        //         },
        //         'circle-stroke-color': 'white',
        //         'circle-stroke-width': 1,
        //         'circle-opacity': {
        //         'stops': [
        //             [14, 0],
        //             [15, 1]
        //         ]
        //         }
        //     }
        //     },
        //     'waterway-label'
        // );

        // map.addLayer(
        //     {
        //     'id': 'crime2019-heat',
        //     'type': 'heatmap',
        //     'source': 'crime2019',
        //     'layout': {'visibility': 'none'},
        //     'maxzoom': 15,
        //     'paint': {
        //         // increase weight as diameter breast height increases
        //         'heatmap-weight': {
        //         'property': 'dbh',
        //         'type': 'exponential',
        //         'stops': [
        //             [1, 0],
        //             [62, 1]
        //         ]
        //         },
        //         // increase intensity as zoom level increases
        //         'heatmap-intensity': {
        //         'stops': [
        //             [11, 1],
        //             [15, 3]
        //         ]
        //         },
        //         // assign color values be applied to points depending on their density
        //         'heatmap-color': [
        //         'interpolate',
        //         ['linear'],
        //         ['heatmap-density'],
        //         0,
        //         'rgba(236,222,239,0)',
        //         0.2,
        //         'rgb(208,209,230)',
        //         0.4,
        //         'rgb(166,189,219)',
        //         0.6,
        //         'rgb(103,169,207)',
        //         0.8,
        //         'rgb(28,144,153)'
        //         ],
        //         // increase radius as zoom increases
        //         'heatmap-radius': {
        //         'stops': [
        //             [11, 15],
        //             [15, 20]
        //         ]
        //         },
        //         // decrease opacity to transition into the circle layer
        //         'heatmap-opacity': {
        //         'default': 1,
        //         'stops': [
        //             [14, 1],
        //             [15, 0]
        //         ]
        //         }
        //     }
        //     },
        //     'waterway-label'
        // );

        // map.addLayer(
        //     {
        //     'id': 'crime2019-point',
        //     'type': 'circle',
        //     'source':'crime2019',
        //     'layout': {'visibility': 'none'},
        //     'minzoom': 14,
        //     'paint': {
        //         // increase the radius of the circle as the zoom level and dbh value increases
        //         'circle-radius': {
        //         'property': 'dbh',
        //         'type': 'exponential',
        //         'stops': [
        //             [{ zoom: 15, value: 1 }, 5],
        //             [{ zoom: 15, value: 62 }, 10],
        //             [{ zoom: 22, value: 1 }, 20],
        //             [{ zoom: 22, value: 62 }, 50]
        //         ]
        //         },
        //         'circle-color': {
        //         'property': 'dbh',
        //         'type': 'exponential',
        //         'stops': [
        //             [0, 'rgba(236,222,239,0)'],
        //             [10, 'rgb(236,222,239)'],
        //             [20, 'rgb(208,209,230)'],
        //             [30, 'rgb(166,189,219)'],
        //             [40, 'rgb(103,169,207)'],
        //             [50, 'rgb(28,144,153)'],
        //             [60, 'rgb(1,108,89)']
        //         ]
        //         },
        //         'circle-stroke-color': 'white',
        //         'circle-stroke-width': 1,
        //         'circle-opacity': {
        //         'stops': [
        //             [14, 0],
        //             [15, 1]
        //         ]
        //         }
        //     }
        //     },
        //     'waterway-label'
        // );

        // map.addLayer(
        //     {
        //     'id': 'crime2020-heat',
        //     'type': 'heatmap',
        //     'source': 'crime2020',
        //     'layout': {'visibility': 'none'},
        //     'maxzoom': 15,
        //     'paint': {
        //         // increase weight as diameter breast height increases
        //         'heatmap-weight': {
        //         'property': 'dbh',
        //         'type': 'exponential',
        //         'stops': [
        //             [1, 0],
        //             [62, 1]
        //         ]
        //         },
        //         // increase intensity as zoom level increases
        //         'heatmap-intensity': {
        //         'stops': [
        //             [11, 1],
        //             [15, 3]
        //         ]
        //         },
        //         // assign color values be applied to points depending on their density
        //         'heatmap-color': [
        //         'interpolate',
        //         ['linear'],
        //         ['heatmap-density'],
        //         0,
        //         'rgba(236,222,239,0)',
        //         0.2,
        //         'rgb(208,209,230)',
        //         0.4,
        //         'rgb(166,189,219)',
        //         0.6,
        //         'rgb(103,169,207)',
        //         0.8,
        //         'rgb(28,144,153)'
        //         ],
        //         // increase radius as zoom increases
        //         'heatmap-radius': {
        //         'stops': [
        //             [11, 15],
        //             [15, 20]
        //         ]
        //         },
        //         // decrease opacity to transition into the circle layer
        //         'heatmap-opacity': {
        //         'default': 1,
        //         'stops': [
        //             [14, 1],
        //             [15, 0]
        //         ]
        //         }
        //     }
        //     },
        //     'waterway-label'
        // );

        // map.addLayer(
        //     {
        //     'id': 'crime2020-point',
        //     'type': 'circle',
        //     'source':'crime2020',
        //     'layout': {'visibility': 'none'},
        //     'minzoom': 14,
        //     'paint': {
        //         // increase the radius of the circle as the zoom level and dbh value increases
        //         'circle-radius': {
        //         'property': 'dbh',
        //         'type': 'exponential',
        //         'stops': [
        //             [{ zoom: 15, value: 1 }, 5],
        //             [{ zoom: 15, value: 62 }, 10],
        //             [{ zoom: 22, value: 1 }, 20],
        //             [{ zoom: 22, value: 62 }, 50]
        //         ]
        //         },
        //         'circle-color': {
        //         'property': 'dbh',
        //         'type': 'exponential',
        //         'stops': [
        //             [0, 'rgba(236,222,239,0)'],
        //             [10, 'rgb(236,222,239)'],
        //             [20, 'rgb(208,209,230)'],
        //             [30, 'rgb(166,189,219)'],
        //             [40, 'rgb(103,169,207)'],
        //             [50, 'rgb(28,144,153)'],
        //             [60, 'rgb(1,108,89)']
        //         ]
        //         },
        //         'circle-stroke-color': 'white',
        //         'circle-stroke-width': 1,
        //         'circle-opacity': {
        //         'stops': [
        //             [14, 0],
        //             [15, 1]
        //         ]
        //         }
        //     }
        //     },
        //     'waterway-label'
        // );

        // map.addLayer(
        //     {
        //     'id': 'crime2021-heat',
        //     'type': 'heatmap',
        //     'source': 'crime2021',
        //     'layout': {'visibility': 'none'},
        //     'maxzoom': 15,
        //     'paint': {
        //         // increase weight as diameter breast height increases
        //         'heatmap-weight': {
        //         'property': 'dbh',
        //         'type': 'exponential',
        //         'stops': [
        //             [1, 0],
        //             [62, 1]
        //         ]
        //         },
        //         // increase intensity as zoom level increases
        //         'heatmap-intensity': {
        //         'stops': [
        //             [11, 1],
        //             [15, 3]
        //         ]
        //         },
        //         // assign color values be applied to points depending on their density
        //         'heatmap-color': [
        //         'interpolate',
        //         ['linear'],
        //         ['heatmap-density'],
        //         0,
        //         'rgba(236,222,239,0)',
        //         0.2,
        //         'rgb(208,209,230)',
        //         0.4,
        //         'rgb(166,189,219)',
        //         0.6,
        //         'rgb(103,169,207)',
        //         0.8,
        //         'rgb(28,144,153)'
        //         ],
        //         // increase radius as zoom increases
        //         'heatmap-radius': {
        //         'stops': [
        //             [11, 15],
        //             [15, 20]
        //         ]
        //         },
        //         // decrease opacity to transition into the circle layer
        //         'heatmap-opacity': {
        //         'default': 1,
        //         'stops': [
        //             [14, 1],
        //             [15, 0]
        //         ]
        //         }
        //     }
        //     },
        //     'waterway-label'
        // );

        // map.addLayer(
        //     {
        //     'id': 'crime2021-point',
        //     'type': 'circle',
        //     'source':'crime2021',
        //     'layout': {'visibility': 'none'},
        //     'minzoom': 14,
        //     'paint': {
        //         // increase the radius of the circle as the zoom level and dbh value increases
        //         'circle-radius': {
        //         'property': 'dbh',
        //         'type': 'exponential',
        //         'stops': [
        //             [{ zoom: 15, value: 1 }, 5],
        //             [{ zoom: 15, value: 62 }, 10],
        //             [{ zoom: 22, value: 1 }, 20],
        //             [{ zoom: 22, value: 62 }, 50]
        //         ]
        //         },
        //         'circle-color': {
        //         'property': 'dbh',
        //         'type': 'exponential',
        //         'stops': [
        //             [0, 'rgba(236,222,239,0)'],
        //             [10, 'rgb(236,222,239)'],
        //             [20, 'rgb(208,209,230)'],
        //             [30, 'rgb(166,189,219)'],
        //             [40, 'rgb(103,169,207)'],
        //             [50, 'rgb(28,144,153)'],
        //             [60, 'rgb(1,108,89)']
        //         ]
        //         },
        //         'circle-stroke-color': 'white',
        //         'circle-stroke-width': 1,
        //         'circle-opacity': {
        //         'stops': [
        //             [14, 0],
        //             [15, 1]
        //         ]
        //         }
        //     }
        //     },
        //     'waterway-label'
        // );

        // map.addLayer(
        //     {
        //     'id': 'crime2022-heat',
        //     'type': 'heatmap',
        //     'source': 'crime2022',
        //     'layout': {'visibility': 'none'},
        //     'maxzoom': 15,
        //     'paint': {
        //         // increase weight as diameter breast height increases
        //         'heatmap-weight': {
        //         'property': 'dbh',
        //         'type': 'exponential',
        //         'stops': [
        //             [1, 0],
        //             [62, 1]
        //         ]
        //         },
        //         // increase intensity as zoom level increases
        //         'heatmap-intensity': {
        //         'stops': [
        //             [11, 1],
        //             [15, 3]
        //         ]
        //         },
        //         // assign color values be applied to points depending on their density
        //         'heatmap-color': [
        //         'interpolate',
        //         ['linear'],
        //         ['heatmap-density'],
        //         0,
        //         'rgba(236,222,239,0)',
        //         0.2,
        //         'rgb(208,209,230)',
        //         0.4,
        //         'rgb(166,189,219)',
        //         0.6,
        //         'rgb(103,169,207)',
        //         0.8,
        //         'rgb(28,144,153)'
        //         ],
        //         // increase radius as zoom increases
        //         'heatmap-radius': {
        //         'stops': [
        //             [11, 15],
        //             [15, 20]
        //         ]
        //         },
        //         // decrease opacity to transition into the circle layer
        //         'heatmap-opacity': {
        //         'default': 1,
        //         'stops': [
        //             [14, 1],
        //             [15, 0]
        //         ]
        //         }
        //     }
        //     },
        //     'waterway-label'
        // );

        // map.addLayer(
        //     {
        //     'id': 'crime2022-point',
        //     'type': 'circle',
        //     'source':'crime2022',
        //     'layout': {'visibility': 'none'},
        //     'minzoom': 14,
        //     'paint': {
        //         // increase the radius of the circle as the zoom level and dbh value increases
        //         'circle-radius': {
        //         'property': 'dbh',
        //         'type': 'exponential',
        //         'stops': [
        //             [{ zoom: 15, value: 1 }, 5],
        //             [{ zoom: 15, value: 62 }, 10],
        //             [{ zoom: 22, value: 1 }, 20],
        //             [{ zoom: 22, value: 62 }, 50]
        //         ]
        //         },
        //         'circle-color': {
        //         'property': 'dbh',
        //         'type': 'exponential',
        //         'stops': [
        //             [0, 'rgba(236,222,239,0)'],
        //             [10, 'rgb(236,222,239)'],
        //             [20, 'rgb(208,209,230)'],
        //             [30, 'rgb(166,189,219)'],
        //             [40, 'rgb(103,169,207)'],
        //             [50, 'rgb(28,144,153)'],
        //             [60, 'rgb(1,108,89)']
        //         ]
        //         },
        //         'circle-stroke-color': 'white',
        //         'circle-stroke-width': 1,
        //         'circle-opacity': {
        //         'stops': [
        //             [14, 0],
        //             [15, 1]
        //         ]
        //         }
        //     }
        //     },
        //     'waterway-label'
        // );

        // map.addLayer(
        //     {
        //     'id': 'crime2023-heat',
        //     'type': 'heatmap',
        //     'source': 'crime2023',
        //     'layout': {'visibility': 'none'},
        //     'maxzoom': 15,
        //     'paint': {
        //         // increase weight as diameter breast height increases
        //         'heatmap-weight': {
        //         'property': 'dbh',
        //         'type': 'exponential',
        //         'stops': [
        //             [1, 0],
        //             [62, 1]
        //         ]
        //         },
        //         // increase intensity as zoom level increases
        //         'heatmap-intensity': {
        //         'stops': [
        //             [11, 1],
        //             [15, 3]
        //         ]
        //         },
        //         // assign color values be applied to points depending on their density
        //         'heatmap-color': [
        //         'interpolate',
        //         ['linear'],
        //         ['heatmap-density'],
        //         0,
        //         'rgba(236,222,239,0)',
        //         0.2,
        //         'rgb(208,209,230)',
        //         0.4,
        //         'rgb(166,189,219)',
        //         0.6,
        //         'rgb(103,169,207)',
        //         0.8,
        //         'rgb(28,144,153)'
        //         ],
        //         // increase radius as zoom increases
        //         'heatmap-radius': {
        //         'stops': [
        //             [11, 15],
        //             [15, 20]
        //         ]
        //         },
        //         // decrease opacity to transition into the circle layer
        //         'heatmap-opacity': {
        //         'default': 1,
        //         'stops': [
        //             [14, 1],
        //             [15, 0]
        //         ]
        //         }
        //     }
        //     },
        //     'waterway-label'
        // );

        // map.addLayer(
        //     {
        //     'id': 'crime2023-point',
        //     'type': 'circle',
        //     'source':'crime2023',
        //     'layout': {'visibility': 'none'},
        //     'minzoom': 14,
        //     'paint': {
        //         // increase the radius of the circle as the zoom level and dbh value increases
        //         'circle-radius': {
        //         'property': 'dbh',
        //         'type': 'exponential',
        //         'stops': [
        //             [{ zoom: 15, value: 1 }, 5],
        //             [{ zoom: 15, value: 62 }, 10],
        //             [{ zoom: 22, value: 1 }, 20],
        //             [{ zoom: 22, value: 62 }, 50]
        //         ]
        //         },
        //         'circle-color': {
        //         'property': 'dbh',
        //         'type': 'exponential',
        //         'stops': [
        //             [0, 'rgba(236,222,239,0)'],
        //             [10, 'rgb(236,222,239)'],
        //             [20, 'rgb(208,209,230)'],
        //             [30, 'rgb(166,189,219)'],
        //             [40, 'rgb(103,169,207)'],
        //             [50, 'rgb(28,144,153)'],
        //             [60, 'rgb(1,108,89)']
        //         ]
        //         },
        //         'circle-stroke-color': 'white',
        //         'circle-stroke-width': 1,
        //         'circle-opacity': {
        //         'stops': [
        //             [14, 0],
        //             [15, 1]
        //         ]
        //         }
        //     }
        //     },
        //     'waterway-label'
        // );
        // console.log("layers added");
    });
};

// hideLayers();
// geojsonFetch();