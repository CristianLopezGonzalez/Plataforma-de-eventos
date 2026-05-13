import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config/env';
import bcrypt from 'bcryptjs'
export class AuthUtils {

    async generateToken(payload: object):Promise<string> {
        return jwt.sign(payload, config.jwt.secret, {expiresIn:"1h",});
    }

    async verifyToken(token: string): Promise<JwtPayload | string> {
        try {
            return jwt.verify(token, config.jwt.secret);
        }catch (error) {
            console.log(error);
            throw new Error("Invalid token");
        }
    }

    async generateRefreshToken(payload: object):Promise<string> {
        return jwt.sign(payload, config.jwt.secret, {expiresIn:"7d",});
    }

    async verifyRefreshToken(token: string): Promise<JwtPayload | string> {
        try {
            return jwt.verify(token, config.jwt.secret);
        }catch (error) {
            console.log(error);
            throw new Error("Invalid refresh token");
        }
    }
}