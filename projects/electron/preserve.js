const fs = require('fs');
const path = 'node_modules/@materia-ui/ngx-monaco-editor/fesm2015/materia-ui-ngx-monaco-editor.js';

fs.readFile(path, 'utf8', (err, data) => {
  fs.writeFile(
    path,
    data.replace(/__dirname \+ '\/assets\/monaco-editor\/min\/vs'/g, "'assets/monaco-editor/min/vs'"),
    'utf8',
    err => err ? console.log('[PRESERVE] Error', err) : console.log('[PRESERVE] Success')
  );
});
