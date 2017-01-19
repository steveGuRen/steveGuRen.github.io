var test = "HEllo world";
console.log("test");
// const fs = require('fs');

const path = require('path');
const fileapi = require("./required/module/fastquery/fileapi")
var data = {
    list: [
        { "name": "denghuizhi" },
        { "name": "dengbolun" },
        { "name": "fengliqian" },
        { "name": "dengyuxiang" }
    ]
}
var jsonStr = JSON.stringify(data);
fileapi.ls("./api-md/");
fileapi.getFileContent("./api-md/test.md", function(data) {
    fileapi.write("message.txt", data);
});
