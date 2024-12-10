import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { isEmail } from 'validator'; // Usando o validator.js para validar o email

// Função para validar a senha
const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// Função para validar o telefone
const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[-]?\d{4}$/;
  return phoneRegex.test(phone);
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, phone, address } = req.body;

    // Validar campos de entrada
    const validationErrors: string[] = [];
    
    if (!isEmail(email)) {
      validationErrors.push('Formato de email inválido');
    }
    if (!validatePassword(password)) {
      validationErrors.push('Senha muito fraca. Use uma senha com pelo menos 6 caracteres');
    }
    if (phone && !validatePhone(phone)) {
      validationErrors.push('Número de telefone inválido');
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({ message: validationErrors.join(', ') });
    }

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criando o novo usuário
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      address
    });

    await newUser.save();

    return res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Verificar se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verificar se a senha é válida
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gerar um token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

// // Função para buscar informações de um usuário específico
// export const userInfo = async (req: Request, res: Response) => {
//   try {
//     // O userId já foi adicionado à requisição pelo middleware authenticate
//     const userId = req.userId;

//     // Buscar as informações do usuário no banco de dados
//     const user = await User.findById(userId).select('-password'); // Exclui a senha do retorno
//     if (!user) {
//       return res.status(404).json({ message: 'Usuário não encontrado' });
//     }

//     return res.status(200).json(user);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Erro no servidor' });
//   }
// };


export const getUsers = async (req: Request, res: Response) => {
  console.log('GET /auth/users foi acessado');
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
};