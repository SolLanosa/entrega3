import express from 'express';
import userModel from '../daos/mongodb/models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';
import passport from 'passport';

const router = express.Router();

router.post("/register", passport.authenticate('register', {failureRedirect: '/failregister'}), async (req, res) => {
  res.send({ status: "success", message: "usuario  registrado" });
})

router.get('/failregister', async(req, res) => {
  res.send({error: 'Failed'})
})

router.post("/login", passport.authenticate('login', {failureRedirect: '/faillogin'}),  async (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    req.session.user = {
      name: 'Admin', 
      email: email,
      role: 'admin'
      }
      res.send({ status: "success", message: req.session.user });
  } else {
    if(!req.user) return res.status(400).send({status: 'error', error:'invalid credentials'})
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      role: 'usuario', 
      cart: req.user.cart
    }
    res.send({ status: "success", payload:req.user });
  }
});

router.get('/faillogin', (req, res)  => {
  res.send({error: 'Failed Login'})
})

router.post('/restartPassword',async(req,res)=>{
  const {email,password} = req.body;
  if(!email||!password) return res.status(400).send({status:"error",error:"Incomplete Values"});
  const user = await userModel.findOne({email});
  if(!user) return res.status(404).send({status:"error",error:"Not user found"});
  const newHashedPassword = createHash(password);
  await userModel.updateOne({_id:user._id},{$set:{password:newHashedPassword}});
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
  res.send(user)
})


export default router