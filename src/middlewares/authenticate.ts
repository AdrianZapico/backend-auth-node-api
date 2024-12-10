// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// const authenticate = (req: Request, res: Response, next: NextFunction): void => {
//   try {
//     // Obter o token do cabeçalho Authorization
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ message: 'Token não fornecido' });
//     }

//     // Verificar e decodificar o token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { userId: string };
//     if (!decoded.userId) {
//       return res.status(401).json({ message: 'Token inválido' });
//     }

//     // Passar o userId para a requisição (não retorna nada aqui)
//     req.userId = decoded.userId;

//     // Chama o próximo middleware ou controlador
//     next();
//   } catch (error) {
//     console.error(error);
//     // No caso de erro, apenas finaliza a requisição com uma resposta de erro
//     return res.status(500).json({ message: 'Erro no servidor' });
//   }
// };

// export default authenticate;
