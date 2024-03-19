
/**
 * @description controlador para temas de autenticacion
 * @export
 * @class AuthenticationController
 */
export class AuthenticationController {

    /**
     * @description methodo para hacer login
     * @param {LoginRequest} loginRequest
     * @return {*}  {Promise<boolean>}
     * @memberof AuthenticationController
     */
    public login(loginRequest: LoginRequest): Promise<boolean> {
        // TODO: arreglar y llamar a la base/api o lo que sea
        if (loginRequest.password === "admin") {
            return Promise.resolve(true);
        }

        return Promise.reject(false);
    }

}

export interface LoginRequest {
    email: string;
    password: string;
}