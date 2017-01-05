var converter = new showdown.Converter();
showdown.setFlavor('github');
//converter.setFlavor('github');
//converter.setOption('noHeaderId', true);
//converter.setOption('ghCompatibleHeaderId', true);
//converter.setOption('prefixHeaderId', true);
//converter.setOption('simplifiedAutoLink', true);
//converter.setOption('excludeTrailingPunctuationFromURLs', true);
//converter.setOption('literalMidWordUnderscores', true);
//converter.setOption('strikethrough', true);
//converter.setOption('tables', true);
//converter.setOption('tablesHeaderId', true);
//converter.setOption('tasklists', true);
//converter.setOption('smoothLivePreview', true);
//converter.setOption('disableForced4SpacesIndentedSublists', true);
//converter.setOption('simpleLineBreaks', true);
//converter.setOption('requireSpaceBeforeHeadingText', true);

converter.setOption('ghCodeBlocks', true);
var myCodeMirror = CodeMirror.fromTextArea(document.getElementById("text-area"), {
    lineNumbers: true,
    value: "function myScript(){return 100;}\n",
	mode:  "markdown"
})

myCodeMirror.on("change", function(CodeMirror, changeObj){
	CodeMirror.save();
	var html = converter.makeHtml(document.getElementById("text-area").value);
	var showMarkdown = document.getElementById("show-markdown");
	showMarkdown.innerHTML = html;
});

function insertTextAtCursor() {
	var editor = myCodeMirror;
	var text = "![hello](http://upload-images.jianshu.io/upload_images/1815061-c5d849dad48d4f72.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240 =100x80)";
    var doc = editor.getDoc();
    var cursor = doc.getCursor();
    doc.replaceRange(text, cursor);
}

function test() {
	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": "http://localhost:8080/api/test.md",
	  "method": "GET",
	  "dataType": "text",
	  "headers": {
	    "cache-control": "no-cache"
	  },
	  "processData": false,
	  "contentType": false,
	  "mimeType": "multipart/form-data"
	}

	$.ajax(settings).done(function (response) {
	  	var html = converter.makeHtml(response);
		var showMarkdown = document.getElementById("show-markdown");
		showMarkdown.innerHTML = html;
	});
}


//  var editor = CodeMirror.fromTextArea(document.getElementById("text-area"), {
//    lineNumbers: true,
//    styleActiveLine: true,
//    matchBrackets: true
//  });
//  var input = document.getElementById("select");
//  function selectTheme() {
//    var theme = input.options[input.selectedIndex].textContent;
//    editor.setOption("theme", theme);
//    location.hash = "#" + theme;
//  }
//  var choice = (location.hash && location.hash.slice(1)) ||
//               (document.location.search &&
//                decodeURIComponent(document.location.search.slice(1)));
//  if (choice) {
//    input.value = choice;
//    editor.setOption("theme", choice);
//  }
//  CodeMirror.on(window, "hashchange", function() {
//    var theme = location.hash.slice(1);
//    if (theme) { input.value = theme; selectTheme(); }
//  });
