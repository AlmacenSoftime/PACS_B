import { Request, Response } from "express";
import { logger } from "../../loggin-service";

export class StudiesViewersUrlsController {
    /**
     * @description
     * @param {Request} request
     * @param {Response} response
     * @memberof StudiesViewersUrlsController
     */
    public readonly getStudiesViewersUrls = async (request: Request, response: Response): Promise<void> => {
        try {
            const requestAccessionNumber = request.params?.accessionNumber;

            const returnObj = {
                accessionNumber: requestAccessionNumber,
                ohif: `${process.env.VIEWER_FRONTEND_URL}/${process.env.OHIF_VIEWER.replace("{id}", requestAccessionNumber)}`,
                stone: `${process.env.VIEWER_FRONTEND_URL}/${process.env.STONE_VIEWER.replace("{id}", requestAccessionNumber)}`,

            }

            response.status(200).json(returnObj);

        } catch (error) {
            logger.error(`${request.url} - Error inesperado: ${JSON.stringify(error)}`);
            response.status(500).json({ result: false });

        }
    }
}