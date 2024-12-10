"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth")); // Rotas de autenticação
dotenv_1.default.config(); // Carrega variáveis de ambiente do arquivo .env
const app = (0, express_1.default)();
// Configuração do CORS
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // Permite apenas requisições do frontend local
    methods: ['GET', 'POST'], // Permite métodos GET e POST
}));
// Middleware para processar JSON no corpo das requisições
app.use(express_1.default.json());
// Rotas de autenticação
app.use('/auth', auth_1.default);
// Rota principal para teste
app.get('/', (req, res) => {
    res.send('Servidor está funcionando! Use /auth para autenticação.');
});
// Função para conectar ao MongoDB e iniciar o servidor
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Conexão ao MongoDB
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('A variável de ambiente MONGO_URI não está configurada.');
        }
        yield mongoose_1.default.connect(mongoUri); // A conexão agora não precisa de opções adicionais
        console.log('Conectado ao MongoDB com sucesso.');
        // Iniciando o servidor
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
        });
    }
    catch (err) {
        console.error('Erro ao iniciar o servidor:', err);
        process.exit(1); // Encerra o processo caso haja um erro crítico
    }
});
// Iniciar a aplicação
startServer();
