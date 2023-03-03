#! usr/bin/env python
import json 

year = "2018"

file = f"assets/crimes_by_year/{year}.geojson"
outfile = f"assets/crimes_by_year/{year}.geojson"
data = json.load(open(file))

output = {
    "type": "FeatureCollection",
    "features": []
}

length = len(data['features'])
for i in range(length):
    long = data['features'][i]['geometry']['coordinates'][0]
    lat = data['features'][i]['geometry']['coordinates'][1]

    if long!= '0' and lat != '0' and long != ' Nonviolent"':
        data['features'][i]['geometry']['coordinates'][0] = float(long)
        data['features'][i]['geometry']['coordinates'][1] = float(lat)

        data['features'][i]['properties']['Longitude'] = float(long)
        data['features'][i]['properties']['Latitude'] = float(lat)

        data['features'][i]['geometry']['type'] = "Point"
        output['features'].append(data['features'][i])


result = open(outfile, 'w')
json.dump(output, result)