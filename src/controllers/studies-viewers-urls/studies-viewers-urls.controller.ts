import { Request, Response } from "express";
import { logger } from "../../loggin-service";
import { ORTHANC_MAPPING_INFO, OrthancConnector } from "../../orthanc-connection";

const ACCESSION_NUMBER_KEY = "0008,0050";
const STUDY_UID_KEY = "0020,000d";

export class StudiesViewersUrlsController {
    private DICOMConnector: OrthancConnector;

    constructor() { this.DICOMConnector = new OrthancConnector(); }

    /**
     * @description
     * @param {Request} request
     * @param {Response} response
     * @memberof StudiesViewersUrlsController
     */
    public readonly getStudiesViewersUrls = async (request: Request, response: Response): Promise<void> => {
        try {
            const requestAccessionNumber = request.params?.accessionNumber;

            if (!requestAccessionNumber) { response.status(400).json({ message: "accession number required" }); return; }

            const accNumberKey = ORTHANC_MAPPING_INFO[ACCESSION_NUMBER_KEY];
            const studyUIDKey = ORTHANC_MAPPING_INFO[STUDY_UID_KEY];

            const dataEstudio = (await this.DICOMConnector.getStudies()).find(x => x[accNumberKey.mappedName || accNumberKey.name] === requestAccessionNumber);

            if (!dataEstudio) { response.status(404).json(null); return; }

            const returnObj = {
                accessionNumber: requestAccessionNumber,
                ohif: `${process.env.VIEWER_FRONTEND_URL}/${process.env.OHIF_VIEWER.replace("{id}", dataEstudio['ID'])}`,
                stone: `${process.env.VIEWER_FRONTEND_URL}/${process.env.STONE_VIEWER.replace("{id}", dataEstudio[studyUIDKey.mappedName || studyUIDKey.name])}`,

            }

            response.status(200).json(returnObj);

        } catch (error) {
            logger.error(`${request.url} - Error inesperado: ${JSON.stringify(error)}`);
            response.status(500).json({ result: false });

        }
    }
}