
/**
 * @description controlador para temas de autenticacion
 * @export
 * @class AuthenticationController
 */
export class AuthenticationController {


    /**
     * @description
     * @param {LoginRequest} loginRequest
     * @return {*}  {(Promise<User | null>)}
     * @memberof AuthenticationController
     */
    public async login(loginRequest: LoginRequest): Promise<User | null> {
        // TODO: arreglar y llamar a la base/api o lo que sea
        if (loginRequest.password === "admin") {
            return Promise.resolve(MOCK_USER);
        }
        return Promise.reject(null);
    }
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    id: number | string;
    fullName: string;
    roles: string[],
    profiles: string[]
}

// TODO: Usuario MOCK. Eliminar cuando se aplique la obtencion del usuario
const MOCK_USER: User = {
    id: 1,
    fullName: 'USUARIO DE PRUEBAS',
    roles: ['DOCTOR'],
    profiles: ['ADMIN']
}