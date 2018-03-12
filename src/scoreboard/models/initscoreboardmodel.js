import Model from './model';

import {initScoreboard} from '../main';

export default class InitScoreboardModel extends Model
{
    /**
     * @override
     */
    setupCallback()
    {
        this.toObject();

        // callback for when the MODEL exists in the window
        initScoreboard();
    }
}
