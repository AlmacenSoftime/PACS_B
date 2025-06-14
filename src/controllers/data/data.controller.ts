import { Request, Response } from "express";

import { OrthancConnector } from "../../orthanc-connection";
import { createConnection } from "../../db-connection/DbConnection";
import { EstudioInforme } from "../../db-connection/models";

export class DataController {
    private DICOMConnector: OrthancConnector;
    private static studiesCache: any[] = null;
    private static lastCacheUpdate: number = 0;
    private static readonly CACHE_TTL = 2 * 60 * 1000; // 2 minutos

    constructor() { this.DICOMConnector = new OrthancConnector(); }

    public readonly getListData = async (request: Request, response: Response): Promise<void> => {
        try {
            // Cache de estudios completo
            let estudios = await this.getCachedStudies();

            if (!estudios) {
                estudios = await this.DICOMConnector.getStudies();
                this.setCachedStudies(estudios);
            }

            // Obtener todos los study IDs
            const studyIds = estudios.map(estudio => estudio['ID']);

            // Obtener todos los informes en una sola consulta con JOIN optimizado
            const dbConn = await createConnection();
            const informesData = await dbConn
                .getRepository(EstudioInforme)
                .createQueryBuilder('ei')
                .leftJoinAndSelect('ei.UsuarioCierre', 'uc')
                .select([
                    'ei.EstudioId',
                    'ei.Estado',
                    'ei.MedicoInformante',
                    'uc.nombreApellido'
                ])
                .where('ei.EstudioId IN (:...ids)', { ids: studyIds })
                .getMany();

            // Crear un mapa para acceso O(1)
            const informesMap = new Map();
            informesData.forEach(informe => {
                informesMap.set(informe.EstudioId, {
                    Estado: informe.Estado,
                    MedicoInformante: informe.MedicoInformante || informe.UsuarioCierre?.nombreApellido
                });
            });

            // Combinar datos sin hacer consultas adicionales
            const estudiosConInformes = estudios.map(estudio => {
                const id = estudio['ID'];
                const informeData = informesMap.get(id);

                return {
                    ...estudio,
                    'Estado': informeData?.Estado || 'COMPLETO',
                    'Medico Informante': informeData?.MedicoInformante
                };
            });

            response.status(200).json(estudiosConInformes);

        } catch (error) {
            response.status(500).json(error);
        }
    }

    private async getCachedStudies(): Promise<any[] | null> {
        const now = Date.now();
        if (DataController.studiesCache && (now - DataController.lastCacheUpdate) < DataController.CACHE_TTL) {
            return DataController.studiesCache;
        }
        return null;
    }

    private setCachedStudies(studies: any[]): void {
        DataController.studiesCache = studies;
        DataController.lastCacheUpdate = Date.now();
    }

    // Endpoint para invalidar cache manualmente si es necesario
    public readonly invalidateCache = async (request: Request, response: Response): Promise<void> => {
        DataController.studiesCache = null;
        DataController.lastCacheUpdate = 0;
        response.status(200).json({ message: 'Cache invalidated' });
    }
}