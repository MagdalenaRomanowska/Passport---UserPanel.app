const express = require('express');
const passport = require('passport');
const router = express.Router();

// dodaję endpoint. Jego celem jest przekierowanie użytkownika do pośrednika. Osiągniemy to funkcją passport.authenticate.
router.get('/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }));
//rozkaz: po wejściu na link /auth/google przekieruj użytkownika do systemu autoryzacji Google i powiedz mu, że interesuje nas e-mail 
//i informacje o profilu. Przy przekierowaniu, Passport wyśle też pośrednikowi informacje, które skonfigurowaliśmy wcześniej, a więc clientID, 
//clientSecret i callbackURL. To będzie wykorzystywane przez providera w celu ustalenia, skąd jest przekierowanie i kto prosi o autoryzację.

//endpoint, do którego pośrednik (Google) przekieruje użytkownika po procesie autoryzacji. 
//passport.authenticate tu pozwala na przekierowanie użytkownika do pośrednika, ale też sprawdzenie, czy zalogowanie się udało. 
//Wystarczy, że w passport.authenticate zdefiniujemy jeszcze normalną obsługę requestu, a wtedy metoda będzie 
//traktowana jako zwykły middleware, który sprawdzi czy użytkownik jest zalogowany i czy należy go "przepuścić".
//Taki kod możemy rozumieć jak rozkaz: po powrocie użytkownika do /auth/google/callback, sprawdź czy udało się go zalogować; 
//jeśli nie, to przekieruj go do /user/no-permission, jeśli tak to przekieruj go do /user/logged.
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/user/no-permission' }),
    (req, res) => {
        res.redirect('/user/logged');
    }
);

module.exports = router;