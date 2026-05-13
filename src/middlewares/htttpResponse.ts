import { HttpStatusCode } from "../types/httpTypes";
import { Response } from "express";

export class HttpResponse {
    OK(res: Response, message?: string, data?: any,) {
        return res.status(HttpStatusCode.OK).json({
            success: HttpStatusCode.OK,
            message: message || 'Operación exitosa',
            data: data
        });
    }

    CREATED(res: Response, message?: string, data?: any) {
        return res.status(HttpStatusCode.CREATED).json({
            success: HttpStatusCode.CREATED,
            message: message || 'Recurso creado exitosamente',
            data: data
        });
    }

    BAD_REQUEST(res: Response, message?: string, data?: any) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
            success: HttpStatusCode.BAD_REQUEST,
            message: message || 'Solicitud incorrecta',
            data: data
        });
    }

    UNAUTHORIZED(res: Response, message?: string, data?: any) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
            success: HttpStatusCode.UNAUTHORIZED,
            message: message || 'No autorizado',
            data: data
        });
    }

    FORBIDDEN(res: Response, message?: string, data?: any) {
        return res.status(HttpStatusCode.FORBIDDEN).json({
            success: HttpStatusCode.FORBIDDEN,
            message: message || 'Prohibido',
            data: data
        });
    }

    NOT_FOUND(res: Response, message?: string, data?: any) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
            success: HttpStatusCode.NOT_FOUND,
            message: message || 'Recurso no encontrado',
            data: data
        });
    }

    INTERNAL_SERVER_ERROR(res: Response, message?: string, data?: any) {
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: message || 'Error interno del servidor',
            data: data
        });
    }

}