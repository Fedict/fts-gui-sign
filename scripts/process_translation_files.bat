mkdir tr

xcopy /Y ..\src\translations\* .\tr\

node readTranslationsFile.js ui-translations.csv 1 ./tr/en_new.json
node readTranslationsFile.js ui-translations.csv 2 ./tr/fr_new.json
node readTranslationsFile.js ui-translations.csv 3 ./tr/nl_new.json
node readTranslationsFile.js ui-translations.csv 4 ./tr/de_new.json

node mergeJSONFiles.js ./tr/en.json ./tr/en_new.json ../src/translations/en.json

echo new entries added
echo When ready will overwrite existing entries

pause

node mergeJSONFiles.js ./tr/en.json ./tr/en_new.json ../src/translations/en.json overwrite

pause

node mergeJSONFiles.js ./tr/nl.json ./tr/nl_new.json ./tr/nl.json

echo new entries added
echo When ready will overwrite existing entries

pause

node mergeJSONFiles.js ./tr/nl.json ./tr/nl_new.json ../src/translations/nl.json overwrite

pause

node mergeJSONFiles.js ./tr/fr.json ./tr/fr_new.json ./tr/fr.json

echo new entries added
echo When ready will overwrite existing entries

pause

node mergeJSONFiles.js ./tr/fr.json ./tr/fr_new.json ../src/translations/fr.json overwrite

pause

node mergeJSONFiles.js ./tr/de.json ./tr/de_new.json ./tr/de.json

echo new entries added
echo When ready will overwrite existing entries

pause

node mergeJSONFiles.js ./tr/de.json ./tr/de_new.json ../src/translations/de.json overwrite

pause