import {
    NextFunction,
    Request,
    Response,
} from 'express';
import { employeeData } from '../helpers/data';
import {
    ErrorCode,
    ErrorMsg,
    errorHandler,
    sendJSONResponse,
} from '../helpers/responseHandler';
import {
    Token, IToken, ITokenUser, generateToken,
} from '../models/authModel';
import * as jwt from 'jwt-simple';

export default class AuthenticationController {

    public async refreshToken(req: Request, res: Response, next : NextFunction) {
        try {
            if (!req.body && !req.body.refreshToken) {
                res.status(500);
                res.send('refresh token not found');
                return res;
            }

            const rawToken = req.body.refreshToken.replace('JWT ', '');
            const token = jwt.decode(rawToken, process.env.authSecret);
            console.log(token);
            if (!token.userId || !token.jti) {
                res.status(500);
                res.send('error occurred while fetching');
                return res;
            }

            const tokenObj = new Token(
                token.jti,
                token.userId,
                token.iss,
                token.exp,
                token.isRefreshToken,
                token.roleId,
                token.permissions,
            );

            // If the refresh token is expired then we can't continue
            if (tokenObj.isExpired()) {
                res.status(500);
                res.send('token expired');
                return res;
            }

            // Check in DB if jti is associated to userId
            // const auth = new Auth();
            // await auth.validateRefreshtoken(tokenObj.userId, tokenObj.jti); // on false it throws

            const user: ITokenUser = {
                userId: tokenObj.userId,
                roleId: tokenObj.roleId,
            };

            const accessToken: IToken = generateToken(user, false);
            const refreshToken: IToken = generateToken(user, true);

            return sendJSONResponse(res, 200, {
                accessToken: accessToken.token,
                accessTokenExpiresUtc: accessToken.expires,
                userId: tokenObj.userId,
                accessTokenExpiresInS: process.env.accessTokenLifespan,
                refreshToken: refreshToken.token,
                refreshTokenExpiresUtc: refreshToken.expires,
                refreshTokenExpiresInS: process.env.refreshTokenLifespan,
            });
        } catch (err) {
            console.log(err);
            res.status(500);
            res.send('error occurred while fetching');
            return res;
        }
    }

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // if (!req.body || !req.body.email || !req.body.password) {
            //     return next('error');
            // }
            // Check if user exists in DB
            // const auth = new Auth();
            // const user: ITokenUser = await auth.validateCredentials(req.params.email, req.params.password);
            const  user : ITokenUser = {
                userId: 'rasheed',
                roleId: 3,
            };
            const accessToken: IToken = generateToken(user, false);
            const refreshToken: IToken = generateToken(user, true);

            // the refresh token id (jti) should be store in the DB
            // await auth.storeTokenForUser(user.userId, refreshToken.jti, refreshToken.expires);
            return sendJSONResponse(res, 200, {
                accessToken: accessToken.token,
                accessTokenExpiresUtc: accessToken.expires,
                accessTokenExpiresInS: process.env.accessTokenLifespan,
                refreshToken: refreshToken.token,
                refreshTokenExpiresUtc: refreshToken.expires,
                refreshTokenExpiresInS: process.env.refreshTokenLifespan,
                userId: user.userId,
            });
        } catch (err) {
            res.status(500);
            res.send('error occurred while fetching');
        }
    };

    public async getEmpData(req: Request, res: Response) {
        try {
            res.status(200);
            res.json(employeeData);
        } catch (error) {
            console.log(error);
            res.status(500);
            res.send('error occurred while fetching');
        }
    }
}