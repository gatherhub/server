var fs = require('fs');

if (process.env.URI) {
    var out = 'module.exports = "' + process.env.URI + '";';
    fs.writeFileSync('public/scripts/uri.js', out);
}
