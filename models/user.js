const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Definir el esquema del usuario
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    age: {
        type: Number,
        required: false  // Ahora no es obligatorio
    },
    password: {
        type: String,
        required: false  // Ahora no es obligatorio para usuarios de Google/Facebook
    },
    googleId: {
        type: String  // Campo adicional para almacenar el ID de Google
    },
    facebookId: {
        type: String  // Campo adicional para almacenar el ID de Facebook
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    role: {
        type: String,
        default: 'user'
    }
});

// Método para encriptar la contraseña antes de guardar el usuario
userSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

// Verificar si el modelo ya ha sido registrado para evitar OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
