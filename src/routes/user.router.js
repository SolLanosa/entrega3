import express from 'express';
import UserController from '../controllers/user.controller.js'
import { rolesMiddleWareAdmin } from './middlewares/roles.middelware.js';
import passport from 'passport';
const router = express.Router();
const userController = new UserController();

router.post('/premium/:uid',passport.authenticate('session'), rolesMiddleWareAdmin, async (req, res, next) =>  {
    try {
        const {role} = req.body;
        const uid = req.params.uid;
        await userController.changeRole(uid, role)
        res.send({ status: "success" });
    }
    catch(e) {
        next(e)
    }
})

export default router