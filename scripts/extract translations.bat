set NODE_ENV=development

cd ..

xcopy ".\src\translations\en.json" ".\src\translations\original_en.json" /y
xcopy ".\src\translations\fr.json" ".\src\translations\original_fr.json" /y
xcopy ".\src\translations\nl.json" ".\src\translations\original_nl.json" /y
xcopy ".\src\translations\en.json" ".\src\translations\original_de.json" /y

call npx extract-messages -l=en,fr,nl,de -o src\translations -d en --flat true src\**\*.js



cd scripts
node mergeJSONFiles.js ..\src\translations\en.json ..\src\translations\original_en.json ..\src\translations\en.json overwrite
node mergeJSONFiles.js ..\src\translations\fr.json ..\src\translations\original_fr.json ..\src\translations\fr.json overwrite
node mergeJSONFiles.js ..\src\translations\nl.json ..\src\translations\original_nl.json ..\src\translations\nl.json overwrite

node exportTranslationFiles.js

exit
del ..\src\translations\original_en.json
del ..\src\translations\original_fr.json
del ..\src\translations\original_nl.json


rem excel trick
rem =""""&$B2&""":"""&C2&""","

