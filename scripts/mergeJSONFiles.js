let fs = require('fs');
let path = require('path');

let myArgs = process.argv.slice(2);

if(myArgs.length < 3){
    console.error(`Usage node ${process.argv[1]} path_to_base_file path_to_new_file destination_file`);
    return 1;
}

let baseFile = require(myArgs[0]);
let newFile = require(myArgs[1]);
let destFile = myArgs[2];
let overwrite = (myArgs[3] === 'overwrite');
let overwriteOnly = (myArgs[3] === 'overwriteonly');

Object.keys(newFile).forEach((key) => {
    if(!baseFile[key]){
		if(!overwriteOnly || baseFile[key] === ''){
			baseFile[key] = newFile[key];
		}
    }else if((overwrite || overwriteOnly) && baseFile[key] !== newFile[key]){
        baseFile[key] = newFile[key];
    }
});

fs.writeFileSync(destFile, JSON.stringify(baseFile, Object.keys(baseFile).sort(), 2));