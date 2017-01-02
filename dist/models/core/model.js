"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Maintains a `model` field, that represents the current game state.
 */
var Model = function () {
    function Model() {
        _classCallCheck(this, Model);

        this.model = {};

        // factory orders
        this.model.orders = [];

        // current customers
        this.model.customers = [];

        // events happened in the past
        this.model.history = [];

        this._load();
    }

    /**
     * Callback for the initial configuration set-up
     *
     * @abstract
     */


    _createClass(Model, [{
        key: "setupCallback",
        value: function setupCallback() {
            throw new Error("Not implemented by parent class");
        }

        /**
         * Turns this Model into the global GAME.model
         */

    }, {
        key: "toObject",
        value: function toObject() {
            GAME.model = this.model;
        }

        /**
         * Loads the model from the server-side files.
         *
         * @private
         */

    }, {
        key: "_load",
        value: function _load() {
            var _this = this;

            // async AJAX calls to get these JSON files
            // order for $.when: data, textStatus, jqXHR
            $.when($.getJSON("src/assets/config.json"), $.getJSON("src/assets/products.json")).done(function (config, products) {
                _this.model.config = config[0];
                _this.model.products = products[0];

                // toastr settings, from the config
                toastr.options = _this.model.config.toastr;

                $.when(_this._getLang()).done(function (lang) {
                    _this.model.lang = lang;

                    try {
                        _this.setupCallback();
                    } catch (e) {
                        // most likely due to an unimplemented callback.
                    }
                });
            });
        }

        /**
         * Retrieves the language file from the cookie settings. If none found, defaults to "en".
         *
         * @private
         */

    }, {
        key: "_getLang",
        value: function _getLang() {
            var langIso = (Cookies.get("lang") || "").toLowerCase();

            // only if we support this language ISO
            if (langIso != "en" && this.model.config.languages.map(function (lang) {
                return lang.iso;
            }).includes(langIso)) {
                this.model.config.language = langIso;
                this.model.config.languages = this.model.config.languages.map(function (lang) {
                    lang.active = lang.iso == langIso;
                    return lang;
                });

                return $.getJSON("src/assets/language/" + langIso + ".json");
            } else {
                // default EN
                this.model.config.language = "en";
                return {};
            }
        }
    }]);

    return Model;
}();