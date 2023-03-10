mapboxgl.accessToken =
'pk.eyJ1IjoiZmF0bW9vc2UiLCJhIjoiY2t1eWY0ZXRoMmhiMzJ3bzZnczcyMXZ1NyJ9._RrkxwKkDAlgErLRDaVcEA';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-122.222, 47.63], 
    zoom: 10.4,
    scrollZoom: true,
});

let year;
let prev_year = 0;
let total_row = 0;
let toggle = false;

const title = document.getElementById('container1');
const year_menu = document.getElementById('dropdown');
const crimeAgainst = document.getElementById('crimeAgainst');
const income = document.getElementById('income');
const income_map = document.getElementById('income_map');
const container4 = document.getElementById('container4');

window.addEventListener('resize', function() {
    let pie = document.getElementById('chart_wrapper');
    if(pie.classList.contains('active')) {
        pie.removeChild(pie.lastChild);
    }
    addPieChart();
});

year_menu.addEventListener('change', function() {
    year = parseInt(year_menu.value);
    form = document.getElementById('crimeAgainst');
    form.reset();
    if (year != 0) {
        if (prev_year > 2017) {
            removeLayer(prev_year);
        }
        let pie = document.getElementById('chart_wrapper');

        if(pie.classList.contains('active')) {
            pie.removeChild(pie.lastChild);
        }

        addPieChart();
        addStats()

        prev_year = year;
        addData()
        .then(() => {addLayerHeat()})
        .then(() => {addLayerPoint()})
    }
});

crimeAgainst.addEventListener("change", function() {
    removeLayer(prev_year);
    addData()
    .then(() => {addLayerHeat()})
    .then(() => {addLayerPoint()});
});

income.addEventListener('click', function() {
    if (!toggle) {
        map.flyTo({
                center: [-122.10, 47.589],
                zoom: 10.4,
                essential: false
                });
        toggle = true;
        income_map.style.display = "block";
        title.style.display = "none";
        income.classList.add('active');
        income.textContent = 'On';
    } else {
        map.flyTo({
            center: [-122.222, 47.63], 
            zoom: 10.4,
            essential: false
        });
        toggle = false;
        income_map.style.display = "none";
        title.style.display = "flex";
        income.classList.remove('active');
        income.textContent = 'Off';
    }
});

async function addData() {
    // Load data from local file
    // let response = await fetch(`assets/crimes_by_year/${year}.geojson`);

    // Load data from Github repo
    let url = "https://media.githubusercontent.com/media/Tj717/Seattle-Crime-Stats-Dashboard/main/assets/crimes_by_year/" + year + ".geojson";
    let response = await fetch(url);
    let crime = await response.json();
    total_row = Object.keys(crime['features']).length;
    if (document.querySelector('input[name="question"]:checked')) {
        crime = filterJson(crime, document.querySelector('input[name="question"]:checked').value);
    }
    map.addSource(`crime${year}`, {
        type: 'geojson',
        data: crime
    });
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
    // console.log(output);
    return output
}

function removeLayer() {
    map.removeLayer(`crime${year}-heat`);
    map.removeLayer(`crime${year}-point`);
    map.removeSource(`crime${year}`);
}

function addPieChart() {
    var data2023 = [{
        values: [7214, 1298, 555],
        labels: ['Property', 'Person', 'Society'],
        type: 'pie',
        textinfo: "label+percent"
    }];
      
    var data2022 = [{
        values: [54873, 10096, 4196],
        labels: ['Property', 'Person', 'Society'],
        type: 'pie',
        textinfo: "label+percent"
    }];

    var data2021 = [{
        values: [53071, 9901, 3380],
        labels: ['Property', 'Person', 'Society'],
        type: 'pie',
        textinfo: "label+percent"
    }];

    var data2020 = [{
        values: [57808, 9330, 4638],
        labels: ['Property', 'Person', 'Society'],
        type: 'pie',
        textinfo: "label+percent"
    }];

    var data2019 = [{
        values: [49248, 10661, 7573],
        labels: ['Property', 'Person', 'Society'],
        type: 'pie',
        textinfo: "label+percent"
    }];

    var data2018 = [{
        values: [52587, 10910, 8949],
        labels: ['Property', 'Person', 'Society'],
        type: 'pie',
        textinfo: "label+percent"
    }];

    // var layout = {
    //     height: 250,
    //     width: 280
    // };
    var config = {responsive: true};

    var layout = {
        margin: {"t": 20, "b": 10, "l": 40, "r": 10},
        showlegend: false,
        width: window.innerWidth * 0.15,
        height: window.innerHeight * 0.3,
        autosize: true
    };

    let pie = document.getElementById('chart_wrapper');
    Plotly.newPlot(pie, eval(`data${year}`), layout, config);
    pie.classList.add('active');
}

function addLayerHeat() {
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
                    [8, 1],
                    [11, 3],
                    [15, 5]
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
                    [8, 1],
                    [11, 2],
                    [15, 3]
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

function addLayerPoint() {
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

function addStats() {
    let data = ["72,446", "67,482", "71,776", "66,352", "69,165", "9,067"];
    let curr_stats = document.getElementById('year_curr');
    let prev_stats = document.getElementById('year_prev');
    let next_stats = document.getElementById('year_next');
    let index = year - 2018;
    if (year == 2023) {
        prev_stats.style.display = "block";
        prev_stats.innerHTML = "Previous Year Total Records: " + data[index - 1];
        next_stats.innerHTML = "";
    } else if (year == 2018) {
        next_stats.innerHTML = "Next Year Total Records: " + data[index + 1];
        prev_stats.innerHTML = "";
        prev_stats.style.display = "none";
    } else {
        prev_stats.style.display = "block";
        prev_stats.innerHTML = "Previous Year Total Records: " + data[index - 1];
        next_stats.innerHTML = "Next Year Total Records: " + data[index + 1];
    }
    curr_stats.innerHTML = "Current Year Total Records: " + data[index];
}
