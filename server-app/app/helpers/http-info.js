(function () {

    var HttpInfo = function (req) {
        this.req = req;
    };


    HttpInfo.prototype = {
        /**
         * Get the method of the request
         * @return {string} method
         */
        getHttpMethod: function () {
            if (this.req.query.method) {
                return this.req.query.method.toUpperCase();
            } else {
                return this.req.method.toUpperCase();
            }
        },

        /**
         * Get the full path of a requested file
         * @return {string}     full path
         */
        getFullPath: function () {
            // delete first '/' if exists and all the string after a '?'
            var resource = this.req.url.replace(/^\//, '').replace(/[\?].*/, '');
            return resource.length > 0 ? resource : null;
        },
        
        /**
         * get the name of the resource
         * @returns {String} name of the resource or null
         */
        getResourceName: function() {
            var matcher = this.req.url.match(/^\/([\w-]*)/);
            if (matcher) {
                return matcher[1];
            }
            return null;
        }

    };

    module.exports = HttpInfo;

})();