import express from 'express';
import userModel from '../daos/mongodb/models/user.model.js';

const router = express.Router();

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  const exist = await userModel.findOne({ email });

  if (exist)
    return res
      .status(400)
      .send({ status: "error", message: "usuario ya registrado" });

  let result = await userModel.create({
    first_name,
    last_name,
    email,
    age,
    password,
  });

  res.send({ status: "success", message: "usuario  registrado" });
})


router.post("/login",  async (req, res) => {
  const { email, password } = req.body;
  if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
    req.session.user = {
      name: 'Admin', 
      email: email,
      role: 'admin'
      }
  } else {
    const user = await userModel.findOne({ email: email, password: password });
    if (!user) return res
      .status(400)
      .send({ status: "error", message: "datos no encontrados" });

    req.session.user = {
      name: user.first_name + ' ' + user.last_name,
      email: user.email,
      age: user.age,
    };
  }
  res.send({ status: "success", message: req.session.user });
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.json({status: 'logout error', body: err})
    }
    res.send('Logout ok!')
  })
})



export default router