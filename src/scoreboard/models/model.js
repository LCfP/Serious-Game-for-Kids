import Cookies from 'js-cookie';
import toastr from 'toastr';


/**
 * Maintains a `model` field, that represents the current game state.
 */
export default class Model
{
    constructor()
    {
        this.model = {};

        this._load();
    }

    /**
     * Callback for the initial configuration set-up
     *
     * @abstract
     */
    setupCallback()
    {
        throw new Error("Not implemented by parent class");
    }

    /**
     * Turns this Model into the global GAME.model
     */
    toObject()
    {
        GAME.model = this.model;
    }

    /**
     * Loads the model from the server-side files.
     *
     * @private
     */
    _load()
    {
        // async AJAX calls to get these JSON files
        // order for $.when: data, textStatus, jqXHR
        $.getJSON("src/assets/config.json").done((config) => {

            this.model.config = config;

            $.when(this._getLang()).done(
                (lang) => {
                    this.model.lang = lang;

                    try {
                        this.setupCallback();
                    } catch (e) {
                        // most likely due to an unimplemented callback.
                    }
                }
            );

        });
    }

    /**
     * Retrieves the language file from the cookie settings. If none found, defaults to "en".
     *
     * @private
     */
    _getLang()
    {
        const langIso = (Cookies.get("lang") || "nl").toLowerCase();

        // only if we support this language ISO
        if (this.model.config.languages.map(lang => lang.iso).includes(langIso)) {
            this.model.config.language = langIso;
            this.model.config.languages = this.model.config.languages.map(
                (lang) => {
                    lang.active = lang.iso == langIso;
                    return lang;
                }
            );

            return langIso == "en" ? {} : $.getJSON("src/assets/language/" + langIso + ".json");
        }
    }
}
