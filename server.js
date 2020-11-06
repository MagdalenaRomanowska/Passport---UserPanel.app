const express = require('express');
const cors = require('cors');
const path = require('path');
const hbs = require('express-handlebars');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy; // paczka odpowiedzialna za możliwość użycia Google jako providera (pośrednika).
const session = require('express-session'); //do obsługi sesji.

const app = express();

passport.use(new GoogleStrategy({ //Aby odpowiednio skonfigurować Passport, skorzystamy z jego metody middleware passport.use. Najlepiej umieść go zaraz po inicjacji app.
  clientID: '117254354069-mlcv38i12ut60mom27qs3j15bqv0qnt9.apps.googleusercontent.com',
  clientSecret: '8_BDiDT0stHgCft1WDh0RIl7',
  callbackURL: 'http://localhost:8000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
done(null, profile);
}));

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

//Na końcu musimy uruchomić w Expressie mechanizm sesji oraz zintegrować działanie Passportu z naszą aplikacją. Użyjemy jak zawsze middleware.
app.use(session({ secret: 'anything', resave: true, saveUninitialized: true })); //Obsługę sesji w Expressie uruchamia session({ secret: 
//'anything' }). Parametr secret służy do jej bardziej unikalnego kodowania, ponieważ jest wykorzystywany przy generowaniu i odczytywaniu 
//informacji o sesji. Jego nieprzewidywalność (sami decydujemy o treści) powoduje, że inne podmioty niż nasz serwer mają duży problem 
//z jej odkodowaniem. Użyj tutaj dowolnej wartości.
app.use(passport.initialize()); //inicjuje dzialanie paczki.
app.use(passport.session());//odpowiada za rozpoczynanie sesji po zalogowaniu użytkownika, która będzie trwała nawet po przejściu 
//z jednej podstrony na drugą. Wystarczy zalogować się raz, a serwer będzie o tym pamiętał – tak długo aż sami w końcu tą sesję zakończymy, 
//np. poprzez zamknięcie przeglądarki albo kliknięcie na jakiś button "Wyloguj".

// dodaję endpoint. Jego celem jest przekierowanie użytkownika do pośrednika. Osiągniemy to funkcją passport.authenticate.
app.get('/auth/google',  
  passport.authenticate('google', { scope: ['email', 'profile'] }));
//rozkaz: po wejściu na link /auth/google przekieruj użytkownika do systemu autoryzacji Google i powiedz mu, że interesuje nas e-mail 
//i informacje o profilu. Przy przekierowaniu, Passport wyśle też pośrednikowi informacje, które skonfigurowaliśmy wcześniej, a więc clientID, 
//clientSecret i callbackURL. To będzie wykorzystywane przez providera w celu ustalenia, skąd jest przekierowanie i kto prosi o autoryzację.

app.get('/auth/google/callback', (req, res) => { //endpoint, do którego pośrednik (Google) przekieruje użytkownika po procesie autoryzacji. 
  res.send(`I'm back from Google!`);
});

app.engine('hbs', hbs({ extname: 'hbs', layoutsDir: './layouts', defaultLayout: 'main' })); //dodajemy obsługę szablonów Handlebars.
app.set('view engine', '.hbs');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/user/logged', (req, res) => {
  res.render('logged');
});

app.get('/user/no-permission', (req, res) => {
  res.render('noPermission');
});

app.use('/', (req, res) => {
  res.status(404).render('notFound');
});

app.listen('8000', () => {
  console.log('Server is running on port: 8000');
});
