import express, { Router, Request, Response } from 'express';
import AuthenticationController from '../controllers/AuthenticationController';
import AuthMiddleware from  '../middlewares/auth';
import { catchErrors } from '../helpers/responseHandler';
const router : Router = express.Router();

const ctrl  =  new AuthenticationController();
router.get('/', (req: Request, res : Response)=>{
    res.status(200);
    res.send('welcome');
});
router.post('/login', ctrl.login);
router.post('/token', ctrl.refreshToken);
router.get('/employees', catchErrors(AuthMiddleware.validateAccessToken), catchErrors(ctrl.getEmpData));

export = router;