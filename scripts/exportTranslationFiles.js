const languages = ['en', 'fr', 'nl', 'de'];
const translations = {}
languages.map(l => {
    translations[l] = require(`../src/translations/${l}.json`);
})

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'ui-translations.csv',
    header: [
        {id: 'key', title: 'Key'},
        {id: 'en', title: 'English'},
        {id: 'fr', title: 'Français'},
        {id: 'nl', title: 'Nederlands'},
        {id: 'de', title: 'Deutsch'},
    ]
});

const data = Object.keys(translations[languages[0]]).map((key) => {
    let o = {
        key
    }
    o = languages.reduce((accumulator, currentValue) => {
        accumulator[currentValue] = translations[currentValue][key];
        return accumulator;
    }, o);
    return o;
}, {});

csvWriter
    .writeRecords(data)
    .then(()=> console.log('The CSV file was written successfully'));