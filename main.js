mapboxgl.accessToken =
'pk.eyJ1IjoiZmF0bW9vc2UiLCJhIjoiY2t1eWY0ZXRoMmhiMzJ3bzZnczcyMXZ1NyJ9._RrkxwKkDAlgErLRDaVcEA';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-122.322, 47.6226], 
    zoom: 10.2,
    scrollZoom: true,
});