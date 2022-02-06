import { NextFunction, Response } from 'express';

/**
 *
 * All async methods should fail with 'throw IError'
 * ie.: throw { errorMsg: ErrorMsg.General_DatabaseError, errorCode: ErrorCode.InternalServerError }
 *
 */
export class Error {
    errorMsg: ErrorMsg;

    errorCode?: ErrorCode;

    constructor(errorMsg: ErrorMsg, errorCode?: ErrorCode) {
        this.errorMsg = errorMsg;
        this.errorCode = errorCode;
    }
}

export const errorHandler = (err: any, res: Response, next: NextFunction): any => {
    return next(res.send(''),
    );
};
export const catchErrors = (fn) =>{
    return function (req, res, next) {
        return fn(req, res, next).catch(next);
    };
};

export const sendJSONResponse = (res : Response, status : number, data : any) =>{
    res.status(status);
    res.json({ ...data, ...{ status:true } });
};
/**
 *
 * All possible error messages that will be returned in the error response
 *
 */
export enum ErrorMsg {
    Null = '',

    // General errors
    General_DatabaseError = 'General_DatabaseError',
    General_NotFoundError = 'General_NotFound',
    General_InternalServerError = 'General_InternalServerError',
    General_MissingRequiredData = 'General_MissingRequiredData',
}

/**
 *
 * Needs to exist in restify-errors
 * Will be returned in the erorr response alongside
 * its corresponding error code (401, 402...)
 *
 */
export enum ErrorCode {
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    MethodNotAllowedError,
    InternalServerError,
    ServiceUnavailableError,
}

