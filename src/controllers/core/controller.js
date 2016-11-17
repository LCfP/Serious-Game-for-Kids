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
    static registerEvent()
    {
        throw new Error("Needs to be implemented by subclasses!");
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
