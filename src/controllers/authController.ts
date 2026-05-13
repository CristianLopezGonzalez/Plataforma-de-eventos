import { AuthService } from "../services/authService";
import { Request, Response } from "express";
import { HttpResponse } from "../middlewares/htttpResponse";
import { ChangePasswordRequest, LoginCredentials, RegisterCredentials } from "../types/authTypes";
export class AuthController {
    private authService: AuthService;
    private httpResponse: HttpResponse;

    constructor() {
        this.authService = new AuthService();
        this.httpResponse = new HttpResponse();

        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
    }

    login = async (req: Request<{},{}, LoginCredentials>, res: Response) => {
        try {
            const { email, password } = req.body;
            const credentials: LoginCredentials = { email, password };
            const result = await this.authService.login(credentials);
            return this.httpResponse.OK(res, 'Login exitoso', result);

        } catch (error) {
            console.log("Error en login", error);
            return this.httpResponse.INTERNAL_SERVER_ERROR(res, 'Error interno del servidor');
        }
    }

    register = async (req: Request<{},{}, RegisterCredentials>, res: Response) => {
        try {
            const { email, password, firstName, lastName } = req.body;
            const credentials: RegisterCredentials = { email, password, firstName, lastName };
            const result = await this.authService.register(credentials);
            return this.httpResponse.CREATED(res, 'Registro exitoso', result);
        } catch (error) {
            console.log("Error en registro", error);
            return this.httpResponse.INTERNAL_SERVER_ERROR(res, 'Error interno del servidor');
        }
    }

    refreshToken = async (req: Request<{},{}, { token: string }>, res: Response) => {
        try {

            const { token } = req.body;

            if (!token) {
                return this.httpResponse.BAD_REQUEST(res, 'Token es requerido');
            }

            const result = await this.authService.refreshToken(token);
            return this.httpResponse.OK(res, 'Token refrescado exitosamente', result);

        }catch (error) {
            console.log("Error en refreshToken", error);
            return this.httpResponse.INTERNAL_SERVER_ERROR(res, 'Error interno del servidor');
        }
    }

    changePassword = async (req: Request<{}, {}, ChangePasswordRequest>, res: Response) => {
        try {

            const { email, oldPassword, newPassword } = req.body;

            if (!email || !oldPassword || !newPassword) {
                return this.httpResponse.BAD_REQUEST(res, 'Email, contraseña actual y nueva contraseña son requeridos');
            }

            await this.authService.changePassword(email, newPassword, oldPassword);
            return this.httpResponse.OK(res, 'Contraseña cambiada exitosamente');

        } catch (error) {
            console.log("Error en changePassword", error);
            return this.httpResponse.INTERNAL_SERVER_ERROR(res, 'Error interno del servidor');
        }
    }
}