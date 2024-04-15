import axios from 'axios';
import { StudyModel } from './models';
import { ORTHANC_MAPPING_INFO } from './mapping-info';
import { logger } from '../loggin-service';

export class OrthancConnector {

    private readonly _orthancServerUrl: string;

    constructor() {
        this._orthancServerUrl = process.env.ORTHANC_BASE_URL;
        logger.info(`inicializando conector de ORTHANC. URL: ${this._orthancServerUrl}`);
    }

    public async getStudies() {
        const RESPONSE = await axios.get<StudyModel[]>(`${this._orthancServerUrl}/studies?expand=true&full=true`);

        if (RESPONSE.status === 200) {
            const RAW_STUDIES_DATA = RESPONSE.data;
            const convertedData: Array<unknown> = [];

            // recorro los estudios 
            for (const study of RAW_STUDIES_DATA) {

                const studyObject: { [key: string]: unknown } = {};

                // recorro los datos del paciente y lo extraigo al objeto
                for (const patientTag in study.PatientMainDicomTags) {
                    if (Object.prototype.hasOwnProperty.call(study.PatientMainDicomTags, patientTag)) {
                        // informacion del tag del DICOM
                        const tagData = study.PatientMainDicomTags[patientTag];
                        // informacion customizada para el mapeo dentro de la API
                        const mappingData = ORTHANC_MAPPING_INFO[patientTag];

                        // Creo la key en el objeto a devolver
                        studyObject[mappingData?.name ?? tagData.Name] = this.getValue(tagData.Value, tagData.Type);
                    }
                }

                // recorro los datos del estudio y lo extraigo al objeto
                for (const DICOMTag in study.MainDicomTags) {
                    if (Object.prototype.hasOwnProperty.call(study.MainDicomTags, DICOMTag)) {
                        // informacion del tag del DICOM
                        const tagData = study.MainDicomTags[DICOMTag];
                        // informacion customizada para el mapeo dentro de la API
                        const mappingData = ORTHANC_MAPPING_INFO[DICOMTag];

                        // Creo la key en el objeto a devolver
                        studyObject[mappingData?.name ?? tagData.Name] = this.getValue(tagData.Value, tagData.Type);
                    }
                }

                // guardo el resto de la data relevante
                studyObject['ID'] = study.ID;
                //studyObject['Series'] = study.Series;
                studyObject['Type'] = study.Type;

                // agrego el estudio transformado al array de estudios que se va a devolver

                convertedData.push(studyObject);
            }

            return convertedData;
        }
        else {
            const errorMessage = `Error en Orthanc connector. Respuesta del servidor DICOM: ${RESPONSE.status} - ${RESPONSE.statusText} | ${JSON.stringify(RESPONSE.data)}`;
            logger.warn(errorMessage);
            throw Error(errorMessage);
        }
    }

    private getValue(value, type) {
        if (!value) return null;
        // TODO:
        // ver los distintos casos
        switch (type) {
            default:
            case 'String':
                return value;
        }

    }

}
