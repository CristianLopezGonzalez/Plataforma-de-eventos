import { Request, Response, NextFunction } from "express";
import { HttpResponse } from "./htttpResponse";
import { AuthUtils } from "../utils/authUtils";
import { TokenPayload } from '../types/authTypes';

export class AuthMiddlewares {

    private httpResponse: HttpResponse;
    private authUtils: AuthUtils;

    constructor() {
        this.httpResponse = new HttpResponse();
        this.authUtils = new AuthUtils();

        this.authenticateToken = this.authenticateToken.bind(this);
    }

    authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const authHeader = req.headers['authorization'];

            const [bearer, token] = authHeader ? authHeader.split(' ') : [null, null];

            if (bearer !== 'Bearer' || !token) {
                return this.httpResponse.UNAUTHORIZED(res, 'Token no proporcionado');
            }

            const verifiedPayload = await this.authUtils.verifyToken(token);

            if (!verifiedPayload) {
                return this.httpResponse.UNAUTHORIZED(res, 'Token inválido');
            }

            req.user = verifiedPayload as TokenPayload;

            next();

        } catch (error) {
            console.log("Error en authenticateToken", error);
            return this.httpResponse.INTERNAL_SERVER_ERROR(res, 'Error interno del servidor');

        }
    }

    roleAuthorization = (requiredRoles: string[]) => {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const user = req.user as TokenPayload;

                if (!user) {
                    return this.httpResponse.UNAUTHORIZED(res, 'Usuario no autenticado');
                }
                if (!requiredRoles.includes(user.role)) {
                    return this.httpResponse.FORBIDDEN(res, 'Acceso denegado');
                }

                next();

            } catch (error) {
                console.log("Error en roleAuthorization", error);
                return this.httpResponse.INTERNAL_SERVER_ERROR(res, 'Error interno del servidor');
            }
        }

    }
}