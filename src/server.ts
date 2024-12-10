import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes'; // Rotas de autenticação

dotenv.config(); // Carrega variáveis de ambiente do arquivo .env

const app = express();

// Configuração do CORS
app.use(
  cors({
    origin: 'http://localhost:5173', // Permite apenas requisições do frontend local
    methods: ['GET', 'POST'], // Permite métodos GET e POST
  })
);

// Middleware para processar JSON no corpo das requisições
app.use(express.json());


// Rotas de autenticação
app.use('/auth', authRoutes);



// Rota principal para teste
app.get('/', (req, res) => {
  res.send('Servidor está funcionando! Use /auth para autenticação.');
});

// Função para conectar ao MongoDB e iniciar o servidor
const startServer = async () => {
  try {
    // Conexão ao MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('A variável de ambiente MONGO_URI não está configurada.');
    }

    await mongoose.connect(mongoUri); // A conexão agora não precisa de opções adicionais
    console.log('Conectado ao MongoDB com sucesso.');

    // Iniciando o servidor
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (err) {
    console.error('Erro ao iniciar o servidor:', err);
    process.exit(1); // Encerra o processo caso haja um erro crítico
  }
};

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
}));

// Iniciar a aplicação
startServer();
