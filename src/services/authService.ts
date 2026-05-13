import { prisma } from '../config/prisma';
import { AuthUtils } from '../utils/authUtils';
import { LoginCredentials, LoginResult, RegisterCredentials, RegisterResult, TokenPayload } from '../types/authTypes';
import bcrypt from 'bcryptjs';

export class AuthService {

    private authUtils: AuthUtils;

    constructor() {
        this.authUtils = new AuthUtils();
    }

    async login(credentials: LoginCredentials): Promise<LoginResult> {

        try {

            if (!credentials.email || !credentials.password) {
                throw new Error('Email y contraseña son requeridos');
            }

            const user = await prisma.user.findUnique({ where: { email: credentials.email } });

            if (!user) {
                throw new Error('Credenciales inválidas');
            }

            const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

            if (!isPasswordValid) {
                throw new Error('Credenciales inválidas');
            }

            const payload: TokenPayload = {
                userId: user.id,
                email: user.email,
                role: user.role
            }

            const accessToken: string = await this.authUtils.generateToken(payload);
            const refreshToken: string = await this.authUtils.generateRefreshToken(payload);

            return {
                accessToken,
                refreshToken
            }

        } catch (error) {
            console.log("Error en login", error);

            if (error instanceof Error) {
                throw error;
            }

            throw new Error('Error en el proceso de login');
        }

    }

    async register(credentials: RegisterCredentials): Promise<RegisterResult> {

        try {

            if (!credentials.email || !credentials.password || !credentials.firstName || !credentials.lastName) {
                throw new Error('Todos los campos son requeridos');
            }

            const existingUser = await prisma.user.findUnique({ where: { email: credentials.email } });

            if (existingUser) {
                throw new Error('Correo electronico ya registrado');
            }

            const passwordHash = await bcrypt.hash(credentials.password, 10);

            const newUser = await prisma.user.create({
                data: {
                    email: credentials.email,
                    password: passwordHash,
                    firstName: credentials.firstName,
                    lastName: credentials.lastName
                }
                , select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true
                }
            })

            const payload: TokenPayload = {
                userId: newUser.id,
                email: newUser.email,
                role: newUser.role
            }

            const accessToken: string = await this.authUtils.generateToken(payload);
            const refreshToken: string = await this.authUtils.generateRefreshToken(payload);

            return {
                userId: newUser.id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role,
                accessToken,
                refreshToken
            }

        } catch (error) {
            console.log("Error en register", error);

            if (error instanceof Error) {
                throw error;
            }

            throw new Error('Error en el proceso de registro');
        }

    }

    async refreshToken(token: string): Promise<LoginResult> {
        try {

            if (!token) {
                throw new Error('Token de refresh es requerido');
            }

            const verifiedPayload = await this.authUtils.verifyRefreshToken(token);

            if (!verifiedPayload || typeof verifiedPayload === 'string') {
                throw new Error('Token de refresh inválido');
            }

            const payload: TokenPayload = {
                userId: verifiedPayload.userId,
                email: verifiedPayload.email,
                role: verifiedPayload.role
            }

            const accessToken: string = await this.authUtils.generateToken(payload);
            const refreshToken: string = await this.authUtils.generateRefreshToken(payload);

            return {
                accessToken,
                refreshToken
            };

        }catch (error) {
            console.log("Error en refreshToken", error);

            if (error instanceof Error) {
                throw error;
            }

            throw new Error('Error en el proceso de refresh token');
        }
    }

    async changePassword(email: string, newPassword: string, actualPassword: string): Promise<void> {
        try {

            if (!email || !newPassword || !actualPassword) {
                throw new Error('Email, contraseña actual y nueva contraseña son requeridos');
            }

            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            const isPasswordValid = await bcrypt.compare(actualPassword, user.password);

            if (!isPasswordValid) {
                throw new Error('Contraseña actual incorrecta');
            }

            const newPasswordHash = await bcrypt.hash(newPassword, 10);

            await prisma.user.update({
                where: { email },
                data: { password: newPasswordHash }
            });

        } catch (error) {
            console.log("Error en changePassword", error);

            if (error instanceof Error) {
                throw error;
            }

            throw new Error('Error en el proceso de cambio de contraseña');
        }
    }

    

}