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
     * Translates text into the required language, as per MODEL.config.language.
     *
     * @param {string} text - The string to be translated.
     * @returns {string} translation - The translated string.
     */
    static l(text)
    {
        if (MODEL.config.language == "en") {
            return text;
        }

        return MODEL.lang[text] || text;
    }

    /**
     * @param {string} loc - The template location, relative to the base url.
     * @param {string} anchor - The jQuery locator to attach the template to.
     * @param {object} data - The data to populate the template.
     * @param {boolean} append=false - Append (true) or replace (false) values in the anchor?
     *
     * @protected
     */
    _loadTemplate(loc, anchor, data, append = false, prepend = false)
    {
        // translation function
        data.l = function ()
        {
            return function (text, render)
            {
                return Controller.l(render(text));
            }
        };

        // TODO perhaps memoize these views?
        return $.get(
            loc,
            function (view)
            {
                var template = Mustache.render(view, data);

                if (append) {
                    $(anchor).append(template);
                } else if (prepend) {
                    $(anchor).prepend(template);
                } else {
                    $(anchor).html(template);
                }
            }
        );
    }

    /**
     * Updates the current amount of money.
     *
     * NOTE: Amount is added to MODEL.config.money, so input negative to subtract!
     *
     * @param {float} amount - the amount to be added to the current amount of money
     *
     * @protected
     */
    _updateMoney(amount)
    {
        MODEL.config.money = MODEL.config.money + parseFloat(amount);

        $("#money").html(MODEL.config.money);
    }
}
