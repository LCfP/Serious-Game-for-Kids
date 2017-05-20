import Model from './core/model';

import Storage from './classes/storage';
import Factory from './classes/factory';
import Container from './classes/container';

import {initGame} from '../main';


export default class InitGameModel extends Model
{
    /**
     * @override
     */
    setupCallback()
    {
        const availableProducts = this.model.base.products.filter(product => {
            return product.level == 0;
        });

        this.model.warehouse = new Storage("Warehouse", this.model.config.warehouseCapacity);
        this.model.factory = new Factory("Factory", availableProducts);

        for (let i = 0; i < this.model.config.warehouseContainers; i++) {
            this.model.warehouse.addItem(
                new Container("Rack", this.model.config.containerCapacity)
            );
        }

        this.toObject();

        // callback for when the MODEL exists in the window
        initGame();
    }
}
