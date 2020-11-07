const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;// paczka odpowiedzialna za możliwość użycia Google jako providera (pośrednika).

passport.use(new GoogleStrategy({ //Aby odpowiednio skonfigurować Passport, skorzystamy z jego metody middleware passport.use. Najlepiej umieść go zaraz po inicjacji app.
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.callbackURL
}, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
    //console.log(profile);
}));
//accessToken - unikalny kod, dzięki któremu serwer może w każdej chwili pobrać informację o danym użytkowniku.
//refreshToken - accessToken po jakimś czasie wygasa, dlatego Google dostarcza nam również refreshToken. 
//Posiadając go, możemy poprosić o wygenerowanie nowego accessToken. Po co taka kombinacja? Dzięki temu, nawet 
//jeśli ktoś zdobędzie Twój accessToken, będzie mógł z niego korzystać tylko przez ograniczony czas.
//profile - dane o użytkowniku, o które prosiliśmy.
//done - funkcja, której wywołanie poinformuje Passport, że może zająć się już inicjacją sesji. Przekazujemy 
//tutaj informację o profilu użytkownika, bo właśnie na jego bazie utworzymy sesję. Zanim ten profil będzie 
//zapisany do sesji, Passport skorzysta z mechanizmu serializacji. Czyli serwer otrzymuje od pośrednika dane 
//o użytkowniku i inicjuje sesję.

//Aby jednak mechanizm sesji mógł działać poprawnie, musimy uruchomić jeszcze funkcjonalności serializacji i deserializacji. Użytkownik, 
//który będzie się u nas logował to obiekt, który posiada kilka atrybutów, np. e-mail czy nazwę użytkownika. Nie możemy jednak zapisywać 
//w sesji bezpośrednio obiektów JSowych, stąd też będziemy musieli serializować te informacje do ciągu znaków. Poniższy kod o to zadba.
//Passport sam zadba o uruchamianie ich wtedy kiedy będą potrzebne.
// serialize user when saving to session
passport.serializeUser((user, serialize) => {
    serialize(null, user);
});

// deserialize user when reading from session
passport.deserializeUser((obj, deserialize) => {
    deserialize(null, obj);
});