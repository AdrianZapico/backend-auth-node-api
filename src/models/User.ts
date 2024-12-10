import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface para o modelo de usuário
export interface IUser extends Document {
  firstName: string; // Nome
  lastName: string;  // Sobrenome
  email: string;     // Email
  password: string;  // Senha
  phone?: string;    // Telefone (opcional)
  address?: string;  // Endereço (opcional)
  createdAt?: Date;  // Criado automaticamente
  updatedAt?: Date;  // Atualizado automaticamente
}

// Definindo o esquema do modelo de usuário
const UserSchema: Schema<IUser> = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    phone: {
      type: String,
      required: false, // Opcional
      trim: true,
      match: [
        /^\(?\d{2}\)?[\s-]?\d{4,5}[-]?\d{4}$/,
        'Please provide a valid phone number',
      ],
    },
    address: {
      type: String,
      required: false, // Opcional
      trim: true,
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  }
);

// Método para evitar que a senha seja exposta no retorno JSON
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Criando o modelo de usuário com base no esquema
const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);



export default User;
