import express from 'express';
import UserController from '../controllers/user.controller.js'
import { rolesMiddleWareAdmin } from './middlewares/roles.middelware.js';
import passport from 'passport';
import { uploader } from '../utils.js';
const router = express.Router();
const userController = new UserController();

router.post('/premium/:uid', passport.authenticate('session'), rolesMiddleWareAdmin, async (req, res, next) =>  {
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

router.post('/:uid/documents', uploader('documents').fields([{name:"identificacion", maxCount: 1},{name:"domicilio", maxCount: 1},{name:"estado de cuenta", maxCount: 1}]), async (req, res, next) => {
    try {
        const uid = req.params.uid;
        const files = req.files
        console.log(files)
        await userController.uploadDocuments(uid, files)
        res.send({ status: "success" });
    } catch(e) {
        next(e)
    }
} )

router.get('/', async (req, res,next) => {
    try {
       const users =  await userController.getUsers(req)
        res.send(users)
    } catch(e) {
        next(e)
    }
})

router.delete('/',  passport.authenticate('session'), rolesMiddleWareAdmin,  async (req, res, next) => {
    try {
        await userController.deleteInactiveUsers()
        res.send({ status: "success" })
    } catch(e) {
        next(e)
    }
})


router.delete('/:uid', passport.authenticate('session'), rolesMiddleWareAdmin,  async (req, res, next) => {
    try {
        const uid = req.params.uid;
        await userController.deleteUser(uid);
        res.send({ status: "success" });
    } catch(e) {
        next(e)
    }
}) 

export default router