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
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const validator_1 = require("validator"); // Usando o validator.js para validar o email
// Função para validar a senha
const validatePassword = (password) => {
    return password.length >= 6;
};
// Função para validar o telefone
const validatePhone = (phone) => {
    const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[-]?\d{4}$/;
    return phoneRegex.test(phone);
};
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, phone, address } = req.body;
        // Validar campos de entrada
        const validationErrors = [];
        if (!(0, validator_1.isEmail)(email)) {
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
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }
        // Criptografar a senha
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Criando o novo usuário
        const newUser = new User_1.default({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            address
        });
        yield newUser.save();
        return res.status(201).json({ message: 'Usuário registrado com sucesso' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro no servidor' });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Verificar se o usuário existe
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        // Verificar se a senha é válida
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }
        // Gerar um token JWT
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
        return res.json({ token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro no servidor' });
    }
});
exports.loginUser = loginUser;
