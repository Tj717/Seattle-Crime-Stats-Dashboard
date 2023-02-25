#! usr/bin/env python
import json 

# Path for file to be converted
in_file = 'data.json'

# Path for file storing converted GeoJSON
out_file = 'geo_data.geojson'

# Type of geometry e.g. Point, LineString, Polygon
geo_type = 'point'

data = json.load(open(in_file))

geojson = {
    "type": "FeatureCollection",
    "features": [
    {
        "type": "Feature",
        "geometry" : {
            "type": geo_type,
            "coordinates": [d["Longitude"], d["Latitude"]],
            },
        "properties" : d,
     } for d in data]
}

output = open(out_file, 'w')
json.dump(geojson, output)