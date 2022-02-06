import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Token } from '../models/authModel';

export default class AuthMiddleware {
    static validateAccessToken = async (req: Request, res: Response, next: NextFunction) => {
        AuthMiddleware.initialize();
        passport.authenticate('jwt', { session: false, failWithError: true }, async (err, token: any, info) => {

            // Can't decode token
            if (err || !token) {
                console.log(err, token, info );
                return next('error caught');
            }

            // refresh tokens can't be used as access tokens
            if (token.isRefreshToken === true) {
                return next('refresh  cant be used');
            }

            // token expired
            console.log(token.isExpired, 'token');
            if (token.isExpired()) {
                return next('expired');
            }
            // set session details
            // req._locals = token;
            return next();
        })(req, res);
    };

    static getAccessTokenFromHeader = async (req: Request, res: Response, next: NextFunction) => {
        AuthMiddleware.initialize();
        passport.authenticate('jwt', { session: false, failWithError: true }, (err, token: any, info) => {
            // Can't decode token
            if (err || !token) {
                return next();
            }

            // access tokens can't be used as refresh tokens
            if (token.isRefreshToken === false) {
                return next();
            }

            // token expired
            if (token.isExpired()) {
                return next();
            }

            // set session details
            // req._locals = token;
            return next();
        })(req, res);
    };

    private static initialize = () => {
        passport.use('jwt', AuthMiddleware.getStrategy());
        return passport.initialize();
    };

    private static getStrategy = (): Strategy => {
        const params: any = {
            secretOrKey: process.env.authSecret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true,
        };
        return new Strategy(params, (req: any, payload: any, done: any) => {
            const token = new Token(payload.jti, payload.userId, payload.iss, payload.exp, payload.isRefreshToken, payload.roleId, undefined);
            console.log(token, 'token ins');
            return done(undefined, token);
        });
    };
}
