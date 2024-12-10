import express from 'express';
import { registerUser, loginUser, getUsers } from '../controllers/authController';


const router = express.Router();

// Middleware para tratar erros
const errorHandler = (handler: Function) => async (req: express.Request, res: express.Response) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Rota para registrar usuário
router.post('/register', errorHandler(registerUser));

// Rota para login de usuário
router.post('/login', errorHandler(loginUser));

// Rota para Mostrar informações de um usuário específico

// Rota para obter todos os usuários
router.get('/users', ()=>{
  console.log('Esta FUNCIONANDO??????????')
} );


export default router;
