const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { supabaseAdmin } = require('../utils/db');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const { data: user, error } = await supabaseAdmin
                .from('users')
                .select('*')
                .eq('username', username)
                .single();

            if (error || !user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            if (!isValidPassword) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return done(error, null);
        }

        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport; 