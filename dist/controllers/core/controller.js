"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Controller = function () {
    function Controller() {
        _classCallCheck(this, Controller);
    }

    _createClass(Controller, [{
        key: "view",

        /**
         * @abstract
         */
        value: function view() {
            throw new Error("Needs to be implemented by subclasses!");
        }

        /**
         * @abstract
         */

    }, {
        key: "registerEvent",
        value: function registerEvent() {
            throw new Error("Needs to be implemented by subclasses!");
        }

        /**
         * Translates text into the required language, as per GAME.model.config.language.
         *
         * @param {string} text - The string to be translated.
         * @returns {string} translation - The translated string.
         */

    }, {
        key: "_loadTemplate",


        /**
         * NOTE: if append and prepend both false, defaults to replace.
         *
         * @param {string} loc - The template location, relative to the base url.
         * @param {string} anchor - The jQuery locator to attach the template to.
         * @param {object} data - The data to populate the template.
         * @param {boolean} append=false - Append (true) values in the anchor?
         * @param {boolean} prepend=false - Prepend (true) values in the anchor?
         *
         * @protected
         */
        value: function _loadTemplate(loc, anchor, data) {
            var append = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
            var prepend = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

            var _prepData2 = this._prepData(anchor, data, append, prepend),
                _prepData3 = _slicedToArray(_prepData2, 2),
                data = _prepData3[0],
                callback = _prepData3[1];

            if (GAME.view.hasOwnProperty(loc)) {
                callback(GAME.view[loc]);

                // mimic the $.get object. Specifically the 'done' function is used to bind events.
                return {
                    done: function done(callback) {
                        return callback();
                    }
                };
            } else {
                return $.get(loc, function (view) {
                    if (!GAME.view.hasOwnProperty(loc)) {
                        GAME.view[loc] = view;
                    }

                    callback(view);
                });
            }
        }

        /**
         * @private
         */

    }, {
        key: "_prepData",
        value: function _prepData(anchor, data, append, prepend) {
            // translation function
            data.l = function () {
                return function (text, render) {
                    return Controller.l(render(text));
                };
            };

            var callback = function callback(view) {
                var template = Mustache.render(view, data);
                Mustache.parse(template);

                if (append) {
                    $(anchor).append(template);
                } else if (prepend) {
                    $(anchor).prepend(template);
                } else {
                    $(anchor).html(template);
                }
            };

            return [data, callback];
        }

        /**
         * Updates the current amount of money. Note that amount is added to GAME.model.config.money,
         * so input negative amount to subtract!
         *
         * @param {float} amount - the amount to be added to the current amount of money
         *
         * @protected
         */

    }, {
        key: "_updateMoney",
        value: function _updateMoney(amount) {
            GAME.model.config.money = GAME.model.config.money + parseFloat(amount);
            $("#money").html(GAME.model.config.money.toFixed(2));
        }
    }], [{
        key: "l",
        value: function l(text) {
            if (GAME.model.config.language == "en") {
                return text;
            }

            return GAME.model.lang[text] || text;
        }
    }]);

    return Controller;
}();