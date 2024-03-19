import rawdata from '../../mock-data.json';

/**
 * @description controlador para manejar datos de la grilla principal
 * @export
 * @class DataController
 */
export class DataController {

    /**
     * getListData
     */
    public getListData() {
        return Promise.resolve(rawdata);
    }

}