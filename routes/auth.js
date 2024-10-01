const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }
        const newUser = new User({ first_name, last_name, email, age, password });
        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario', error });
    }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }
        const token = jwt.sign({ id: user._id, email: user.email }, 'secreto', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true }).json({ message: 'Login exitoso', token });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
});


// Ruta para Google Login
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Callback de Google
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/'
}));

// Ruta para Facebook Login
router.get('/facebook', passport.authenticate('facebook', {
    scope: ['email']
}));

// Callback de Facebook
router.get('/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/login',
    successRedirect: '/'
}));

// Otras rutas de autenticación...
// Logout, login local, etc.

module.exports = router;
