import rawdata from '../../mock-data.json';

export class DataController {

    public readonly getListData = async (request, response) => {
        response.status(200).json(await Promise.resolve(rawdata));
    }
}
