#! usr/bin/env python
import json 

year = "2023"

# Path for file to be filtered
in_file = 'cleaned_data.geojson'

# Path for file storing filtered GeoJSON
out_file = f"crimes_by_year/{year}.geojson"

data = json.load(open(in_file))

output = {
    "type": "FeatureCollection",
    "features": []
}

searchField = "ReportDateTime"
searchVal = year
length = len(data['features'])
for i in range(length):
    print(data['features'][i]['properties'])
    if searchVal in data['features'][i]['properties'][searchField]:
        output['features'].append(data['features'][i])

result = open(out_file, 'w')
json.dump(output, result)