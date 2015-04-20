(function () {
    'use strict';

    var fs = require('fs');

    var ucFirst = function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    var registerGetter = function (_self, getterName) {
        return function (name) {
            if (name) {
                return _self['_' + getterName][name];
            } else {
                return Object.keys(_self['_' + getterName]);
            }
        };
    };

    var Dao = function (options) {
        var _self = this;
        this.options = require('extend')({
            query: {
                path: null,
                pattern: null
            },
            model: {
                path: null,
                pattern: null
            },
            database: null,
            logger: console,
            config: null
        }, options);
        this.database = this.options.database;

        // load the elements
        var registered = [];
        for (var key in this.options) {
            switch (key) {
                /* falls through */
            case 'logger':
                /* falls through */
            case 'database':
                /* falls through */
            case 'config':
                break;
            default:
                var elementName = ucFirst(key);
                this.options.logger.log(' |- Loading ' + elementName);
                this['_' + key] = this._load(this.options[key]);
                registered.push(ucFirst(key));
                this[elementName] = registerGetter(_self, key);
                break;
            }
        }

        // Link the elements
        this.options.logger.log(' |- Linking ' + registered.join(', '));
        for (var n in registered) {
            this._link(registered[n], registered);
        }

    };

    Dao.prototype = {
        /**
         * Load queries or objects
         * @param   {Object}   option [[Description]]
         * @returns {[[Type]]} [[Description]]
         */
        _load: function (option) {
            var result = {};
            if (option.path) {
                var files = fs.readdirSync(option.path);
                for (var i in files) {
                    if ((option.pattern) && (files[i].match(option.pattern))) {
                        var matcher = files[i].match(/[a-z0-9]*/);
                        if (matcher) {
                            this.options.logger.log(' |---- Loading ' + files[i] + ' as ' + matcher[0]);
                            result[matcher[0]] = require(option.path + '/' + files[i])({
                                database: this.database,
                                config: this.options.config,
                                name: matcher[0]
                            });
                        }
                    }
                }
            }
            return result;
        },

        _link: function (eltType, allTypes) {
            var objNames = this[eltType]();
            for (var i in objNames) {
                for (var j in allTypes) {
                    if (this[ucFirst(allTypes[j])](objNames[i]).prototype['_set' + eltType]) {
                        this.options.logger.log(' |---- this.' + ucFirst(allTypes[j]) + '(' + objNames[i] + ').prototype._set' + eltType + '(this.' + eltType + '(' + objNames[i] + '))');
                        this[ucFirst(allTypes[j])](objNames[i]).prototype['_set' + eltType](this[eltType](objNames[i]));
                    }
                }
            }

        }
    };

    // Export the module
    module.exports = Dao;
})();