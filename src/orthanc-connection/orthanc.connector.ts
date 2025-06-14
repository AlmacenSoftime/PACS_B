import axios from 'axios';
import { cacheWapper } from './cacheWapper';

import { StudyModel } from './models';
import { ORTHANC_MAPPING_INFO } from './mapping-info';
import { logger } from '../loggin-service';
import { SERIES_ORTHANC_MAPPING_INFO } from './series-mapping-info';

export class OrthancConnector {

    private readonly _orthancServerUrl: string;
    private static readonly _cache: cacheWapper = new cacheWapper();

    private readonly _username: string;
    private readonly _password: string;

    constructor() {
        this._orthancServerUrl = process.env.ORTHANC_BASE_URL;
        this._username = process.env.ORTHANC_USERNAME;
        this._password = process.env.ORTHANC_PASSWORD;
        logger.info(`inicializando conector de ORTHANC. URL: ${this._orthancServerUrl}`);
    }

    public async getStudies() {
        try {
            const authorizationHeader = { 
                headers: { 
                    'Authorization': `Basic ${Buffer.from(`${this._username}:${this._password}`).toString('base64')}`,
                    'Accept-Encoding': 'gzip' // Habilitar compresión
                },
                timeout: 30000 // Timeout de 30 segundos
            }
            
            const RESPONSE = await axios.get<StudyModel[]>(
                `${this._orthancServerUrl}/studies?expand=true&full=true`, 
                authorizationHeader
            );

            if (RESPONSE.status === 200) {
                const RAW_STUDIES_DATA = RESPONSE.data;
                const convertedData: Array<unknown> = [];

                // Procesar en paralelo con Promise.all pero limitando concurrencia
                const BATCH_SIZE = 10; // Procesar de a 10 estudios por vez
                
                for (let i = 0; i < RAW_STUDIES_DATA.length; i += BATCH_SIZE) {
                    const batch = RAW_STUDIES_DATA.slice(i, i + BATCH_SIZE);
                    
                    const batchPromises = batch.map(async (study) => {
                        return this.processStudy(study, authorizationHeader);
                    });
                    
                    const batchResults = await Promise.all(batchPromises);
                    convertedData.push(...batchResults);
                }

                return convertedData;
            }
            else {
                const errorMessage = `Error en Orthanc connector. Respuesta del servidor DICOM: ${RESPONSE.status} - ${RESPONSE.statusText} | ${JSON.stringify(RESPONSE.data)}`;
                logger.warn(errorMessage);
                console.error(errorMessage);
                throw Error(errorMessage);
            }
        }
        catch (error) {
            logger.error(`Error en Orthanc connector. ${error}`);
            console.error(`Error en Orthanc connector. ${error}`);
            throw error;
        }
    }

     private async processStudy(study: StudyModel, authorizationHeader: any): Promise<any> {
        const studyObject: { [key: string]: unknown } = {};

        // Procesar tags del paciente
        const PatientMainDicomTagsKeys = Object.keys(study.PatientMainDicomTags);
        for (const patientTag of PatientMainDicomTagsKeys) {
            const tagData = study.PatientMainDicomTags[patientTag];
            const mappingData = ORTHANC_MAPPING_INFO[patientTag];
            studyObject[mappingData?.mappedName || tagData.Name] = this.getValue(tagData.Value, mappingData?.type);
        }

        // Procesar tags del estudio
        const DICOMTagsKeys = Object.keys(study.MainDicomTags);
        for (const DICOMTag of DICOMTagsKeys) {
            const tagData = study.MainDicomTags[DICOMTag];
            const mappingData = ORTHANC_MAPPING_INFO[DICOMTag];
            studyObject[mappingData?.mappedName || tagData.Name] = this.getValue(tagData.Value, mappingData?.type);
        }

        // Procesar primera serie con cache mejorado
        const firstSerieID = study.Series[0];
        if (firstSerieID) {
            const seriesData = await this.getSeriesDataWithCache(firstSerieID, authorizationHeader);
            Object.assign(studyObject, seriesData);
        }

        studyObject['ID'] = study.ID;
        studyObject['Tipo'] = study.Type;

        return studyObject;
    }

    private async getSeriesDataWithCache(serieID: string, authorizationHeader: any): Promise<any> {
        const cachedData = await OrthancConnector._cache.get(serieID);
        
        if (cachedData) {
            return cachedData;
        }

        try {
            const firstSerieResponse = await axios.get(
                `${this._orthancServerUrl}/series/${serieID}/instances-tags`, 
                { ...authorizationHeader, timeout: 10000 }
            );

            const convertedData = this.processSeriesData(firstSerieResponse.data);
            await OrthancConnector._cache.set(serieID, convertedData);
            return convertedData;
        } catch (error) {
            logger.warn(`Error obteniendo serie ${serieID}: ${error.message}`);
            return {}; // Retornar objeto vacío en caso de error
        }
    }

    private processSeriesData(seriesResponseData: any): any {
        const convertedData = {};
        const uniqueKey = Object.keys(seriesResponseData)[0];
        const serieData = seriesResponseData[uniqueKey];
        const seriesDataKeys = Object.keys(serieData);

        for (const key of seriesDataKeys) {
            const tagData = serieData[key];
            const seriesMappingData = SERIES_ORTHANC_MAPPING_INFO[key];

            if (seriesMappingData) {
                convertedData[seriesMappingData?.mappedName || tagData.Name] = 
                    this.getValue(tagData.Value, seriesMappingData?.type);
            }
        }

        return convertedData;
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


