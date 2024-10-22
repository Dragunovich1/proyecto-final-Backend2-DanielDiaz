const passport = require('passport');
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');

// Configuración de la estrategia JWT
const options = {
    jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.token]),
    secretOrKey: 'secreto'
};

passport.use(new JwtStrategy(options, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

// Serializar y deserializar el usuario para la sesión
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Estrategia de Google
/*passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Primero buscamos al usuario por Google ID o Email
        let user = await User.findOne({ $or: [{ googleId: profile.id }, { email: profile.emails[0].value }] });
        if (!user) {
            // Si no existe, lo creamos
            user = await new User({
                first_name: profile.name.givenName,
                last_name: profile.name.familyName,
                email: profile.emails[0].value,
                googleId: profile.id,
                age: 0, // Asignar valor por defecto o solicitarlo posteriormente
                password: '', // No se necesita una contraseña para login social
                role: 'user'
            }).save();
        }
        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
}));
*/

// Estrategia de Facebook
/* passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: '/api/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Primero buscamos al usuario por Facebook ID o Email
        let user = await User.findOne({ $or: [{ facebookId: profile.id }, { email: profile.emails[0].value }] });
        if (!user) {
            // Si no existe, lo creamos
            user = await new User({
                first_name: profile.name.givenName,
                last_name: profile.name.familyName,
                email: profile.emails[0].value,
                facebookId: profile.id,
                age: 0, // Asignar valor por defecto o solicitarlo posteriormente
                password: '', // No se necesita una contraseña para login social
                role: 'user'
            }).save();
        }
        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
})); */

module.exports = passport;
