const fs = require('fs');
const path = 'node_modules/@materia-ui/ngx-monaco-editor/fesm2015/materia-ui-ngx-monaco-editor.js';

fs.readFile(path, 'utf8', (err, data) => {
  fs.writeFile(
    path,
    data.replace(/'assets\/monaco-editor\/min\/vs'/g, '__dirname + \'/assets/monaco-editor/min/vs\''),
    'utf8',
    err => err ? console.log('[PREBUILD] Error', err) : console.log('[PREBUILD] Success')
  );
});
