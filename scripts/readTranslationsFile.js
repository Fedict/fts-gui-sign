var csvReader = require('csvreader');
var fs = require('fs');
let myArgs = process.argv.slice(2);


if(myArgs.length < 3){
    console.error(`Usage node ${process.argv[1]} path_to_csv_file data_column destination`);
    return 1;
}

let dataColumn = parseInt(myArgs[1]);

if(!(dataColumn > 0)){
    console.error(`Data column is invalid ${myArgs[1]}`);
    return 1;
}

let r = {};

function recordHandler(data){
	r[data[0]] = data[dataColumn];
}

let options = {
	hasHeaders:true,
	parseOptions: {
        delimiter: ';'
    }
}

csvReader
    .read(myArgs[0], recordHandler, options)
    .then(() => {
		fs.writeFileSync(myArgs[2], JSON.stringify(r, null, 2));
    })
    .catch(err => {
        console.error(err);
    });