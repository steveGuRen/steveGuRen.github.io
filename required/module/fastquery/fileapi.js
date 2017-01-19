//fileapi.js

const fs = require('fs');
var fileapi = {
    getFileContent: function (file, callback) {
        var readerStream = fs.createReadStream(file);
        var temp = "";
        readerStream.on("data", function (chunk) {
            temp += chunk;
        });
        readerStream.on('end', function () {
            callback(temp);
        });
    },
    ls: function (file) {
        var files = fs.readdirSync(file);
        for (fn in files) {
            var fname = file + "/" + files[fn];
            var stat = fs.lstatSync(fname);
            if (stat.isDirectory() == true) {
                ls(fname);
            } else {
                console.log(fname);
            }
        }
    },
    write: function(file, data) {
        var stream = fs.createWriteStream(file);
        stream.once("open", function() {
            stream.write(data);
            stream.end();
        });
    }
}

module.exports = fileapi;
