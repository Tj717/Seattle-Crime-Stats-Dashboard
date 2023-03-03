// npmjs.com/package/convert-csv-to-json
// npm install convert-csv-to-json --save
// npm install -g convert-csv-to-json

let csvToJson = require('convert-csv-to-json');
let fileInputName = 'assets/crime_since_2018.csv';
let fileOutputName = 'assets/data.json';

csvToJson.fieldDelimiter(',').generateJsonFileFromCsv(fileInputName,fileOutputName);
