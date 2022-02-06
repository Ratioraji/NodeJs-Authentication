/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable no-shadow */
import moment from 'moment';
import { Random } from '../helpers/random';
import * as jwt from 'jwt-simple';

export class Token {
    readonly iss: string; // issuer

    readonly jti: string; // token ID

    readonly exp: number; // expiration timestamp

    readonly userId: string;

    readonly roleId: number;

    readonly permissions: number;

    readonly isRefreshToken: boolean;

    constructor(tokenId: string, userId: string, issuer: string, expiryDate: number, isRefreshToken = false, roleId = 100, permissions : any) {
        this.iss = issuer;
        this.jti = tokenId;
        this.exp = expiryDate;
        this.userId = userId;
        this.roleId = roleId;
        this.permissions = permissions;
        this.isRefreshToken = isRefreshToken;
    }

    isExpired(): boolean {
        if (this.exp < moment().utc().unix()) {
            return true;
        }
        return false;
    }
}

export interface IToken {
    jti: string;
    token: string;
    expires: string;
}

export interface ITokenUser {
    userId: string;
    roleId: number;
}

export const generateToken = (user: ITokenUser, isRefreshToken = true): IToken => {
    // get user permission

    const expires = isRefreshToken
        ? moment().utc().add({ seconds: parseInt(process.env.refreshTokenLifespan) }).unix()
        : moment().utc().add({ seconds: parseInt(process.env.accessTokenLifespan) }).unix();

    const jti: string = Random.string(20); // token ID
    const token = jwt.encode({
        iss: 'API', // issuer
        jti,
        exp: expires,
        userId: user.userId,
        roleId: user.roleId,
        isRefreshToken,
    }, process.env.authSecret);

    return {
        jti,
        token: `${token}`,
        expires: moment.unix(expires).format(),
    };
};

// NOTE: will only decode access tokens (not refresh tokens)
export const decodeToken = (token: string): { e: any, token?: Token } => {
    try {
        const d = jwt.decode(token.replace('JWT ', ''), process.env.authSecret);
        if (d.iss && d.jti && d.exp && d.userId && d.roleId && d.isRefreshToken === false) {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const token = new Token(
                d.jti,
                d.userId,
                d.iss,
                d.exp,
                d.isRefreshToken,
                d.roleId,
                d.permissions,
            );
            return { e: 'error occurred', token };
        }
        return { e: 'error occurred' };
    } catch (err) {
        return { e: 'error occurred' };
    }
};
