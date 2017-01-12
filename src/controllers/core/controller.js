class Controller
{
    /**
     * @abstract
     */
    view()
    {
        throw new Error("Needs to be implemented by subclasses!");
    }

    /**
     * @abstract
     */
    registerEvent()
    {
        throw new Error("Needs to be implemented by subclasses!");
    }

    /**
     * Translates text into the required language, as per GAME.model.config.language.
     *
     * @param {string} text - The string to be translated.
     * @returns {string} translation - The translated string.
     */
    static l(text)
    {
        if (GAME.model.config.language == "en") {
            return text;
        }

        return GAME.model.lang[text] || text;
    }

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
    _loadTemplate(loc, anchor, data, append = false, prepend = false)
    {
        var [data, callback] = this._prepData(anchor, data, append, prepend);

        if (GAME.view.hasOwnProperty(loc)) {
            callback(GAME.view[loc]);

            // mimic the $.get object. Specifically the 'done' function is used to bind events.
            return {
                done: function(callback) {
                    return callback();
                }
            };
        } else {
            return $.get(
                loc,
                function (view) {
                    if (!GAME.view.hasOwnProperty(loc)) {
                        GAME.view[loc] = view;
                    }

                    callback(view);
                }

            );
        }
    }

    /**
     * @private
     */
    _prepData(anchor, data, append, prepend)
    {
        // translation function
        data.l = function ()
        {
            return function (text, render)
            {
                return Controller.l(render(text));
            }
        };

        var callback = function (view)
        {
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
    _updateMoney(amount)
    {
        GAME.model.config.money = GAME.model.config.money + parseFloat(amount);
        $("#money").html(GAME.model.config.money.toFixed(2));
    }
}
