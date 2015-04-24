(function () {
    'use strict';


    var https = require('https');



    var Facebook = function (options) {
        this.options = require('extend')({
            appId: null,
            secret: null
        }, options);
    };

    Facebook.prototype = {
        buildConnectUrl: function (state, redirection, permissions) {
            return 'https://www.facebook.com/dialog/oauth?' + this.buildGetParameters({
                client_id: this.options.appId,
                response_type: 'code',
                redirect_uri: redirection,
                state: state,
                scope: permissions.join(',')
            });
        },
        buildGetParameters: function (data) {
            var parameters = [];
            for (var key in data) {
                parameters.push(key + '=' + encodeURIComponent(data[key]));
            }
            return parameters.join('&');
        },
        httpsGet: function (hostname, path, data) {
            var defered = q.defer();
            var req = https.request({
                method: 'GET',
                hostname: hostname,
                path: path + '?' + this.buildGetParameters(data),
                port: '443'
            }, function (response) {
                var str = '';
                response.on('data', function (chunk) {
                    str += chunk;
                });
                response.on('end', function () {
                    defered.resolve(JSON.parse(str));
                });
            });
            req.end();
            req.on('error', function (e) {
                defered.reject(e);
            });
            return defered.promise;
        },

        //https://graph.facebook.com/v2.3/me?access_token=CAAMusE2O8IsBALyxxzPAr5ppYU6GKhCWkcrrNKfwfo6ZAlSxasKGFl7ggLqPZCxE4Rx0Lc1aEfjPD80GmyEafEIpVxQytdEOL4ZAKy5f9tAqoQZBn3jXzirbWgjwucg5ZBIrOaBUPtsu6uomZAzqVH9Hxl3utZB4vNI8gOs0uQtaGGiH80mXuzITNMmjF2GRbH8ySK7GZBP3Y2C3eAGzPeT3
        /*{
id: "10153247137973147",
first_name: "Cyrille",
gender: "male",
last_name: "Meichel",
link: "https://www.facebook.com/app_scoped_user_id/10153247137973147/",
locale: "fr_FR",
name: "Cyrille Meichel",
timezone: 2,
updated_time: "2015-04-20T16:26:00+0000",
verified: true
}*/
        requestAccessToken: function (code, redirection) {
            return this.httpsGet('graph.facebook.com', '/v2.3/oauth/access_token', {
                client_id: this.options.appId,
                redirect_uri: redirection,
                client_secret: this.options.secret,
                code: code
            });
        },
        requestUserInformation: function(access_token) {
            return this.httpsGet('graph.facebook.com', '/v2.3/me', {
                access_token: access_token
            });
        },
        generateCsrfToken: function () {
            var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var buf = [];
            for (var i = 0; i < 32; i++) {
                buf.push(chars[Math.floor(chars.length * Math.random())]);
            }
            return buf.join('');
        }
    };

    module.exports = Facebook;
})();