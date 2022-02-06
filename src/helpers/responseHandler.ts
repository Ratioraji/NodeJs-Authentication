import { NextFunction, Response } from 'express';

export const catchErrors = (fn) =>{
    return function (req, res, next) {
        return fn(req, res, next).catch(next);
    };
};

export const sendJSONResponse = (res : Response, status : number, data : any) =>{
    res.status(status);
    res.json({ ...data, ...{ status:true } });
};

