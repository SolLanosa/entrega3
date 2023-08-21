import express from 'express';
import passport from 'passport';
import {UserDTO} from '../controllers/DTO/user.dto.js'
import SessionController from '../controllers/session.controller.js';
const router = express.Router();
const sessionController = new SessionController();

router.post("/register", passport.authenticate('register', {failureRedirect: '/failregister'}), async (req, res) => {
  res.send({ status: "success", message: "usuario  registrado" });
})

router.get('/failregister', async(req, res) => {
  res.send({error: 'Failed'})
})

router.post("/login", passport.authenticate('login', {failureRedirect: '/faillogin'}),  async (req, res) => {
  const { email, password } = req.body;
    if(!req.user) return res.status(400).send({status: 'error', error:'invalid credentials'})
    req.session.user = req.user
    const dto = new UserDTO(req.user)
    res.send({ status: "success", payload:dto });
});

router.get('/faillogin', (req, res)  => {
  res.send({error: 'Failed Login'})
})

router.post('/restartPassword', async(req,res)=>{
  const {email,password} = req.body;
  if(!email||!password) return res.status(400).send({status:"error",error:"Incomplete Values"});
  sessionController.resetPassword(email, password)
  res.send({status:"success",message:"Contraseña restaurada"});
})

router.get('/github', passport.authenticate('github', {scope:['user: email']}), async(req, res) => {})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login'}), async(req, res) => {
  req.session.user = req.user;
  res.redirect('/products')
})

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.json({status: 'logout error', body: err})
    }
    res.send('Logout ok!')
  })
})

router.get('/current', (req, res) => {
  const user = req.session.user;
  const dto = new UserDTO(user)
  res.send(dto)
})


export default router