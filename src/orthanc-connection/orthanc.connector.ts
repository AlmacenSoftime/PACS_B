import axios from 'axios';
import { cacheWapper } from './cacheWapper';

import { StudyModel } from './models';
import { ORTHANC_MAPPING_INFO } from './mapping-info';
import { logger } from '../loggin-service';
import { SERIES_ORTHANC_MAPPING_INFO } from './series-mapping-info';

export class OrthancConnector {

    private readonly _orthancServerUrl: string;
    private static readonly _cache: cacheWapper = new cacheWapper();

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

                const PatientMainDicomTagsKeys = Object.keys(study.PatientMainDicomTags);
                // recorro los datos del paciente y lo extraigo al objeto
                for (const patientTag of PatientMainDicomTagsKeys) {
                    // informacion del tag del DICOM
                    const tagData = study.PatientMainDicomTags[patientTag];
                    // informacion customizada para el mapeo dentro de la API
                    const mappingData = ORTHANC_MAPPING_INFO[patientTag];

                    // Creo la key en el objeto a devolver
                    studyObject[mappingData?.mappedName || tagData.Name] = this.getValue(tagData.Value, mappingData?.type);
                }

                const DICOMTagsKeys = Object.keys(study.MainDicomTags);
                // recorro los datos del estudio y lo extraigo al objeto
                for (const DICOMTag of DICOMTagsKeys) {
                    // informacion del tag del DICOM
                    const tagData = study.MainDicomTags[DICOMTag];
                    // informacion customizada para el mapeo dentro de la API
                    const mappingData = ORTHANC_MAPPING_INFO[DICOMTag];

                    // Creo la key en el objeto a devolver
                    studyObject[mappingData?.mappedName || tagData.Name] = this.getValue(tagData.Value, mappingData?.type);
                }

                // obtengo datos de la primera serie y agrego los tags al objeto principal
                const firstSerieID = study.Series[0];

                if (firstSerieID) {
                    const convertedData = {};
                    // busco en el cache antes de hacer la peticion
                    const chachedData = await OrthancConnector._cache.get(firstSerieID);

                    if (!chachedData) {

                        const firstSerieResponse = await axios.get(`${this._orthancServerUrl}/series/${firstSerieID}/instances-tags`);

                        const firstSerieData = firstSerieResponse.data;
                        const uniqueKey = Object.keys(firstSerieData)[0];
                        const serieData = firstSerieData[uniqueKey];

                        const seriesDataKeys = Object.keys(serieData);

                        for (const key of seriesDataKeys) {
                            // informacion del tag del DICOM
                            const tagData = serieData[key];
                            // informacion customizada para el mapeo dentro de la API
                            const seriesMappingData = SERIES_ORTHANC_MAPPING_INFO[key];

                            if (seriesMappingData) {
                                // Creo la key en el objeto a devolver
                                convertedData[seriesMappingData?.mappedName || tagData.Name] = this.getValue(tagData.Value, seriesMappingData?.type);
                            }
                        }

                        await OrthancConnector._cache.set(firstSerieID, convertedData);
                        Object.assign(studyObject, convertedData);
                    }
                    // si ya esta en el cache lo agrego al objeto
                    else {
                        Object.assign(studyObject, chachedData);
                    }
                }

                // guardo el resto de la data relevante
                studyObject['ID'] = study.ID;
                //studyObject['Series'] = study.Series;
                studyObject['Tipo'] = study.Type;

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

    private getValue(value: string, type: string): any {
        if (!value) return null;

        switch (type) {
            case 'Date':
                if (value?.length == 8) {
                    const year = value.slice(0, 4);
                    const month = value.slice(4, 6);
                    const day = value.slice(6);
                    //return `${day}/${month}/${year}`;
                    return new Date(+year, +month - 1, +day);
                }
                else '';
                break;
            case 'Time':
                if (value?.length == 13) {
                    const hour = value.slice(0, 2);
                    const min = value.slice(2, 4);
                    const sec = value.slice(4, 6);
                    return `${hour}:${min}:${sec}`;
                }
                if (value?.length == 4) {
                    const hour = value.slice(0, 2);
                    const min = value.slice(2, 4);
                    return `${hour}:${min}`;
                }
                return '';
            default:
            case 'String':
                return value;
        }

    }
}


