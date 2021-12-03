const fs = require('fs');


replaceBundleText(
    /return prefix \+ this.wasmPath \+ path;/g,
    'return "http://localhost:3000/" + path;');

function replaceBundleText(oldText, newText) {
    const bundleFile = "src/dist/bundle.js"

    fs.readFile(bundleFile, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        const result = data.replace(oldText, newText);

        fs.writeFile(bundleFile, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
}