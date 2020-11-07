const express = require('express');
const cors = require('cors');
const path = require('path');
const hbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session'); //do obsługi sesji.
const passportConfig = require('./config/passport');

const app = express();
app.engine('hbs', hbs({ extname: 'hbs', layoutsDir: './layouts', defaultLayout: 'main' })); //dodajemy obsługę szablonów Handlebars.
app.set('view engine', '.hbs');

//Na końcu musimy uruchomić w Expressie mechanizm sesji oraz zintegrować działanie Passportu z naszą aplikacją. Użyjemy jak zawsze middleware.
app.use(session({ secret: 'anything', resave: true, saveUninitialized: true })); //Obsługę sesji w Expressie uruchamia session({ secret: 
//'anything' }). Parametr secret służy do jej bardziej unikalnego kodowania, ponieważ jest wykorzystywany przy generowaniu i odczytywaniu 
//informacji o sesji. Jego nieprzewidywalność (sami decydujemy o treści) powoduje, że inne podmioty niż nasz serwer mają duży problem 
//z jej odkodowaniem. Użyj tutaj dowolnej wartości.
app.use(passport.initialize()); //inicjuje dzialanie paczki.
app.use(passport.session());//odpowiada za rozpoczynanie sesji po zalogowaniu użytkownika, która będzie trwała nawet po przejściu 
//z jednej podstrony na drugą. Wystarczy zalogować się raz, a serwer będzie o tym pamiętał – tak długo aż sami w końcu tą sesję zakończymy, 
//np. poprzez zamknięcie przeglądarki albo kliknięcie na jakiś button "Wyloguj".

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/auth', require('./routes/auth.routes'));
app.use('/user', require('./routes/user.routes'));

app.use('/', (req, res) => {
  res.status(404).render('notFound');
});

app.listen('8000', () => {
  console.log('Server is running on port: 8000');
});
