//var contextPath = "http://jiejia.jeocloud.com:8081/propertyBackend";
angular.module('services', [])
    .factory('apiService', function ($http) {
        var cache = new JcCache();
        var getMenu = function () {
            var req = {
                method: 'GET',
                url: "config/config.json",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            var promise = $http(req);
            return promise;
        }
        var getMarkdown = function (url) {
            var converter = new showdown.Converter();
            showdown.setFlavor('github');
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": url,
                "method": "GET",
                "dataType": "text",
                "headers": {
                    "cache-control": "no-cache"
                },
                "processData": false,
                "contentType": false,
                "mimeType": "multipart/form-data"
            }
            if (cache.isExist(url)) {
                var html = converter.makeHtml(cache.get(url));
                var showMarkdown = document.getElementById("show-markdown");
                showMarkdown.innerHTML = html;
            } else {
                $.ajax(settings).done(function (response) {
                    cache.set(url, response);
                    var html = converter.makeHtml(response);
                    var showMarkdown = document.getElementById("show-markdown");
                    showMarkdown.innerHTML = html;
                });
            }
        }
        return {
            getMenu: function () {
                return getMenu();
            },
            getMarkdown: function (url) {
                return getMarkdown(url);
            }
        }
    });
angular.module('api', ['services'])
    .config(['$locationProvider', function ($locationProvider) { $locationProvider.html5Mode(true); }])
    .controller('apiController', function ($scope, $location, apiService) {
        var menuList = [
            // { href: "/test1", name: "api1" },
            // { href: "/test2", name: "api2" },
            // { href: "/test3", name: "api3" }
        ]
        $scope.menuList = menuList;
        apiService.getMenu().then(function (data) {
            $scope.menuList = data.data.menuList;
            $scope.menuName = data.data.menuName;
            apiService.getMarkdown(data.data.mainContent);
        })
        $scope.getContent = function ($event, url) {
            $event.preventDefault();
            apiService.getMarkdown(url);
        }
    })