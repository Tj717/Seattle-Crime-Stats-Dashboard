let year = "2018";

async function getData() {
    let url = "https://media.githubusercontent.com/media/Tj717/Seattle-Crime-Stats-Dashboard/main/assets/crimes_by_year/" + year + ".geojson";
    let response = await fetch(url);
    let crime = await response.json();
    return crime;
}

async function scanJson () {
    let data = await getData();
    let output = {};
    let searchField = "CrimeAgainstCategory";
    let length = Object.keys(data['features']).length;
    for (i = 0; i < length; i++) {
        let offense = data['features'][i]['properties'][searchField];
        if (offense in output){
            output[offense] += 1;
        } else {
            output[offense] = 1;
        }
    }
    console.log( output);
    return output;
}

async function main() {
    for (year = 2018; year < 2024; year++) {
        console.log(year+ ": ");
        await scanJson();

    }
}

main();
