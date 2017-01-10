/**
 * markdown转换对象 https://github.com/showdownjs/showdown
 */
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

/**
 * codemirror编辑器对象 http://codemirror.net/doc/manual.html
 */
var myCodeMirror = CodeMirror.fromTextArea(document.getElementById("text-area"), {
    lineNumbers: true,   //显示行号
	mode:  "markdown",
	lineWrapping: true  //自动换行
})

myCodeMirror.on("change", function(CodeMirror, changeObj){
	CodeMirror.save();
	var html = converter.makeHtml(document.getElementById("text-area").value);
	var showMarkdown = document.getElementById("show-markdown");
	showMarkdown.innerHTML = html;
});

/**
 * 插入图片
 * @returns
 */
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

/** 
 * 提供文件下载函数 
 * @return
 */
function fake_click(obj) {
    var ev = document.createEvent("MouseEvents");
    ev.initMouseEvent(
        "click", true, false, window, 0, 0, 0, 0, 0
        , false, false, false, false, 0, null
        );
    obj.dispatchEvent(ev);
}

/**
 * 提供markdown文件下载
 * @returns
 */
function getMD() {
	myCodeMirror.save();
	var name = "yours.md";
	var data = document.getElementById("text-area").value
    var urlObject = window.URL || window.webkitURL || window;

    var export_blob = new Blob([data]);

    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
    save_link.href = urlObject.createObjectURL(export_blob);
    save_link.download = name;
    fake_click(save_link);
}

/**
 * 提供html下载
 * @returns
 */
function getHtml() {
	myCodeMirror.save();
	var name = "yours.html";
	var data =  converter.makeHtml(document.getElementById("text-area").value);
    var urlObject = window.URL || window.webkitURL || window;

    var export_blob = new Blob([data]);

    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
    save_link.href = urlObject.createObjectURL(export_blob);
    save_link.download = name;
    fake_click(save_link);
}

/**
 * 使用全角符号换行
 * @returns
 */
function indent() {
	var editor = myCodeMirror;
	var text = "　　";
    var doc = editor.getDoc();
    var cursor = doc.getCursor();
    doc.replaceRange(text, cursor);
}

