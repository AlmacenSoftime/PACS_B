import { Request, Response } from "express";

import { ORTHANC_MAPPING_INFO, OrthancConnector } from "../../orthanc-connection";

const ACCESSION_NUMBER_KEY = "0008,0050";
const STUDY_UID_KEY = "0020,000d";

export class StudiesIdentificationController {

    private DICOMConnector: OrthancConnector;

    constructor() { this.DICOMConnector = new OrthancConnector(); }


    public readonly get = async (request: Request, response: Response): Promise<void> => {
        try {
            const requestAccessionNumber = request.params?.accessionNumber;

            if (!requestAccessionNumber) { response.status(400).json({ message: "accession number required" }); return; }

            const accNumberKey = ORTHANC_MAPPING_INFO[ACCESSION_NUMBER_KEY];
            const studyUIDKey = ORTHANC_MAPPING_INFO[STUDY_UID_KEY];

            const dataEstudio = (await this.DICOMConnector.getStudies()).find(x => x[accNumberKey.mappedName || accNumberKey.name] === requestAccessionNumber);

            if (!dataEstudio) { response.status(404).json(null); return; }

            response.status(200).json({ ID: dataEstudio['ID'], studyUID: dataEstudio[studyUIDKey.mappedName || studyUIDKey.name] });

        } catch (error) {
            response.status(500).json(error);
        }

    }
}