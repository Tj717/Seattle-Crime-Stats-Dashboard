mapboxgl.accessToken =
'pk.eyJ1IjoiZmF0bW9vc2UiLCJhIjoiY2t1eWY0ZXRoMmhiMzJ3bzZnczcyMXZ1NyJ9._RrkxwKkDAlgErLRDaVcEA';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-122.222, 47.6026], 
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
    response18 = await fetch('assets/crimes_by_year/2018.geojson');
    // response19 = await fetch('assets/crimes_by_year/2019.geojson');
    // response20 = await fetch('assets/crimes_by_year/2020.geojson');
    // response21 = await fetch('assets/crimes_by_year/2021.geojson');
    // response22 = await fetch('assets/crimes_by_year/2022.geojson');
    // response23 = await fetch('assets/crimes_by_year/2023.geojson');

    let crime18 = await response18.json();
    // let crime19 = await response19.json();
    // let crime20 = await response20.json();
    // let crime21 = await response21.json();
    // let crime22 = await response22.json();
    // let crime23 = await response23.json();

    // map.setProjection({name: 'Mercator'});

    map.on('load', () => {
        map.addSource('crime18', {
            type: 'geojson',
            data: crime18
        });

        // map.addSource('crime19', {
        //     type: 'geojson',
        //     data: crime19
        // });

        // map.addSource('crime20', {
        //     type: 'geojson',
        //     data: crime20
        // });

        // map.addSource('crime21', {
        //     type: 'geojson',
        //     data: crime21
        // });

        // map.addSource('crime22', {
        //     type: 'geojson',
        //     data: crime22
        // });

        // map.addSource('crime23', {
        //     type: 'geojson',
        //     data: crime23
        // });


    // Crime-records layer
    // map.addLayer({
    //     'id': 'crime18',
    //     'type': 'symbol',
    //     'source': 'crime18',
    //     'layout': {
    //         // Make the layer visible by default.
    //         'visibility': 'visible',
    //         'icon-image': 'marker-15',
    //         'icon-size': 0.75,
    //         'icon-allow-overlap': true
    //     }
    // });

    // map.addLayer({
    //     'id': 'crime19',
    //     'type': 'symbol',
    //     'source': 'crime19',
    //     'layout': {
    //         'visibility': 'invisible',
    //         'icon-image': 'marker-15',
    //         'icon-size': 0.75,
    //         'icon-allow-overlap': true
    //     }
    // });

    // map.addLayer({
    //     'id': 'crime20',
    //     'type': 'symbol',
    //     'source': 'crime20',
    //     'layout': {
    //         'visibility': 'invisible',
    //         'icon-image': 'marker-15',
    //         'icon-size': 0.75,
    //         'icon-allow-overlap': true
    //     }
    // });

    // map.addLayer({
    //     'id': 'crime21',
    //     'type': 'symbol',
    //     'source': 'crime21',
    //     'layout': {
    //         'visibility': 'invisible',
    //         'icon-image': 'marker-15',
    //         'icon-size': 0.75,
    //         'icon-allow-overlap': true
    //     }
    // });

    // map.addLayer({
    //     'id': 'crime22',
    //     'type': 'symbol',
    //     'source': 'crime22',
    //     'layout': {
    //         'visibility': 'invisible',
    //         'icon-image': 'marker-15',
    //         'icon-size': 0.75,
    //         'icon-allow-overlap': true
    //     }
    // });

    // map.addLayer({
    //     'id': 'crime23',
    //     'type': 'symbol',
    //     'source': 'crime23',
    //     'layout': {
    //         'visibility': 'invisible',
    //         'icon-image': 'marker-15',
    //         'icon-size': 0.75,
    //         'icon-allow-overlap': true
    //     }
    // });

    map.addLayer(
        {
          id: 'crime-heat',
          type: 'heatmap',
          source: 'crime18',
          maxzoom: 15,
          paint: {
            // increase weight as diameter breast height increases
            'heatmap-weight': {
              property: 'dbh',
              type: 'exponential',
              stops: [
                [1, 0],
                [62, 1]
              ]
            },
            // increase intensity as zoom level increases
            'heatmap-intensity': {
              stops: [
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
              stops: [
                [11, 15],
                [15, 20]
              ]
            },
            // decrease opacity to transition into the circle layer
            'heatmap-opacity': {
              default: 1,
              stops: [
                [14, 1],
                [15, 0]
              ]
            }
          }
        },
        'waterway-label'
      );
    });

    map.addLayer(
        {
          id: 'crime-point',
          type: 'circle',
          source: 'crime18',
          minzoom: 14,
          paint: {
            // increase the radius of the circle as the zoom level and dbh value increases
            'circle-radius': {
              property: 'dbh',
              type: 'exponential',
              stops: [
                [{ zoom: 15, value: 1 }, 5],
                [{ zoom: 15, value: 62 }, 10],
                [{ zoom: 22, value: 1 }, 20],
                [{ zoom: 22, value: 62 }, 50]
              ]
            },
            'circle-color': {
              property: 'dbh',
              type: 'exponential',
              stops: [
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
              stops: [
                [14, 0],
                [15, 1]
              ]
            }
          }
        },
        'waterway-label'
      );
};

geojsonFetch();