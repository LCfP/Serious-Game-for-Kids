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
}
